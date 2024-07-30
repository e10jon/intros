import { getClerkInstance } from "@clerk/clerk-expo";
import { getEnvCred } from "./get-env-cred";

const host = `https://${getEnvCred("introsApiHost")}`;

export const introsFetch = async (path: string) => {
  const clerk = getClerkInstance();
  const token = await clerk.session?.getToken();

  const res = await fetch(host + path, {
    headers: {
      ...(token ? { Authorization: token } : undefined),
    },
  });

  return res.json();
};
