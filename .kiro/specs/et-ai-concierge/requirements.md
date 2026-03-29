# Requirements Document

## Introduction

ET AI Concierge is a full-stack AI-powered application built on AWS that acts as a personalized guide to the ET (Economic Times) ecosystem. The system greets users with a smart profiling conversation, extracts their financial profile, and maps them to relevant ET products, services, and partner offerings — including ET Prime, ET Markets, masterclasses, corporate events, wealth summits, and financial services partnerships. The application is composed of a React frontend deployed on AWS Amplify, a Python-based serverless backend on AWS Lambda with API Gateway, Amazon Bedrock for AI inference, and DynamoDB for persistent storage.

## Glossary

- **Concierge**: The ET AI Concierge application as a whole
- **Chat_Handler**: The Lambda function responsible for processing chat messages and invoking Bedrock
- **Profile_Handler**: The Lambda function responsible for extracting and persisting user profile data from conversations
- **Recommendation_Handler**: The Lambda function responsible for generating personalized ET product and service recommendations
- **Bedrock_Client**: The Amazon Bedrock integration layer used for AI inference
- **User**: An authenticated end-user of the Concierge or google authentication
- **Conversation**: A persistent, ordered sequence of messages between a User and the Concierge
- **Profile**: A structured representation of a User's financial life, goals, and preferences extracted from Conversations
- **Recommendation**: A personalized suggestion for an ET product, service, or partner offering generated for a User
- **Onboarding_Flow**: The initial 3-minute profiling conversation that maps a new User to ET products
- **API_Gateway**: The AWS API Gateway instance that routes HTTP requests to Lambda functions
- **Cognito**: The AWS Cognito User Pool used for authentication and authorization
- **DynamoDB**: The AWS DynamoDB service used for persistent storage of Users, Conversations, and Recommendations
- **Amplify**: The AWS Amplify service used to host and deploy the React frontend
- **Frontend**: The React-based single-page application served via Amplify

---

## Requirements

### Requirement 1: User Authentication

**User Story:** As a User, I want to securely sign up and log in, so that my profile and conversation history are private and persistent across sessions.

#### Acceptance Criteria

1. THE Cognito SHALL provide sign-up, sign-in, and sign-out capabilities for all Users and google authentiction too.
2. WHEN a User attempts to access any protected route, THE Frontend SHALL redirect unauthenticated Users to the sign-in page.
3. WHEN a User successfully authenticates, THE Cognito SHALL issue a JWT token that THE Frontend SHALL include in all subsequent API requests.
4. IF a User submits an invalid credential, THEN THE Cognito SHALL return an authentication error and THE Frontend SHALL display a descriptive error message.
5. WHEN a User signs out, THE Frontend SHALL clear all locally stored tokens and session data.

---

### Requirement 2: Chat-Based Onboarding (ET Welcome Concierge)

**User Story:** As a new User, I want to be greeted with a smart profiling conversation, so that the Concierge can understand who I am and guide me to the right ET products within 3 minutes.

#### Acceptance Criteria

1. WHEN a new User completes authentication for the first time, THE Frontend SHALL initiate the Onboarding_Flow automatically.
2. THE Chat_Handler SHALL conduct a structured profiling conversation covering the User's financial goals, investment experience, income range, and ET product familiarity.
3. WHEN the Onboarding_Flow is complete, THE Profile_Handler SHALL extract a structured Profile from the conversation and persist it to DynamoDB.
4. THE Chat_Handler SHALL complete the Onboarding_Flow within a maximum of 10 conversational turns.
5. WHEN the Onboarding_Flow is complete, THE Recommendation_Handler SHALL generate an initial set of Recommendations and persist them to DynamoDB.
6. IF a User exits the Onboarding_Flow before completion, THEN THE Chat_Handler SHALL resume from the last completed turn on the User's next session.

---

### Requirement 3: Persistent Chat Interface

**User Story:** As a User, I want a chat interface that remembers my conversation history, so that I can continue conversations across sessions without repeating myself.

#### Acceptance Criteria

1. THE Frontend SHALL render a chat UI displaying the full Conversation history for the authenticated User.
2. WHEN a User sends a message, THE Frontend SHALL transmit the message to the API_Gateway and display a loading indicator until a response is received.
3. THE Chat_Handler SHALL retrieve the User's Conversation history from DynamoDB and include it as context when invoking the Bedrock_Client.
4. WHEN the Bedrock_Client returns a response, THE Chat_Handler SHALL persist the new message pair (user message + assistant response) to the Conversations DynamoDB table.
5. THE Chat_Handler SHALL respond to each user message within 10 seconds under normal operating conditions.
6. IF the Bedrock_Client returns an error, THEN THE Chat_Handler SHALL return a descriptive error message to the Frontend without persisting the failed exchange.

---

### Requirement 4: Profile Extraction (Financial Life Navigator)

**User Story:** As a User, I want the Concierge to understand my complete financial life from our conversation, so that it can guide me to the right ET tools and partner services.

#### Acceptance Criteria

1. THE Profile_Handler SHALL extract structured Profile data from Conversation history using the Bedrock_Client with a defined JSON output schema.
2. THE Profile_Handler SHALL extract at minimum: financial goals, investment experience level, income range, risk appetite, existing ET product usage, and immediate financial needs.
3. WHEN a User's Profile is updated, THE Profile_Handler SHALL persist the updated Profile to the Users DynamoDB table.
4. THE Profile_Handler SHALL produce Profile output as valid JSON conforming to the defined Profile schema.
5. FOR ALL valid Conversation histories, parsing the Bedrock_Client JSON output then re-serializing it SHALL produce an equivalent Profile object (round-trip property).
6. IF the Bedrock_Client returns malformed JSON, THEN THE Profile_Handler SHALL log the error and return a structured error response without corrupting the existing Profile.

---

### Requirement 5: Personalized Recommendations (ET Ecosystem Cross-Sell Engine)

**User Story:** As a User, I want to receive personalized recommendations for ET products and partner services, so that I can discover the full value of the ET ecosystem relevant to my financial life.

#### Acceptance Criteria

1. THE Recommendation_Handler SHALL generate Recommendations based on the User's Profile using the Bedrock_Client with a structured prompt and JSON output.
2. THE Recommendation_Handler SHALL map Recommendations to ET product categories: ET Prime, ET Markets, masterclasses, corporate events, wealth summits, and financial services partnerships.
3. WHEN a User's Profile is updated, THE Recommendation_Handler SHALL regenerate Recommendations and persist the updated set to the Recommendations DynamoDB table.
4. THE Recommendation_Handler SHALL produce a minimum of 3 and a maximum of 10 Recommendations per User per generation cycle.
5. WHEN the Frontend requests Recommendations, THE API_Gateway SHALL route the request to THE Recommendation_Handler which SHALL return the persisted Recommendations for the authenticated User.
6. IF a User has no Profile, THEN THE Recommendation_Handler SHALL return a default set of Recommendations based on general ET product categories.

---

### Requirement 6: Action-Based Navigation

**User Story:** As a User, I want the Concierge to suggest actionable next steps within the chat, so that I can navigate to relevant ET products or services directly from the conversation.

#### Acceptance Criteria

1. WHEN the Chat_Handler generates a response containing a Recommendation, THE Chat_Handler SHALL include structured action metadata (label, destination URL or route) in the response payload.
2. THE Frontend SHALL render action buttons or cards for each action item returned in the Chat_Handler response.
3. WHEN a User selects an action, THE Frontend SHALL navigate to the specified destination or open the relevant ET product page.
4. THE Chat_Handler SHALL include at most 3 action items per response to avoid overwhelming the User.

---

### Requirement 7: Dashboard

**User Story:** As a User, I want a dashboard that summarizes my profile and top recommendations, so that I can quickly see my personalized ET ecosystem map.

#### Acceptance Criteria

1. THE Frontend SHALL render a dashboard view displaying the User's extracted Profile summary and current Recommendations.
2. WHEN a User navigates to the dashboard, THE Frontend SHALL fetch the latest Profile and Recommendations from the API_Gateway.
3. THE Frontend SHALL display Recommendations grouped by ET product category.
4. WHEN a User's Recommendations are updated, THE Frontend SHALL reflect the updated Recommendations on the dashboard without requiring a full page reload.

---

### Requirement 8: AI Inference via Amazon Bedrock

**User Story:** As a developer, I want all AI inference to go through Amazon Bedrock with structured prompts and JSON output, so that responses are consistent, parseable, and maintainable.

#### Acceptance Criteria

1. THE Bedrock_Client SHALL invoke Amazon Bedrock using a structured system prompt that defines the Concierge's persona, scope, and output format.
2. THE Bedrock_Client SHALL request JSON-formatted output for all Profile extraction and Recommendation generation invocations.
3. WHEN the Bedrock_Client receives a response, THE Bedrock_Client SHALL validate that the response is valid JSON before returning it to the calling handler.
4. IF the Bedrock_Client receives a non-JSON response for a structured output invocation, THEN THE Bedrock_Client SHALL retry the invocation up to 2 times before returning an error.
5. THE Bedrock_Client SHALL parse then serialize all structured JSON responses to verify round-trip equivalence before returning them to calling handlers.

---

### Requirement 9: Data Persistence

**User Story:** As a developer, I want all user data stored in DynamoDB with a clear table structure, so that the system is scalable and data is reliably persisted.

#### Acceptance Criteria

1. THE DynamoDB SHALL maintain three tables: Users (keyed by userId), Conversations (keyed by userId and conversationId), and Recommendations (keyed by userId).
2. WHEN a new User authenticates for the first time, THE Profile_Handler SHALL create a Users table record for that User.
3. WHEN a message exchange is completed, THE Chat_Handler SHALL append the message pair to the Conversations table record for the active Conversation.
4. THE DynamoDB SHALL enforce that each Conversation record contains an ordered list of message pairs with timestamps.
5. IF a DynamoDB write operation fails, THEN the calling Lambda function SHALL return a 500 error response and log the failure details.

---

### Requirement 10: Frontend Theming

**User Story:** As a User, I want to switch between dark and light themes, so that I can use the Concierge comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Frontend SHALL support both a dark theme and a light theme.
2. WHEN a User toggles the theme, THE Frontend SHALL apply the selected theme immediately without a page reload.
3. THE Frontend SHALL persist the User's theme preference to browser local storage.
4. WHEN the Frontend loads, THE Frontend SHALL apply the theme from local storage if present, otherwise apply the system default theme.

---

### Requirement 11: Responsive Design

**User Story:** As a User, I want the application to work on both desktop and mobile devices, so that I can access the Concierge from any device.

#### Acceptance Criteria

1. THE Frontend SHALL render correctly on viewport widths from 320px to 2560px.
2. THE Frontend SHALL adapt the chat UI layout for mobile viewports (below 768px) by collapsing the dashboard sidebar into a navigable tab or drawer.
3. WHEN a User accesses the Frontend on a touch device, THE Frontend SHALL support touch-based scrolling and interaction for all interactive elements.

---

### Requirement 12: Security and Secrets Management

**User Story:** As a developer, I want all secrets and configuration to be managed via environment variables, so that no credentials are hardcoded in the codebase.

#### Acceptance Criteria

1. THE Chat_Handler, Profile_Handler, and Recommendation_Handler SHALL read all AWS service credentials, API keys, and configuration values exclusively from environment variables or AWS Systems Manager Parameter Store.
2. THE Frontend SHALL read all configuration values (API endpoint, Cognito pool IDs) exclusively from environment variables injected at build time.
3. IF a required environment variable is missing at Lambda cold start, THEN the Lambda function SHALL log a descriptive error and return a 500 response for all invocations until the variable is set.
4. THE Concierge codebase SHALL contain no hardcoded secrets, API keys, or credentials in any source file.

---

### Requirement 13: API Structure and Documentation

**User Story:** As a developer, I want a clean, documented REST API, so that the frontend and backend are clearly decoupled and the API is easy to maintain.

#### Acceptance Criteria

1. THE API_Gateway SHALL expose the following endpoints: POST /chat, GET /profile, PUT /profile, GET /recommendations, and POST /recommendations/refresh.
2. WHEN a request is received without a valid JWT token, THE API_Gateway SHALL return a 401 Unauthorized response.
3. THE API_Gateway SHALL route each endpoint to its corresponding Lambda function: /chat to Chat_Handler, /profile to Profile_Handler, and /recommendations to Recommendation_Handler.
4. THE Concierge SHALL include an OpenAPI specification document describing all API endpoints, request schemas, and response schemas.

---

### Requirement 14: Deployment

**User Story:** As a developer, I want the frontend deployed on AWS Amplify and the backend on Lambda with API Gateway, so that the application is scalable and follows AWS best practices.

#### Acceptance Criteria

1. THE Frontend SHALL be deployable to AWS Amplify via a standard build command.
2. THE Chat_Handler, Profile_Handler, and Recommendation_Handler SHALL each be deployable as independent AWS Lambda functions.
3. THE API_Gateway SHALL be configured with CORS to allow requests from the Amplify-hosted Frontend domain.
4. THE Concierge SHALL include a README with step-by-step setup instructions covering Cognito configuration, DynamoDB table creation, Lambda deployment, API Gateway setup, and Amplify deployment.

---

### Requirement 15: Voice Input (User → AI)

**User Story:** As a User, I want to speak my messages instead of typing them, so that I can interact with the Concierge hands-free and more naturally.

#### Acceptance Criteria

1. THE Frontend SHALL include a microphone button in the chat input bar that activates voice capture when clicked.
2. WHEN a User clicks the microphone button, THE Frontend SHALL request microphone permission from the browser and begin capturing speech using the `react-speech-recognition` package (Web Speech API).
3. WHEN the User stops speaking, THE Frontend SHALL automatically populate the chat input field with the transcribed text.
4. WHEN the browser does not support the Web Speech API, THE Frontend SHALL display a descriptive fallback message indicating that voice input is unavailable and hide the microphone button.
5. WHILE voice capture is active, THE Frontend SHALL display a visual indicator (e.g., animated microphone icon or pulsing border) to signal that the microphone is listening.
6. WHEN a User clicks the microphone button again while capture is active, THE Frontend SHALL stop voice capture immediately.
7. THE Frontend SHALL NOT transmit raw audio data to the backend; all speech-to-text conversion SHALL occur client-side via the Web Speech API.

---

### Requirement 16: Voice Output — AI Text-to-Speech via Amazon Polly

**User Story:** As a User, I want the AI's responses read aloud to me, so that I can listen to the Concierge's guidance without reading the screen.

#### Acceptance Criteria

1. THE Chat_Handler SHALL accept an optional `voiceEnabled` boolean field in the request body; WHEN `voiceEnabled` is `true`, THE Chat_Handler SHALL invoke Amazon Polly to synthesize the assistant response text to speech.
2. WHEN Amazon Polly synthesis is requested, THE Chat_Handler SHALL use the Amazon Polly `SynthesizeSpeech` API to generate an MP3 audio stream and upload it to a designated S3 bucket, then return a pre-signed S3 URL (valid for 300 seconds) in the response payload as `audioUrl`.
3. WHEN `voiceEnabled` is `false` or absent, THE Chat_Handler SHALL NOT invoke Amazon Polly and SHALL NOT include `audioUrl` in the response.
4. THE Frontend SHALL include a speaker/audio toggle button in the chat interface that controls whether voice output is requested for subsequent messages.
5. WHEN the Frontend receives a response containing `audioUrl`, THE Frontend SHALL automatically play the audio using the browser's native `<audio>` element.
6. THE Frontend SHALL display playback controls (play, pause, stop) alongside the assistant message bubble when audio is available.
7. IF Amazon Polly or S3 returns an error, THE Chat_Handler SHALL log the error and return the text response without `audioUrl`, ensuring voice failure does not degrade the core chat experience.
8. THE Chat_Handler SHALL read the Polly voice ID and S3 bucket name from environment variables; no Polly or S3 configuration SHALL be hardcoded.
9. THE S3 bucket used for Polly audio SHALL be configured with a lifecycle policy to automatically delete objects after 1 hour.
