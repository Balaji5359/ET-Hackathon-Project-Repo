# Requirements Document

## Goal
Build an AI concierge that onboards users through chat, creates a financial profile, and recommends ET products/services. The system must be secure, scalable, and deliver consistent JSON-structured AI output.

## Functional Requirements
1. **Authentication**
   - Cognito Hosted UI for sign-in/sign-up
   - Frontend includes JWT in all API requests

2. **Chat Onboarding**
   - Chat gathers profession, goals, experience, income range, risk appetite
   - Bedrock returns JSON with `reply`, `user_type`, `actions`, and optional `profile_update`

3. **Profile Persistence**
   - Profile stored in DynamoDB Users table
   - Profile can be updated from conversation or explicit PUT

4. **Recommendations**
   - Recommendation list (4?8 items) generated based on profile
   - Stored in DynamoDB and returned to dashboard

5. **Navigation Actions**
   - Actions returned by chat contain `{title, description, cta, target, url}`
   - Frontend routes internally or opens external ET links

6. **Voice Support**
   - STT via Web Speech API
   - TTS via Polly when `voiceEnabled=true`, fallback to browser speech

## Non-Functional Requirements
- Serverless AWS backend (Lambda + API Gateway)
- Bedrock JSON output must be validated before use
- All services configured via environment variables

## API Requirements
Base URL: `https://{api-id}.execute-api.{region}.amazonaws.com/prod`

- `POST /chat`
  - Body: `{ "message": "...", "conversationId": "optional", "voiceEnabled": false }`
- `GET /profile`
- `PUT /profile`
  - Body: `{ "conversationId": "..." }` or `{ "profile": {...} }`
- `GET /recommendations`
- `POST /recommendations/refresh`

## Acceptance Criteria
- Successful onboarding produces a stored profile and refreshed dashboard
- Chat works with profile-aware responses on return sessions
- Recommendations are personalized and persisted
- All endpoints require valid JWT
