# Requirements: ET AI Concierge

## Problem Fit
The system must map new and returning users to ET products with minimal friction. It must understand the user's financial profile in one conversation and deliver targeted recommendations.

## Functional Requirements
1. **Authentication & Security**
   - Cognito Hosted UI authentication
   - JWT required for all API requests

2. **Welcome Concierge (Onboarding)**
   - 3?4 turn profiling chat
   - Capture profession, goals, experience, income, risk

3. **Financial Life Navigator**
   - Build structured profile from chat
   - Persist to DynamoDB Users table

4. **ET Ecosystem Cross?Sell Engine**
   - Recommendations generated from profile
   - 4?8 ET products/services with relevance scores

5. **Marketplace Agent**
   - Actions mapped to ET services: loans, insurance, cards, wealth

6. **Voice Support**
   - STT via Web Speech API
   - Optional TTS via Polly

## Non?Functional Requirements
- Serverless AWS stack
- Fast response time (<10s per chat)
- JSON?structured AI responses
- Scalable and secure

## API Contract (Must Match Implementation)
- `POST /chat`
  - `{ "message": "...", "conversationId": "optional", "voiceEnabled": false }`
- `GET /profile`
- `PUT /profile`
  - `{ "conversationId": "..." }` or `{ "profile": {...} }`
- `GET /recommendations`
- `POST /recommendations/refresh`

## Acceptance Criteria
- Onboarding creates a stored profile and dashboard update
- Returning users see concierge mode
- Recommendations are personalized and persisted
- All endpoints protected by JWT
