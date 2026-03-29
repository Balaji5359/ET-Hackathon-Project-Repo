import json
import os
import time
from typing import Any, Dict

import boto3

from bedrock_client import BedrockJSONError, generate_recommendations

dynamodb = boto3.resource("dynamodb")
users_table = dynamodb.Table(os.environ["DYNAMODB_TABLE_USERS"])
reco_table = dynamodb.Table(os.environ["DYNAMODB_TABLE_RECOMMENDATIONS"])

DEFAULT_RECOMMENDATIONS = [
    {"title": "ET Prime Membership", "category": "ET Prime", "description": "Unlock expert analysis, exclusive stories and market intelligence.", "cta": "Start Free Trial", "url": "https://prime.economictimes.indiatimes.com", "relevanceScore": 0.9},
    {"title": "ET Markets Watchlist", "category": "ET Markets", "description": "Track stocks, mutual funds and commodities with live data.", "cta": "Explore Now", "url": "https://economictimes.indiatimes.com/markets", "relevanceScore": 0.85},
    {"title": "Investment Masterclass", "category": "Masterclasses", "description": "Learn portfolio building from India's top fund managers.", "cta": "Enroll Free", "url": "https://economictimes.indiatimes.com/prime/masterclass", "relevanceScore": 0.8},
    {"title": "ET Wealth Summit 2026", "category": "Wealth Summits", "description": "Network with 500+ HNIs and wealth management experts.", "cta": "Register", "url": "https://economictimes.indiatimes.com/wealth", "relevanceScore": 0.75},
]


def _get_user_id(event: Dict[str, Any]) -> str:
    try:
        return event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
    except (KeyError, TypeError):
        return (event.get("headers") or {}).get("x-user-id", "demo-user")


def lambda_handler(event, context):
    user_id = _get_user_id(event)
    method = (event.get("requestContext") or {}).get("http", {}).get("method", "GET")
    path = (event.get("requestContext") or {}).get("http", {}).get("path", "")

    if method == "GET":
        return _get_recommendations(user_id)
    if path.endswith("/refresh"):
        return _refresh_recommendations(user_id)
    return _response(400, {"error": "unsupported operation"})


def _get_recommendations(user_id: str):
    resp = reco_table.get_item(Key={"userId": user_id})
    if "Item" in resp:
        return _response(200, resp["Item"])
    return _response(200, {
        "userId": user_id,
        "generatedAt": int(time.time()),
        "recommendations": DEFAULT_RECOMMENDATIONS,
    })


def _refresh_recommendations(user_id: str):
    profile_item = users_table.get_item(Key={"userId": user_id}).get("Item", {})
    profile = profile_item.get("profile")

    if not profile:
        return _response(200, {
            "userId": user_id,
            "generatedAt": int(time.time()),
            "recommendations": DEFAULT_RECOMMENDATIONS,
        })

    try:
        result = generate_recommendations(profile)
    except BedrockJSONError as exc:
        return _response(500, {"error": str(exc)})

    recos = result.get("recommendations", DEFAULT_RECOMMENDATIONS)[:8]
    payload = {
        "userId": user_id,
        "generatedAt": int(time.time()),
        "recommendations": recos,
    }
    reco_table.put_item(Item=payload)
    return _response(200, payload)


def _response(status: int, body: Dict[str, Any]):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
        },
        "body": json.dumps(body, default=str),
    }
