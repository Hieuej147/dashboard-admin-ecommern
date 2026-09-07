export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/v1",
  CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
} as const;

if (!ENV.API_BASE_URL) {
  console.warn("VITE_API_BASE_URL is not set. Using default: http://localhost:3000/v1");
}
