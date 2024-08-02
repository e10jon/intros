import IORedis from "ioredis";
import { getEnvCred } from "@/lib/get-env-cred";

export const connection = new IORedis(getEnvCred("redisUrl"), {
  maxRetriesPerRequest: null,
});
