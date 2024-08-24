import { z, type ZodTypeAny } from "zod";

export type Method = "GET" | "POST" | "PUT" | "DELETE";

export const routes = {
  "/ GET": {
    body: z.never(),
    data: z.object({ hello: z.literal("world") }),
  },
  "/ POST": {
    body: z.object({ hello: z.string() }),
    data: z.object({ hello: z.literal("world") }),
  },
  "/users GET": {
    body: z.never(),
    data: z.object({
      users: z.array(
        z.object({
          id: z.string(),
          name: z.string().nullish(),
        })
      ),
    }),
  },
};

export type Routes = typeof routes;
export type RoutePaths = keyof Routes;
export type RouteData<P extends RoutePaths> = z.infer<Routes[P]["data"]>;
export type RouteBody<P extends RoutePaths> = Routes[P] extends {
  body: ZodTypeAny;
}
  ? z.infer<Routes[P]["body"]>
  : never;
