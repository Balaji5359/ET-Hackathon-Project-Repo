"""
Bedrock client using Amazon Nova Lite (amazon.nova-lite-v1:0).
Nova API format:
  Request:  {"messages": [{"role": "user", "content": [{"text": "..."}]}],
             "system": [{"text": "..."}],
             "inferenceConfig": {"maxTokens": N, "temperature": 0.3}}
  Response: {"output": {"message": {"content": [{"text": "..."}], "role": "assistant"}}}
"""
import json
import os
import time
import uuid
from decimal import Decimal
from typing import Any, Dict, List, Optional

import boto3
from botocore.exceptions import BotoCoreError, ClientError


class BedrockJSONError(Exception):
    pass


def _json_default(obj: Any):
    if isinstance(obj, Decimal):
        # Preserve integers when possible, otherwise use float.
        return int(obj) if obj % 1 == 0 else float(obj)
    return str(obj)


def _client():
    region = os.environ.get("BEDROCK_REGION", "us-east-1")
    return boto3.client("bedrock-runtime", region_name=region)


def _invoke(messages: List[Dict], system: str = "") -> str:
    model_id = os.environ.get("BEDROCK_MODEL_ID", "amazon.nova-lite-v1:0")

    # Convert messages to Nova format: content must be array of {text: str}
    nova_messages = []
    for m in messages:
        role = m.get("role")
        if role not in ("user", "assistant"):
            continue
        content = m.get("content", "")
        nova_messages.append({
            "role": role,
            "content": [{"text": str(content)}],
        })

    if not nova_messages:
        raise BedrockJSONError("No messages to send")

    body: Dict[str, Any] = {
        "messages": nova_messages,
        "inferenceConfig": {"maxTokens": 1024, "temperature": 0.3},
    }
    if system:
        body["system"] = [{"text": system}]

    resp = _client().invoke_model(
        modelId=model_id,
        body=json.dumps(body),
        contentType="application/json",
        accept="application/json",
    )
    raw = json.loads(resp["body"].read())
    return raw["output"]["message"]["content"][0]["text"]


def _clean_json(text: str) -> str:
    """Strip markdown fences if model wraps JSON in ```json ... ```"""
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        # remove first and last fence lines
        lines = [l for l in lines if not l.strip().startswith("```")]
        text = "\n".join(lines).strip()
    return text


def _structured(system: str, user: str, retries: int = 2) -> Dict[str, Any]:
    last_err: Optional[Exception] = None
    for attempt in range(retries + 1):
        try:
            raw = _invoke([{"role": "user", "content": user}], system=system)
            return json.loads(_clean_json(raw))
        except (json.JSONDecodeError, KeyError) as e:
            last_err = e
            time.sleep(0.5 * (attempt + 1))
        except (BotoCoreError, ClientError) as e:
            last_err = e
            time.sleep(0.5 * (attempt + 1))
    raise BedrockJSONError(f"Structured call failed after {retries+1} attempts: {last_err}")


# ── Public API ────────────────────────────────────────────────────────────────

def invoke_chat(
    conversation: List[Dict[str, Any]],
    onboarding: bool,
    user_profile: Optional[Dict] = None,
) -> Dict[str, Any]:
    """
    Returns {
      "reply": str,
      "user_type": str,
      "actions": [{"title","description","cta","target","url"}],
      "profile_update": dict | None
    }
    """
    if not os.environ.get("BEDROCK_MODEL_ID"):
        # Offline stub
        return {
            "reply": "Hi! I'm your ET AI Concierge. Tell me about your profession and financial goals.",
            "user_type": "New User",
            "actions": [
                {"title": "ET Markets", "description": "Live market data", "cta": "Explore", "target": "markets", "url": "https://economictimes.indiatimes.com/markets"},
                {"title": "ET Prime", "description": "Expert analysis", "cta": "Try Free", "target": "prime", "url": "https://prime.economictimes.indiatimes.com"},
            ],
            "profile_update": None,
        }

    system = _chat_system(onboarding, user_profile)
    # Build message list for Nova (user/assistant only)
    msgs = [
        {"role": m["role"], "content": m.get("content", "")}
        for m in conversation
        if m.get("role") in ("user", "assistant")
    ]

    raw = _invoke(msgs, system=system)
    raw = _clean_json(raw)

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return {"reply": raw, "user_type": "User", "actions": [], "profile_update": None}

    return {
        "reply": parsed.get("reply") or parsed.get("response") or raw,
        "user_type": parsed.get("user_type", "User"),
        "actions": (parsed.get("actions") or [])[:3],
        "profile_update": parsed.get("profile_update"),
    }


def extract_profile(conversation: List[Dict[str, Any]]) -> Dict[str, Any]:
    user_prompt = json.dumps({"conversation": conversation}, default=_json_default)
    return _structured(_profile_system(), user_prompt)


def generate_recommendations(profile: Dict[str, Any]) -> Dict[str, Any]:
    user_prompt = json.dumps({"profile": profile}, default=_json_default)
    return _structured(_reco_system(), user_prompt)


def new_conversation_id() -> str:
    return str(uuid.uuid4())


# ── Prompts ───────────────────────────────────────────────────────────────────

def _chat_system(onboarding: bool, profile: Optional[Dict]) -> str:
    profile_ctx = f"\nKnown user profile: {json.dumps(profile, default=_json_default)}" if profile else ""

    if onboarding:
        mode_instructions = (
            "\nMODE: ONBOARDING. Ask ONE question at a time to learn about the user. "
            "Collect: profession (student/working/business), financial goals, experience level "
            "(beginner/intermediate/advanced), income range, risk appetite. "
            "After 3-4 exchanges, set profile_update with what you've learned. "
            "Be warm, conversational, and encouraging."
        )
    else:
        mode_instructions = (
            "\nMODE: CONCIERGE. Use the user profile to give highly personalized guidance. "
            "Recommend specific ET products and services. Guide them to relevant pages. "
            "Be proactive about cross-sell opportunities."
        )

    return (
        "You are the ET AI Concierge — a smart, friendly AI guide for the Economic Times ecosystem. "
        "ET products you can recommend: ET Prime, ET Markets, ET Masterclasses, ET Wealth Summit, "
        "ET Corporate Events, ET Financial Services (loans, insurance, credit cards, wealth management)."
        + profile_ctx
        + mode_instructions
        + "\n\nRESPOND WITH ONLY VALID JSON — no markdown, no extra text:\n"
        '{"reply":"Your response (max 80 words, conversational)",'
        '"user_type":"e.g. Beginner Investor / Growth Professional / Student Saver",'
        '"actions":[{"title":"Page title","description":"One line desc","cta":"Button text","target":"page_key","url":"https://..."}],'
        '"profile_update":{"profession":"...","financialGoals":["..."],"investmentExperience":"...","incomeRange":"...","riskAppetite":"..."} or null}\n'
        "target values: markets, prime, masterclass, wealth_summit, corporate_events, financial_services, loans, insurance, credit_cards, wealth_management\n"
        "Include 1-3 relevant actions. Only set profile_update when you have gathered enough info."
    )


def _profile_system() -> str:
    return (
        "Extract a financial profile from the conversation. "
        "Return ONLY valid JSON: "
        '{"profession":"...","financialGoals":["..."],"investmentExperience":"beginner|intermediate|advanced",'
        '"incomeRange":"...","riskAppetite":"low|moderate|high","etProductUsage":["..."],'
        '"needs":["..."],"userType":"descriptive label like Growth-Focused Investor"}'
        " — no extra text."
    )


def _reco_system() -> str:
    return (
        "Given a user profile, return ONLY valid JSON: "
        '{"recommendations":[{"title":"...","category":"...","description":"...","cta":"...","url":"...","relevanceScore":0.0-1.0}]} '
        "with 4-8 items. Categories: ET Prime, ET Markets, Masterclasses, Wealth Summits, Corporate Events, "
        "Financial Services, Loans, Insurance, Credit Cards, Wealth Management. "
        "Make each recommendation specific to the user profile. No extra text."
    )
