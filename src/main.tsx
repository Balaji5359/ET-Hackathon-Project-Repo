import { createRoot } from "react-dom/client";
import { AuthProvider } from "react-oidc-context";
import App from "./App.tsx";
import "./index.css";

// Prefer the live origin for local testing to avoid unintended Amplify redirects.
const redirectUri =
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? window.location.origin
    : (import.meta.env.VITE_REDIRECT_URI || window.location.origin);

const cognitoAuthConfig = {
  authority: `https://cognito-idp.ap-south-1.amazonaws.com/${import.meta.env.VITE_COGNITO_USER_POOL_ID}`,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: redirectUri,
  response_type: "code",
  scope: "email openid phone",
  // After login, remove the ?code= from the URL
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

createRoot(document.getElementById("root")!).render(
  <AuthProvider {...cognitoAuthConfig}>
    <App />
  </AuthProvider>
);
