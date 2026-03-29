const API_BASE = import.meta.env.VITE_API_BASE || "";
function authHeaders() {
    const token = localStorage.getItem("idToken");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}
async function readJson(res) {
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
        const message = (data && data.error) || "Request failed";
        throw new Error(message);
    }
    return data;
}
export async function sendChat(message, conversationId, voiceEnabled = false) {
    const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ message, conversationId, voiceEnabled }),
    });
    return readJson(res);
}
export async function getProfile() {
    const res = await fetch(`${API_BASE}/profile`, { headers: authHeaders() });
    return readJson(res);
}
export async function updateProfile(profile, conversationId) {
    const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(conversationId ? { conversationId } : { profile }),
    });
    return readJson(res);
}
export async function getRecommendations() {
    const res = await fetch(`${API_BASE}/recommendations`, { headers: authHeaders() });
    return readJson(res);
}
export async function refreshRecommendations() {
    const res = await fetch(`${API_BASE}/recommendations/refresh`, {
        method: "POST",
        headers: authHeaders(),
        body: "{}",
    });
    return readJson(res);
}
// Internal page targets ? tab navigation
export const INTERNAL_TARGETS = new Set([
    "markets", "dashboard", "profile", "chat",
    "prime", "masterclass", "wealth_summit",
    "corporate_events", "financial_services",
    "loans", "insurance", "credit_cards", "wealth_management",
]);
export const TARGET_TO_TAB = {
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
