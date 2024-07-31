const paths = ["/api", "/api/payment-intent"] as const;

type Paths = typeof paths;
export type Path = Paths[number];

export type Data<P extends Path> = P extends "/api"
  ? { hello: string }
  : P extends "/api/payment-intent"
  ? {
      paymentIntentClientSecret: string | null;
      ephemeralKeySecret: string | null | undefined;
      stripeCustomerId: string;
    }
  : unknown;
