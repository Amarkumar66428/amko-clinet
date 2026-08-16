import api from "../utils/axios";

const signUp = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};

const signIn = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

const authService = { signUp, signIn };

export default authService;
