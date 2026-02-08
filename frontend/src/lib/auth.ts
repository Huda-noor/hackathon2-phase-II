// frontend/src/lib/auth.ts

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export interface User {
  id: string;
  name: string;
  email: string;
}

export const auth = {
  getUser: (): User | null => {
    if (typeof window === "undefined") return null;
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!auth.getToken() && !!auth.getUser();
  },

  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  setToken: (token: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(TOKEN_KEY, token);
      console.log("Token stored successfully");
    } catch (error) {
      console.error("Error setting token:", error);
    }
  },

  setUser: (user: User): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      console.log("User stored successfully:", user);
    } catch (error) {
      console.error("Error setting user:", error);
    }
  },

  clearAuth: (): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      console.log("Auth cleared successfully");
    } catch (error) {
      console.error("Error clearing auth:", error);
    }
  },
};
