import { type SafeParseReturnType } from "zod";
import {
  type RoutePaths,
  type RouteBody,
  type RouteData,
  routes,
} from "./routes.js";

export async function introsFetch<P extends RoutePaths, B extends RouteBody<P>>(
  pathMethod: P,
  opts: RouteBody<P> extends never ? { body?: never } : { body: B }
): Promise<SafeParseReturnType<unknown, RouteData<P>>> {
  const [path, method] = pathMethod.split(" ");

  const res = await fetch(`${host}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    method,
  });

  const data = await res.json();
  const schema = routes[pathMethod].data;

  return schema.safeParse(data);
}

export const host = "http://localhost:3000/api";
