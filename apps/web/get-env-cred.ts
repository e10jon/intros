const env = {
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  svixWebhookSecret: process.env.SVIX_WEBHOOK_SECRET,
};

export const getEnvCred = (key: keyof typeof env) => {
  const val = env[key];
  if (!val) throw new Error(`Missing environment variable: ${key}`);
  return val;
};
