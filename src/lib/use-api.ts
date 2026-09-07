import { useEffect, useMemo } from "react";
import { useAuth } from "@clerk/clerk-react";
import { apiClient } from "./axios";

/**
 * Hook to get an authenticated Axios instance.
 * It automatically injects the Clerk JWT token into the Authorization header
 * of every request.
 */
export function useApi() {
  const { getToken } = useAuth();

  const api = useMemo(() => {
    // Create an interceptor to inject the token before each request
    const requestInterceptor = apiClient.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Error getting Clerk token for API request:", error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Optionally handle 401 Unauthorized globally here
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error("Unauthorized: The Clerk token may have expired or is invalid.");
        }
        return Promise.reject(error);
      }
    );

    return {
      client: apiClient,
      cleanup: () => {
        apiClient.interceptors.request.eject(requestInterceptor);
        apiClient.interceptors.response.eject(responseInterceptor);
      }
    };
  }, [getToken]);

  // Cleanup interceptors on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      api.cleanup();
    };
  }, [api]);

  return api.client;
}
