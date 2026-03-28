import { useAuth } from "react-oidc-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import MainApp from "./pages/MainApp";
import LoginPage from "./pages/LoginPage";

const queryClient = new QueryClient();

export default function App() {
  const auth = useAuth();

  // Still loading OIDC session
  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // OIDC error
  if (auth.error) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-destructive text-sm">Auth error: {auth.error.message}</p>
          <button
            onClick={() => auth.signinRedirect()}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const logoutUri = import.meta.env.VITE_REDIRECT_URI || window.location.origin;
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
    // Remove local session first
    auth.removeUser();
    // Redirect to Cognito logout
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isAuthenticated && auth.user) {
    const idToken = auth.user.id_token ?? "";
    const userId = auth.user.profile.sub ?? "";
    const email = (auth.user.profile.email as string) ?? "";

    // Store token for API calls
    localStorage.setItem("idToken", idToken);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userEmail", email);

    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <MainApp
            userId={userId}
            email={email}
            onSignOut={handleSignOut}
          />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Not authenticated — show login page
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LoginPage />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
