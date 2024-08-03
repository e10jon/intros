import { getClerkInstance } from "@clerk/clerk-expo";
import { getEnvCred } from "../get-env-cred";
import { Body, Data, Path, Params, Method } from "@intros/types";

export const host = `https://${getEnvCred("introsApiHost")}`;
export const urlScheme = "exp://"; // TODO: "intros://";

export const introsFetch = async <P extends Path, M extends Method = "GET">(
  path: P,
  opts?: {
    method?: M;
    body?: Body<P, M> extends never ? never : Body<P, M>;
    params?: Params<P> extends never ? never : Params<P>;
  }
) => {
  const clerk = getClerkInstance();
  const token = await clerk.session?.getToken();

  const pathAfterParams = (() => {
    if (!opts?.params) return path;
    return path.replaceAll(/\[(.+?)\]/g, (_, key: keyof Params<P>) => {
      const val = opts.params?.[key];
      return typeof val === "string" ? val : "";
    });
  })();

  const url = `${host}${pathAfterParams}`;
  const method = opts?.method ?? "GET";
  const body = opts?.body ? JSON.stringify(opts.body) : undefined;

  console.log(`[introsFetch] ${method} ${pathAfterParams} ${body || ""}`);

  const res = await fetch(url, {
    method,
    ...(body ? { body } : undefined),
    headers: {
      ["Content-Type"]: "application/json",
      ...(token ? { Authorization: token } : undefined),
    },
  });

  return res.json() as Data<P, M>;
};
