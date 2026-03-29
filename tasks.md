# Implementation Plan: ET AI Concierge

## Overview

Incremental implementation of the full ET AI Concierge stack: React frontend (Amplify), Python Lambda backend (API Gateway), Amazon Bedrock inference, DynamoDB persistence, Cognito auth, and voice features (Web Speech API + Amazon Polly).

Each task builds on the previous. All code is wired together by the end.

---

## Tasks

- [x] 1. Project scaffolding and shared types
  - Initialise Vite + React + TypeScript frontend project with folder structure matching the design (`components/`, `hooks/`, `services/`, `theme/`)
  - Create Python backend folder structure (`chat_handler/`, `profile_handler/`, `recommendation_handler/`, `bedrock_client/`)
  - Define shared TypeScript types: `Message`, `Profile`, `Recommendation`, `ChatResponse` (including optional `audioUrl`)
  - Define Python `ProfileSchema` and `RecommendationSchema` as TypedDicts / dataclasses with JSON Schema dicts
  - Add `requirements.txt` for backend and `package.json` dependencies (`react-speech-recognition`, `axios`, `@aws-amplify/ui-react`)
  - _Requirements: 12.4, 13.1_

- [x] 2. Authentication — Cognito + Amplify Auth UI
  - [x] 2.1 Implement `LoginPage.tsx` using `@aws-amplify/ui-react` `<Authenticator>` with email/password and Google OAuth
    - Read `VITE_COGNITO_USER_POOL_ID` and `VITE_COGNITO_CLIENT_ID` from `import.meta.env`
    - _Requirements: 1.1, 1.4, 12.2_
  - [x] 2.2 Implement `ProtectedRoute.tsx` that redirects unauthenticated users to `/login`
    - Use `useAuth.ts` hook wrapping Amplify `Auth.currentAuthenticatedUser()`
    - _Requirements: 1.2_
  - [x] 2.3 Implement `useAuth.ts` hook: session check, sign-out (clears tokens), JWT accessor
    - _Requirements: 1.3, 1.5_
  - [ ]* 2.4 Write unit tests for `ProtectedRoute` redirect behaviour and `useAuth` sign-out token clearing
    - _Requirements: 1.2, 1.5_

- [x] 3. API service layer and JWT interceptor
  - [x] 3.1 Implement `services/api.ts`: Axios instance with base URL from `VITE_API_ENDPOINT`, request interceptor that attaches `Authorization: Bearer <JWT>` from `useAuth`
    - _Requirements: 1.3, 12.2_
  - [ ]* 3.2 Write property test for JWT interceptor (Property 1: JWT included in all API requests)
    - **Property 1: JWT Included in All API Requests**
    - **Validates: Requirements 1.3**

- [x] 4. Backend shared infrastructure — `bedrock_client` Lambda Layer
  - [x] 4.1 Implement `bedrock_client.py` with `invoke_chat()`, `extract_profile()`, `generate_recommendations()`
    - All structured-output functions validate JSON and retry up to 2 times; raise `BedrockJSONError` on failure
    - Read model ID from `BEDROCK_MODEL_ID` env var
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 12.1_
  - [ ]* 4.2 Write property test for Bedrock JSON round-trip (Property 8)
    - **Property 8: Bedrock Structured Output JSON Round-Trip**
    - **Validates: Requirements 4.5, 8.5**
  - [ ]* 4.3 Write property test for Bedrock JSON validation / retry (Property 13)
    - **Property 13: Bedrock Client Validates JSON Before Returning**
    - **Validates: Requirements 8.3, 8.4**

- [x] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. `chat_handler` Lambda — core chat and onboarding
  - [x] 6.1 Implement `chat_handler.py`: JWT userId extraction, DynamoDB conversation load, onboarding vs general mode routing, Bedrock invocation, message pair persistence, action metadata in response
  
  
    - Read `DYNAMODB_TABLE_CONVERSATIONS`, `DYNAMODB_TABLE_USERS` from env vars
    - _Requirements: 2.1, 2.2, 2.4, 2.6, 3.2, 3.3, 3.4, 3.5, 3.6, 6.1, 6.4, 9.3, 12.1_
  - [ ]* 6.2 Write property test for onboarding turn count invariant (Property 3)
    - **Property 3: Onboarding Turn Count Invariant**
    - **Validates: Requirements 2.4**
  - [ ]* 6.3 Write property test for conversation history in Bedrock context (Property 5)
    - **Property 5: Conversation History Included in Bedrock Context**
    - **Validates: Requirements 3.3**
  - [ ]* 6.4 Write property test for message pair persistence round-trip (Property 6)
    - **Property 6: Message Pair Persistence Round-Trip**
    - **Validates: Requirements 3.4, 9.3**
  - [ ]* 6.5 Write property test for action items invariant (Property 10)
    - **Property 10: Action Items Invariant**
    - **Validates: Requirements 6.1, 6.4**
  - [ ]* 6.6 Write property test for messages ordered by timestamp (Property 14)
    - **Property 14: Messages Ordered by Timestamp**
    - **Validates: Requirements 9.4**

- [x] 7. `profile_handler` Lambda
  - [x] 7.1 Implement `profile_handler.py`: `GET /profile` returns stored profile; `PUT /profile` triggers `bedrock_client.extract_profile()`, validates against ProfileSchema, persists to DynamoDB Users table; creates new user record on first auth
    - _Requirements: 2.3, 4.1, 4.2, 4.3, 4.4, 4.6, 9.1, 9.2, 12.1_
  - [ ]* 7.2 Write property test for profile persistence round-trip (Property 2)
    - **Property 2: Profile Persistence Round-Trip**
    - **Validates: Requirements 2.3, 4.3**
  - [ ]* 7.3 Write property test for profile schema validity (Property 7)
    - **Property 7: Profile Schema Validity**
    - **Validates: Requirements 4.1, 4.2, 4.4**

- [x] 8. `recommendation_handler` Lambda
  - [x] 8.1 Implement `recommendation_handler.py`: `GET /recommendations` returns persisted recommendations (or 3-item default if no profile); `POST /recommendations/refresh` invokes `bedrock_client.generate_recommendations()`, validates schema and count bounds (3–10), persists to DynamoDB
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 9.1, 12.1_
  - [ ]* 8.2 Write property test for recommendation schema validity and count bounds (Property 9)
    - **Property 9: Recommendation Schema Validity and Count Bounds**
    - **Validates: Requirements 5.1, 5.2, 5.4**
  - [ ]* 8.3 Write property test for recommendations after onboarding (Property 4)
    - **Property 4: Recommendations Generated After Onboarding**
    - **Validates: Requirements 2.5**

- [x] 9. Checkpoint — Ensure all backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Amazon Polly integration in `chat_handler`
  - [x] 10.1 Implement `synthesize_speech(text: str) -> str` in `chat_handler.py`: invokes Polly `SynthesizeSpeech` (neural MP3), uploads to S3, returns pre-signed URL (300s expiry)
    - Read `POLLY_AUDIO_BUCKET` and `POLLY_VOICE_ID` from env vars; default voice `Joanna`
    - Wrap in try/except: on Polly/S3 error, log and return `None` (response proceeds without `audioUrl`)
    - Wire into `chat_handler`: when `voiceEnabled: true` in request body, call `synthesize_speech()` and include `audioUrl` in response if not `None`
    - _Requirements: 16.1, 16.2, 16.3, 16.7, 16.8, 12.1_
  - [ ]* 10.2 Write property test for Polly URL present when voice enabled (Property 19)
    - **Property 19: Polly Audio URL Present When Voice Enabled**
    - **Validates: Requirements 16.1, 16.2**
  - [ ]* 10.3 Write property test for voice failure graceful degradation (Property 20)
    - **Property 20: Voice Failure Does Not Degrade Chat Response**
    - **Validates: Requirements 16.7**
  - [ ]* 10.4 Write property test for Polly config from env vars (Property 21)
    - **Property 21: Polly Config Read From Environment Variables**
    - **Validates: Requirements 16.8**

- [x] 11. Frontend — Chat UI
  - [x] 11.1 Implement `ChatWindow.tsx`: message list rendering, text input bar, send button, loading indicator; wires to `useChat.ts` hook
    - `useChat.ts`: manages messages state, calls `POST /chat` via `api.ts`, appends response, exposes `voiceEnabled` toggle state
    - _Requirements: 3.1, 3.2, 6.2, 6.3_
  - [x] 11.2 Implement `MessageBubble.tsx` and `ActionCard.tsx`
    - `ActionCard` renders label + navigates to URL on click; max 3 per response
    - _Requirements: 6.2, 6.3_
  - [x] 11.3 Implement `OnboardingBanner.tsx` showing turn progress (e.g., "Step 3 of 10")
    - _Requirements: 2.1_

- [x] 12. Frontend — Voice Input (`VoiceInput.tsx`)
  - [x] 12.1 Implement `useVoiceInput.ts` wrapping `useSpeechRecognition` from `react-speech-recognition`
    - Exposes `{ isListening, isSupported, toggle }` and calls `onTranscript(transcript)` when listening stops with non-empty transcript
    - _Requirements: 15.2, 15.3, 15.6_
  - [x] 12.2 Implement `VoiceInput.tsx`: microphone IconButton embedded in `ChatWindow` input bar; hidden when `isSupported=false`; shows animated pulsing indicator while listening; on transcript calls `onTranscript` to populate input field
    - _Requirements: 15.1, 15.4, 15.5, 15.7_
  - [ ]* 12.3 Write property test for voice transcript populating input field (Property 17)
    - **Property 17: Voice Input Transcript Populates Input Field**
    - **Validates: Requirements 15.3**
  - [ ]* 12.4 Write property test for microphone button hidden when browser unsupported (Property 18)
    - **Property 18: Voice Input Unavailable When Browser Unsupported**
    - **Validates: Requirements 15.4**

- [x] 13. Frontend — Voice Output (`VoiceOutputToggle.tsx` + audio playback)
  - Implement `VoiceOutputToggle.tsx`: speaker toggle button that sets `voiceEnabled` in `useChat` state
  - When `useChat` receives a response with `audioUrl`, auto-play via `<audio>` element and render play/pause/stop controls alongside the assistant `MessageBubble`
  - _Requirements: 16.4, 16.5, 16.6_

- [x] 14. Frontend — Dashboard
  - [x] 14.1 Implement `DashboardPage.tsx`: fetches profile and recommendations on mount via `useProfile.ts` and `useRecommendations.ts`; renders `ProfileCard` and `RecommendationCard` grid grouped by category
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [x] 14.2 Implement `ProfileCard.tsx` and `RecommendationCard.tsx`
    - _Requirements: 7.1_
  - [ ]* 14.3 Write property test for recommendations grouped by category (Property 11)
    - **Property 11: Recommendations Grouped by Category**
    - **Validates: Requirements 7.3**

- [x] 15. Frontend — Theming and responsive layout
  - [x] 15.1 Implement `theme/theme.ts` with dark and light token sets; apply via `<html>` class
    - `ThemeToggle.tsx` writes to `localStorage` and applies theme immediately
    - On load, read from `localStorage`; fall back to `prefers-color-scheme`
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  - [x] 15.2 Implement `AppShell.tsx`: top nav + desktop sidebar; collapses to tab/drawer on mobile (<768px); touch-friendly interactions
    - _Requirements: 11.1, 11.2, 11.3_
  - [ ]* 15.3 Write property test for theme preference persistence round-trip (Property 15)
    - **Property 15: Theme Preference Persistence Round-Trip**
    - **Validates: Requirements 10.3**

- [x] 16. Checkpoint — Ensure all frontend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 17. API Gateway and security wiring
  - [x] 17.1 Configure API Gateway HTTP API: routes `POST /chat`, `GET /profile`, `PUT /profile`, `GET /recommendations`, `POST /recommendations/refresh` to respective Lambdas; Cognito JWT authorizer on all routes; CORS for Amplify domain
    - _Requirements: 13.1, 13.2, 13.3, 1.2, 14.3_
  - [ ]* 17.2 Write property test for unauthenticated requests returning 401 (Property 16)
    - **Property 16: Unauthenticated Requests Return 401**
    - **Validates: Requirements 13.2**

- [x] 18. Environment variable validation in all Lambda handlers
  - Add cold-start env var checks to `chat_handler`, `profile_handler`, `recommendation_handler`: log descriptive error and return 500 if any required variable is missing
  - Required vars: `DYNAMODB_TABLE_USERS`, `DYNAMODB_TABLE_CONVERSATIONS`, `DYNAMODB_TABLE_RECOMMENDATIONS`, `BEDROCK_MODEL_ID`, `POLLY_AUDIO_BUCKET` (chat_handler only), `POLLY_VOICE_ID` (chat_handler only)
  - _Requirements: 12.1, 12.3_

- [x] 19. OpenAPI specification
  - Create `openapi.yaml` describing all 5 endpoints with request/response schemas matching the design document
  - _Requirements: 13.4_

- [x] 20. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use **Hypothesis** (Python) and **fast-check** (TypeScript); minimum 100 iterations each
- Each property test must include a comment: `# Feature: et-ai-concierge, Property N: <title>`
- `audioUrl` is only present in chat responses when `voiceEnabled: true` AND Polly/S3 succeed
- The S3 bucket for Polly audio must have a 1-hour object lifecycle policy configured outside of application code
