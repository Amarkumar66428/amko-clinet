import api from "./api";

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload extends SignInPayload {
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  data?: { token?: string };
}

const authService = {
  signUp: async (payload: SignUpPayload) => (await api.post<AuthResponse>("/auth/register", payload)).data,
  signIn: async (payload: SignInPayload) => (await api.post<AuthResponse>("/auth/login", payload)).data,
};

export default authService;
