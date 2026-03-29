# ET AI Concierge ? Hackathon Submission

## Summary
ET AI Concierge is a full-stack AI assistant for the Economic Times ecosystem. It onboards users through a short chat, builds a structured financial profile, and produces personalized ET product recommendations. The system uses Amazon Bedrock for AI inference, DynamoDB for persistence, and Cognito for secure authentication.

## Key Features
- Conversational onboarding + profile extraction
- Profile-aware AI responses on return visits
- Personalized ET recommendations stored in DynamoDB
- Voice input (STT) and optional voice output (Polly)
- Secure JWT-protected APIs

## Architecture
- **Frontend:** Vite + React (JS/JSX) + Tailwind + shadcn/ui
- **Backend:** AWS Lambda + API Gateway (HTTP API + Cognito JWT Authorizer)
- **AI:** Amazon Bedrock (Nova Lite)
- **Storage:** DynamoDB (Users, Conversations, Recommendations)
- **Voice:** Amazon Polly + S3 for MP3 delivery

## API Endpoints
Base URL: `https://{api-id}.execute-api.{region}.amazonaws.com/prod`

- `POST /chat`
  - Request: `{ "message": "...", "conversationId": "optional", "voiceEnabled": false }`
  - Response: `{ reply, user_type, actions[], onboardingComplete, audioUrl, profile }`

- `GET /profile`
- `PUT /profile`
  - Body: `{ "conversationId": "..." }` or `{ "profile": {...} }`

- `GET /recommendations`
- `POST /recommendations/refresh`

## Frontend Flow
1. User logs in via Cognito Hosted UI
2. App fetches `/profile`
3. If onboarding incomplete, chat collects profile inputs
4. Chat updates profile + dashboard recommendations
5. Return users see concierge mode and tailored actions

## Backend Flow
1. API Gateway validates JWT
2. Lambda loads conversation + profile
3. Bedrock returns structured JSON
4. DynamoDB persists profile + conversation + recommendations

## Local Development
### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend (optional local)
```bash
cd backend
sam build
sam local start-api --parameter-overrides CognitoUserPoolId=dummy CognitoUserPoolClientId=dummy CognitoUserPoolRegion=ap-south-1 PollyAudioBucketName=local-audio DeploymentBucket=dummy
```

## Deployment
- Backend via `backend/template.yaml` (SAM)
- Frontend deploys to Amplify (or any static host)
- Configure env vars:
  - `VITE_API_BASE`
  - `VITE_COGNITO_USER_POOL_ID`
  - `VITE_COGNITO_CLIENT_ID`
  - `VITE_COGNITO_DOMAIN`
  - `VITE_REDIRECT_URI`

## Team / Ownership
Built by Balaji for hackathon submission.
