import api from "./api";

const authService = {
  signUp: async (payload) => (await api.post("/auth/register", payload)).data,
  signIn: async (payload) => (await api.post("/auth/login", payload)).data,
};

export default authService;
