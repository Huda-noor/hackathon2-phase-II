import { auth, User } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888/api/v1";

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authService = {
  async signUp(data: SignUpData): Promise<{ user: User; token: string }> {
    console.log("=== SIGNUP START ===");
    console.log("Signup data:", data);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || "Signup failed");
      }

      const authResponse: AuthResponse = await response.json();
      const user: User = authResponse.user;
      const token = authResponse.access_token;

      console.log("Token received from backend");
      console.log("User object:", user);

      // Store auth data in localStorage
      auth.setToken(token);
      auth.setUser(user);

      console.log("=== SIGNUP SUCCESS ===");
      return { user, token };
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  async signIn(data: SignInData): Promise<{ user: User; token: string }> {
    console.log("=== SIGNIN START ===");
    console.log("Signin data:", data.email);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || "Signin failed");
      }

      const authResponse: AuthResponse = await response.json();
      const user: User = authResponse.user;
      const token = authResponse.access_token;

      console.log("Token received from backend");
      console.log("User object:", user);

      // Store auth data in localStorage
      auth.setToken(token);
      auth.setUser(user);

      console.log("=== SIGNIN SUCCESS ===");
      return { user, token };
    } catch (error) {
      console.error("Signin error:", error);
      throw error;
    }
  },

  signOut(): void {
    console.log("=== SIGNOUT ===");
    auth.clearAuth();
  },

  getCurrentUser(): User | null {
    return auth.getUser();
  },

  isAuthenticated(): boolean {
    return auth.isAuthenticated();
  },
};
