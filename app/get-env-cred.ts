const env = {
  expoPublicClerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
};

export const getEnvCred = (key: keyof typeof env) => {
  if (!env[key]) throw new Error(`Missing environment variable: ${key}`);
  return env[key];
};
