import { getClerkInstance } from "@clerk/clerk-expo";
import { getEnvCred } from "../get-env-cred";
import { Data, Path } from "@intros/types";

export const host = `https://${getEnvCred("introsApiHost")}`;
export const urlScheme = "exp://"; // "intros://";

export const introsFetch = async <P extends Path>(
  path: P,
  opts?: { method?: "POST" }
) => {
  const clerk = getClerkInstance();
  const token = await clerk.session?.getToken();

  const res = await fetch(host + path, {
    method: opts?.method ?? "GET",
    headers: {
      ...(token ? { Authorization: token } : undefined),
    },
  });

  return res.json() as Data<P>;
};
