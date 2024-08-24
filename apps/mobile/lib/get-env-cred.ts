const env = {
  stychPublicToken: process.env.EXPO_PUBLIC_STYTCH_PUBLIC_TOKEN,
};

export const getEnvCred = (key: keyof typeof env) => {
  const val = env[key];
  if (!val) throw new Error(`Missing environment variable: ${key}`);
  return val;
};
