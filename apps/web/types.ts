import { User } from "@prisma/client";
import { CreateSubscription } from "./container/modules/stripe";

const paths = ["/api", "/api/payment/subscription"] as const;

type Paths = typeof paths;
export type Path = Paths[number];

export type Data<P extends Path> = P extends "/api"
  ? { users: User[] }
  : P extends "/api/payment/subscription"
  ? CreateSubscription
  : unknown;
