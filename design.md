# System Design: ET AI Concierge

## Problem Statement (Hackathon)
ET has a massive ecosystem (ET Prime, ET Markets, masterclasses, corporate events, wealth summits, financial services). Most users discover only a small fraction. Build an AI concierge that understands the user in one conversation and guides them to the right ET products and services.

## Solution Overview
ET AI Concierge is a full-stack, serverless AI system. It onboards users through a short chat, extracts a structured financial profile, and returns personalized recommendations and navigation actions. The architecture is designed for fast onboarding, secure personalization, and scalable inference.

## High-Level Architecture
```mermaid
graph TD
  User["User Browser"]
  FE["Vite React SPA"]
  Cognito["Cognito User Pool"]
  APIGW["API Gateway HTTP API - JWT Authorizer"]
  Chat["Lambda - chat_handler"]
  Profile["Lambda - profile_handler"]
  Reco["Lambda - recommendation_handler"]
  Bedrock["Amazon Bedrock - Nova Lite"]
  DDB["DynamoDB - Users / Conversations / Recommendations"]
  Polly["Amazon Polly + S3"]

  User --> FE
  FE --> Cognito
  FE --> APIGW
  APIGW --> Chat
  APIGW --> Profile
  APIGW --> Reco
  Chat --> Bedrock
  Profile --> Bedrock
  Reco --> Bedrock
  Chat --> DDB
  Profile --> DDB
  Reco --> DDB
  Chat --> Polly
```

## AWS Architecture Diagram
```mermaid
graph LR
  subgraph AWS
    Cognito["Cognito User Pool"]
    APIGW["API Gateway HTTP API"]
    subgraph Lambda
      Chat["chat_handler"]
      Profile["profile_handler"]
      Reco["recommendation_handler"]
      Layer["bedrock_client (Layer)"]
    end
    DDB["DynamoDB Tables"]
    Bedrock["Amazon Bedrock"]
    Polly["Amazon Polly"]
    S3["S3 Audio Bucket"]
  end
  FE["Amplify Hosted SPA"] --> Cognito
  FE --> APIGW
  APIGW --> Chat
  APIGW --> Profile
  APIGW --> Reco
  Chat --> Layer
  Profile --> Layer
  Reco --> Layer
  Layer --> Bedrock
  Chat --> DDB
  Profile --> DDB
  Reco --> DDB
  Chat --> Polly
  Polly --> S3
```

## Key Components
### Frontend
- Vite + React (JS/JSX), Tailwind, shadcn/ui
- Auth via `react-oidc-context` using Cognito Hosted UI
- Chat, Dashboard, Profile, and ET product pages
- Web Speech API for STT; Polly URL playback for TTS

### Backend
- `chat_handler`: chat orchestration, profile updates, optional Polly audio
- `profile_handler`: profile retrieval + extraction from conversation
- `recommendation_handler`: personalized recommendations
- `bedrock_client` Lambda Layer: Bedrock calls + JSON validation

## Key Flows
### Onboarding Flow
```mermaid
sequenceDiagram
  participant U as User
  participant FE as Frontend
  participant AG as API Gateway
  participant CH as chat_handler
  participant BR as Bedrock
  participant DB as DynamoDB

  U->>FE: Send message
  FE->>AG: POST /chat
  AG->>CH: Invoke
  CH->>DB: Load history + profile
  CH->>BR: invoke_chat (onboarding)
  BR-->>CH: JSON reply + profile_update
  CH->>DB: Save conversation + profile
  CH-->>FE: reply + actions
```

### Recommendations Flow
```mermaid
sequenceDiagram
  participant FE as Frontend
  participant AG as API Gateway
  participant RH as recommendation_handler
  participant BR as Bedrock
  participant DB as DynamoDB

  FE->>AG: POST /recommendations/refresh
  AG->>RH: Invoke
  RH->>DB: Load profile
  RH->>BR: generate_recommendations
  BR-->>RH: JSON recommendations
  RH->>DB: Save recommendations
  RH-->>FE: recommendations
```

## Data Model
- Users: `userId`, `email`, `profile`, `onboardingComplete`
- Conversations: `userId`, `conversationId`, `messages[]`, `updatedAt`
- Recommendations: `userId`, `recommendations[]`, `generatedAt`

## API Summary
- `POST /chat`
- `GET /profile`
- `PUT /profile`
- `GET /recommendations`
- `POST /recommendations/refresh`

## Scalability & Reliability
- Stateless Lambdas scale horizontally
- DynamoDB on-demand for throughput spikes
- Bedrock abstracts model scaling
- Fail-safe: if Polly fails, text response still returned

## Security
- Cognito JWT authorizer on all routes
- UserId derived from JWT `sub` claim
- No hardcoded secrets; env vars only
