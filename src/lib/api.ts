// API base resolution (priority):
// 1) VITE_FORCE_API_BASE (explicit override)
// 2) Localhost default to SAM at 127.0.0.1:3000
// 3) VITE_API_BASE
const forcedBase = import.meta.env.VITE_FORCE_API_BASE as string | undefined;
const API_BASE =
  forcedBase
    ? forcedBase
    : (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"))
      ? "http://127.0.0.1:3000"
      : (import.meta.env.VITE_API_BASE as string);

export interface Action {
  title: string;
  description: string;
  cta: string;
  target: string;
  url: string;
}

export interface ChatResponse {
  reply: string;
  response?: string;
  user_type: string;
  conversationId: string;
  actions: Action[];
  onboardingComplete: boolean;
  audioUrl?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  profession?: string;
  financialGoals?: string[];
  investmentExperience?: string;
  incomeRange?: string;
  riskAppetite?: string;
  etProductUsage?: string[];
  needs?: string[];
  userType?: string;
  updatedAt?: number;
}

export interface ProfileResponse {
  userId: string;
  email: string;
  profile: UserProfile | null;
  onboardingComplete: boolean;
}

export interface Recommendation {
  title: string;
  category: string;
  description: string;
  cta: string;
  url: string;
  relevanceScore?: number;
}

export interface RecommendationsResponse {
  userId: string;
  generatedAt: number;
  recommendations: Recommendation[];
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("idToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function sendChat(
  message: string,
  conversationId: string,
  voiceEnabled = false
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ message, conversationId, voiceEnabled }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Chat request failed");
  return data;
}

export async function getProfile(): Promise<ProfileResponse> {
  const res = await fetch(`${API_BASE}/profile`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load profile");
  return data;
}

export async function getRecommendations(): Promise<RecommendationsResponse> {
  const res = await fetch(`${API_BASE}/recommendations`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load recommendations");
  return data;
}

export async function refreshRecommendations(): Promise<RecommendationsResponse> {
  const res = await fetch(`${API_BASE}/recommendations/refresh`, {
    method: "POST",
    headers: authHeaders(),
    body: "{}",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to refresh");
  return data;
}

// Internal page targets → tab navigation
export const INTERNAL_TARGETS = new Set([
  "markets", "dashboard", "profile", "chat",
  "prime", "masterclass", "wealth_summit",
  "corporate_events", "financial_services",
  "loans", "insurance", "credit_cards", "wealth_management",
]);

export const TARGET_TO_TAB: Record<string, string> = {
  markets: "markets",
  prime: "prime",
  masterclass: "masterclass",
  wealth_summit: "wealth_summit",
  corporate_events: "corporate_events",
  financial_services: "financial_services",
  loans: "financial_services",
  insurance: "financial_services",
  credit_cards: "financial_services",
  wealth_management: "financial_services",
  dashboard: "dashboard",
  profile: "profile",
};
