# ET AI Concierge ? Hackathon Submission

## Problem Statement
ET has a massive ecosystem, but users discover only a fraction. This project builds an AI concierge that understands a user in one conversation and guides them to the right ET products and services.

## What We Built
- AI onboarding + profile extraction
- Personalized recommendations + action navigation
- Voice input and optional voice output
- Secure JWT?protected APIs

## Architecture
- **Frontend:** Vite + React (JS/JSX), Tailwind
- **Backend:** AWS Lambda + API Gateway
- **AI:** Amazon Bedrock (Nova Lite)
- **Auth:** Amazon Cognito (Hosted UI)
- **Data:** DynamoDB + S3 (audio)

## APIs
Base URL: `https://{api-id}.execute-api.{region}.amazonaws.com/prod`

- `POST /chat`
- `GET /profile`
- `PUT /profile`
- `GET /recommendations`
- `POST /recommendations/refresh`

## Demo Flow
1. User logs in with Cognito
2. Chat onboarding collects profile info
3. Profile saved to DynamoDB
4. Recommendations generated and shown on dashboard
5. User can revisit chat in concierge mode

## Setup (Local)
```bash
cd frontend
npm install
npm run dev
```

## Deployment
- Backend via `backend/template.yaml` (SAM)
- Frontend deploy via Amplify
- Required env vars:
  - `VITE_API_BASE`
  - `VITE_COGNITO_USER_POOL_ID`
  - `VITE_COGNITO_CLIENT_ID`
  - `VITE_COGNITO_DOMAIN`
  - `VITE_REDIRECT_URI`
