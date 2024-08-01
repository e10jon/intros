import { getClerkInstance } from "@clerk/clerk-expo";
import { getEnvCred } from "../get-env-cred";
import { Data, Path } from "../../web/types";

const host = `https://${getEnvCred("introsApiHost")}`;

export const introsFetch = async <P extends Path>(path: P) => {
  const clerk = getClerkInstance();
  const token = await clerk.session?.getToken();

  const res = await fetch(host + path, {
    headers: {
      ...(token ? { Authorization: token } : undefined),
    },
  });

  return res.json() as Data<P>;
};
