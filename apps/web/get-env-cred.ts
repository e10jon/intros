const env = {
  databaseUrl: process.env.DATABASE_URL,
  sendgridApiKey: process.env.SENDGRID_API_KEY,
};

export const getEnvCred = (key: keyof typeof env) => {
  if (!env[key]) throw new Error(`Missing environment variable: ${key}`);
  return env[key];
};
