const env = {
  clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  introsApiHost: process.env.EXPO_PUBLIC_INTROS_API_HOST,
};

export const getEnvCred = (key: keyof typeof env): string => {
  const val = env[key];
  if (!val) throw new Error(`Missing environment variable: ${key}`);
  return val;
};
