import { getClerkInstance } from "@clerk/clerk-expo";
import { getEnvCred } from "../get-env-cred";
import { Body, Data, Path } from "@intros/types";

export const host = `https://${getEnvCred("introsApiHost")}`;
export const urlScheme = "exp://"; // "intros://";

export const introsFetch = async <P extends Path>(
  path: P,
  opts?: { method?: "POST"; body?: Body<P> extends never ? never : Body<P> }
) => {
  const clerk = getClerkInstance();
  const token = await clerk.session?.getToken();

  const res = await fetch(host + path, {
    method: opts?.method ?? "GET",
    ...(opts?.body ? { body: JSON.stringify(opts.body) } : undefined),
    headers: {
      ["Content-Type"]: "application/json",
      ...(token ? { Authorization: token } : undefined),
    },
  });

  return res.json() as Data<P>;
};
