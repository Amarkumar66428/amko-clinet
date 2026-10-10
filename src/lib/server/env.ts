import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const serverEnv = {
  get mongodbUri() {
    return required("MONGODB_URI");
  },
  get mongodbDb() {
    return process.env.MONGODB_DB || "amk";
  },
  get googleClientId() {
    return required("GOOGLE_CLIENT_ID");
  },
  get googleClientSecret() {
    return required("GOOGLE_CLIENT_SECRET");
  },
  get authSecret() {
    return new TextEncoder().encode(required("AUTH_SECRET"));
  },
};
