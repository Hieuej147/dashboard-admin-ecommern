import axios from "axios";
import { ENV } from "../config/env";

// Export a base instance. 
// Note: We don't attach the token here because getting the Clerk token requires
// the `useAuth()` hook, which can only be called inside a React component.
export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Optionally, you can add timeout or other default config here
  timeout: 10000,
});
