# ET AI Concierge

Full‑stack demo that pairs an AWS SAM backend (Bedrock, DynamoDB, Polly, Cognito‑protected HTTP API) with a Vite/React/Tailwind frontend that delivers an “ET AI Concierge” chat, onboarding, and recommendations experience.

## Architecture at a Glance
- **Frontend:** Vite + React + TypeScript + Tailwind + shadcn/ui. Auth via `react-oidc-context` against Amazon Cognito. Chat UI supports STT (Web Speech API), TTS (browser or Polly URL), onboarding steps, and AI action buttons that deep‑link to in‑app tabs.
- **Backend:** Three Lambda handlers (`chat_handler`, `profile_handler`, `recommendation_handler`) behind API Gateway HTTP API with Cognito JWT authorizer. DynamoDB tables for users, conversations, recommendations; optional S3 bucket for Polly MP3; Bedrock (Nova) for chat, profile extraction, and recommendations. Infra defined in `backend/template.yaml` (SAM) and `backend/cf-template.yaml`.

## Local Development
### Backend (no auth, mock AI)
```bash
cd backend
sam local start-api \
  --parameter-overrides CognitoUserPoolId=dummy CognitoUserPoolClientId=dummy CognitoUserPoolRegion=ap-south-1 PollyAudioBucketName=local-audio DeploymentBucket=dummy
# API runs at http://127.0.0.1:3000
```

### Frontend
Create `frontend/.env` (sample in `.env.example`):
```
VITE_API_BASE=http://127.0.0.1:3000
VITE_COGNITO_USER_POOL_ID=ap-south-1_R1cmGkY0f   # only needed when hitting real Cognito
VITE_COGNITO_CLIENT_ID=53juobs9osbv16uudmppvuajob
VITE_COGNITO_DOMAIN=https://<your-cognito-domain>.auth.<region>.amazoncognito.com
VITE_REDIRECT_URI=http://localhost:5173         # use localhost to avoid Amplify redirect when testing locally
```
Run:
```bash
cd frontend
npm install
npm run dev
```

If you see a redirect to an Amplify URL after login, set `VITE_REDIRECT_URI` to your local dev origin and ensure your Cognito app client allows that redirect URL. The app also forces `redirect_uri` to the current origin when running on localhost.

## Deploying Backend (prod)
```bash
cd backend
sam build
sam deploy --stack-name et-ai-concierge --s3-bucket <sam-artifacts-bucket> --capabilities CAPABILITY_IAM \
  --parameter-overrides StageName=prod CognitoUserPoolId=<id> CognitoUserPoolClientId=<client> CognitoUserPoolRegion=<region> \
  BedrockRegion=us-east-1 BedrockModelId=amazon.nova-lite-v1:0 PollyVoiceId=Joanna PollyAudioBucketName=<unique-audio-bucket> DeploymentBucket=<sam-artifacts-bucket>
```
Use the printed `ApiEndpoint` as `VITE_API_BASE` in the frontend.

## Key Requirements & Design Notes
- Protect all API routes with Cognito JWT; frontend stores idToken in `localStorage` and attaches `Authorization: Bearer <token>`.
- Chat flow prioritizes onboarding (profession, goals, experience, income, risk) before concierge recommendations; AI actions map to internal tabs.
- Voice support: STT via Web Speech API; TTS via Polly (backend) with browser speech fallback.
- CORS is open in SAM template for quick prototyping; restrict in production as needed.

## Repository Structure
- `frontend/` – React app (Vite) with UI components and OIDC auth.
- `backend/` – SAM templates and Lambda sources.
- `deploy-amplify.ps1` – helper script for Amplify (if used).
- `frontend-dist.zip` – current built assets.

## Testing
- Frontend: `npm run test` (Vitest), `npm run lint`.
- Backend: invoke locally with `sam local start-api`; unit tests not included.
