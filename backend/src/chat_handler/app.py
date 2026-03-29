import json
import os
import time
import uuid
from typing import Any, Dict, List, Optional

import boto3
from botocore.exceptions import ClientError

from bedrock_client import BedrockJSONError, invoke_chat, new_conversation_id

dynamodb = boto3.resource("dynamodb")
convo_table = dynamodb.Table(os.environ["DYNAMODB_TABLE_CONVERSATIONS"])
users_table = dynamodb.Table(os.environ["DYNAMODB_TABLE_USERS"])


def _get_user_id(event: Dict[str, Any]) -> str:
    try:
        return event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
    except (KeyError, TypeError):
        return (event.get("headers") or {}).get("x-user-id", "demo-user")


def _get_user_email(event: Dict[str, Any]) -> str:
    try:
        claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
        return claims.get("email", "") or claims.get("cognito:username", "")
    except (KeyError, TypeError):
        return ""


def _load_conversation(user_id: str, conversation_id: str) -> List[Dict[str, Any]]:
    try:
        resp = convo_table.get_item(Key={"userId": user_id, "conversationId": conversation_id})
        item = resp.get("Item")
        return item.get("messages", []) if item else []
    except Exception:
        return []


def _get_user_item(user_id: str) -> Optional[Dict]:
    try:
        resp = users_table.get_item(Key={"userId": user_id})
        return resp.get("Item")
    except Exception:
        return None


def _ensure_user_exists(user_id: str, email: str) -> None:
    """Create user record if it doesn't exist yet."""
    try:
        users_table.put_item(
            Item={
                "userId": user_id,
                "email": email,
                "createdAt": int(time.time()),
                "onboardingComplete": False,
                "profile": {},
            },
            ConditionExpression="attribute_not_exists(userId)",
        )
    except ClientError as e:
        # Already exists — that's fine
        if e.response["Error"]["Code"] != "ConditionalCheckFailedException":
            raise


def _save_profile_update(user_id: str, profile_update: Dict) -> None:
    """Merge profile_update into the existing profile in DynamoDB."""
    # Get current profile
    item = _get_user_item(user_id) or {}
    current_profile = item.get("profile") or {}

    # Merge new fields in
    current_profile.update({k: v for k, v in profile_update.items() if v})
    current_profile["updatedAt"] = int(time.time())

    # Determine if onboarding is complete (we have at least profession + goals)
    onboarding_done = bool(
        current_profile.get("profession") and current_profile.get("financialGoals")
    )

    users_table.update_item(
        Key={"userId": user_id},
        UpdateExpression="SET #p = :p, onboardingComplete = :oc, updatedAt = :t",
        ExpressionAttributeNames={"#p": "profile"},
        ExpressionAttributeValues={
            ":p": current_profile,
            ":oc": onboarding_done,
            ":t": int(time.time()),
        },
    )


def _persist_conversation(user_id: str, conversation_id: str, messages: List[Dict]) -> None:
    convo_table.put_item(Item={
        "userId": user_id,
        "conversationId": conversation_id,
        "messages": messages,
        "updatedAt": int(time.time()),
    })


def _synthesize_audio(user_id: str, text: str) -> Optional[str]:
    bucket = os.environ.get("POLLY_AUDIO_BUCKET")
    voice = os.environ.get("POLLY_VOICE_ID", "Joanna")
    if not bucket:
        return None
    try:
        polly = boto3.client("polly")
        s3 = boto3.client("s3")
        audio = polly.synthesize_speech(
            Text=text[:2999],
            VoiceId=voice,
            OutputFormat="mp3",
            Engine="neural",
        )
        key = f"polly/{user_id}/{uuid.uuid4()}.mp3"
        s3.put_object(Bucket=bucket, Key=key, Body=audio["AudioStream"].read(), ContentType="audio/mpeg")
        return s3.generate_presigned_url("get_object", Params={"Bucket": bucket, "Key": key}, ExpiresIn=300)
    except Exception:
        return None


def lambda_handler(event, context):
    user_id = _get_user_id(event)
    email = _get_user_email(event)
    raw_body = event.get("body") or "{}"
    if isinstance(raw_body, (dict, list)):
        body = raw_body
    else:
        body = json.loads(raw_body)
    message = body.get("message", "").strip()
    conversation_id = body.get("conversationId") or new_conversation_id()
    voice_enabled = bool(body.get("voiceEnabled", False))

    if not message:
        return _response(400, {"error": "message is required"})

    # 1. Ensure user record exists in DynamoDB
    _ensure_user_exists(user_id, email)

    # 2. Load conversation history + current profile
    history = _load_conversation(user_id, conversation_id)
    user_item = _get_user_item(user_id)
    user_profile = (user_item or {}).get("profile") or {}

    # Onboarding = profile incomplete (no profession yet)
    onboarding = not bool(user_profile.get("profession"))

    # 3. Append user message to history
    history.append({"role": "user", "content": message, "ts": int(time.time())})

    # 4. Call Bedrock
    try:
        result = invoke_chat(history, onboarding=onboarding, user_profile=user_profile)
    except BedrockJSONError as exc:
        return _response(500, {"error": str(exc)})

    reply = result.get("reply") or result.get("response", "")
    user_type = result.get("user_type", "User")
    actions = result.get("actions", [])[:3]
    profile_update = result.get("profile_update")  # dict or None

    # 5. Append assistant message
    history.append({
        "role": "assistant",
        "content": reply,
        "ts": int(time.time()),
        "actions": actions,
        "user_type": user_type,
    })

    # 6. Persist conversation
    _persist_conversation(user_id, conversation_id, history)

    # 7. Save profile update if AI extracted one
    if profile_update and isinstance(profile_update, dict):
        _save_profile_update(user_id, profile_update)

    # 8. Reload to get latest state
    updated_item = _get_user_item(user_id) or {}
    updated_profile = updated_item.get("profile") or {}
    onboarding_complete = bool(updated_item.get("onboardingComplete", False))

    # 9. Optional TTS
    audio_url = _synthesize_audio(user_id, reply) if voice_enabled and reply else None

    return _response(200, {
        "reply": reply,
        "response": reply,
        "user_type": user_type,
        "conversationId": conversation_id,
        "actions": actions,
        "onboardingComplete": onboarding_complete,
        "audioUrl": audio_url,
        "profile": updated_profile,
    })


def _response(status: int, body: Dict[str, Any]):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
        "body": json.dumps(body, default=str),
    }