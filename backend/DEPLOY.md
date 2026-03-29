# Deploying the ET AI Concierge backend (SAM)

Prereqs
- AWS CLI configured with deploy permissions (Cognito read, DynamoDB, Lambda, API Gateway, S3, Bedrock, Polly).
- AWS SAM CLI installed.
- A globally unique S3 bucket name for Polly audio (set `PollyAudioBucketName`).
- Cognito User Pool + App Client already created (IDs in `.kiro/specs/et-ai-concierge/.env`).

One-time bootstrap (if you do not have a SAM artifacts bucket):
```bash
aws s3 mb s3://<your-sam-artifacts-bucket>
```

Build and deploy
```bash
cd backend
sam build
sam deploy \
  --stack-name et-ai-concierge \
  --s3-bucket <your-sam-artifacts-bucket> \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    StageName=prod \
    CognitoUserPoolId=ap-south-1_R1cmGkY0f \
    CognitoUserPoolClientId=53juobs9osbv16uudmppvuajob \
    CognitoUserPoolRegion=ap-south-1 \
    BedrockRegion=us-east-1 \
    BedrockModelId=anthropic.claude-3-sonnet-20240229-v1:0 \
    PollyVoiceId=Joanna \
    PollyAudioBucketName=<unique-audio-bucket-name> \
    DeploymentBucket=<your-sam-artifacts-bucket>
```

Outputs printed by `sam deploy` include `ApiEndpoint`. Use that in the frontend as `VITE_API_BASE`.

Local invoke (no auth, mock Bedrock):
```bash
sam local start-api \
  --parameter-overrides CognitoUserPoolId=dummy CognitoUserPoolClientId=dummy CognitoUserPoolRegion=ap-south-1 PollyAudioBucketName=local-audio DeploymentBucket=dummy
# Then call POST http://127.0.0.1:3000/chat with {"message":"hi"} (x-user-id header optional)
```

Notes
- Bedrock region must be one where the model is available (often us-east-1 or us-west-2). Override if needed.
- Keep AWS keys out of `.env` in the repo; rely on AWS CLI profile/role when deploying.
