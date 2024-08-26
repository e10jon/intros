import { Container } from "@intros/container";
import { type RouteData } from "@intros/shared";
import {
  json,
  type LoaderFunctionArgs,
  type TypedResponse,
} from "@remix-run/node";

export const loader = async (
  args: LoaderFunctionArgs
): Promise<TypedResponse<RouteData<"/users GET">>> => {
  const cnt = new Container();
  const users = await cnt.prisma.user.findMany({
    select: { id: true },
  });
  return json({ users });
};
