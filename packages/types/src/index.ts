import { User } from "@prisma/client";
import Stripe from "stripe";

const paths = ["/api", "/api/payment/subscription"] as const;

type Paths = typeof paths;
export type Path = Paths[number];

export type Data<P extends Path> = P extends "/api"
  ? { users: User[] }
  : P extends "/api/payment/subscription"
  ? CreateSubscription
  : unknown;

export type CreateSubscription = Stripe.Response<
  Stripe.Subscription & {
    latest_invoice: Stripe.Invoice & {
      payment_intent: Stripe.PaymentIntent;
    };
    pending_setup_intent?: Stripe.SetupIntent;
  }
>;
