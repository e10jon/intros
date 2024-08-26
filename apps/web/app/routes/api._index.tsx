import { Container } from "@intros/container";
import { type RouteData } from "@intros/shared";
import {
  json,
  type LoaderFunctionArgs,
  type TypedResponse,
} from "@remix-run/node";

export const loader = async (
  args: LoaderFunctionArgs
): Promise<TypedResponse<RouteData<"/ GET">>> => {
  const cnt = await Container.init(args);
  const data = { hello: "world" } as const;
  return json(data);
};
