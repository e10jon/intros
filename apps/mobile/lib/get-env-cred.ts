const env = {
  clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
};

export const getEnvCred = (key: keyof typeof env) => {
  const val = env[key];
  if (!val) throw new Error(`Missing environment variable: ${key}`);
  return val;
};
