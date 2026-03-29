import json
import os
import time
from typing import Any, Dict, List, Optional

import boto3
from botocore.exceptions import ClientError

from bedrock_client import BedrockJSONError, extract_profile

dynamodb = boto3.resource("dynamodb")
users_table = dynamodb.Table(os.environ["DYNAMODB_TABLE_USERS"])
convo_table = dynamodb.Table(os.environ["DYNAMODB_TABLE_CONVERSATIONS"])


def _get_user_id(event: Dict[str, Any]) -> str:
    try:
        return event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
    except (KeyError, TypeError):
        return (event.get("headers") or {}).get("x-user-id", "demo-user")


def _get_email(event: Dict[str, Any]) -> str:
    try:
        claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
        return claims.get("email", "") or claims.get("cognito:username", "")
    except (KeyError, TypeError):
        return ""


def lambda_handler(event, context):
    user_id = _get_user_id(event)
    method = (event.get("requestContext") or {}).get("http", {}).get("method", "GET")

    if method == "GET":
        return _get_profile(user_id, event)
    return _put_profile(user_id, event)


def _get_profile(user_id: str, event: Dict[str, Any]):
    resp = users_table.get_item(Key={"userId": user_id})
    item = resp.get("Item")

    if not item:
        # Auto-create on first GET (new user after Cognito login)
        email = _get_email(event)
        item = {
            "userId": user_id,
            "email": email,
            "createdAt": int(time.time()),
            "onboardingComplete": False,
            "profile": {},
        }
        try:
            users_table.put_item(
                Item=item,
                ConditionExpression="attribute_not_exists(userId)",
            )
        except ClientError as e:
            if e.response["Error"]["Code"] != "ConditionalCheckFailedException":
                raise
            # Already exists — re-fetch
            resp = users_table.get_item(Key={"userId": user_id})
            item = resp.get("Item", item)

    return _response(200, {
        "userId": user_id,
        "email": item.get("email", ""),
        "profile": item.get("profile") or None,
        "onboardingComplete": bool(item.get("onboardingComplete", False)),
        "createdAt": item.get("createdAt"),
    })


def _put_profile(user_id: str, event: Dict[str, Any]):
    body = json.loads(event.get("body") or "{}")
    conversation_id = body.get("conversationId")

    if conversation_id:
        resp = convo_table.get_item(Key={"userId": user_id, "conversationId": conversation_id})
        item = resp.get("Item")
        convo = item.get("messages", []) if item else []
        try:
            profile = extract_profile(convo)
        except BedrockJSONError as exc:
            return _response(500, {"error": str(exc)})
    else:
        profile = body.get("profile", {})

    users_table.update_item(
        Key={"userId": user_id},
        UpdateExpression="SET #p = :p, onboardingComplete = :oc, updatedAt = :t",
        ExpressionAttributeNames={"#p": "profile"},
        ExpressionAttributeValues={
            ":p": profile,
            ":oc": True,
            ":t": int(time.time()),
        },
    )
    return _response(200, {"userId": user_id, "profile": profile, "onboardingComplete": True})


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
