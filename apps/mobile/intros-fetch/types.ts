const paths = ["/api", "/api/payment-intent"] as const;

type Paths = typeof paths;
export type Path = Paths[number];

export type Data<P extends Path> = P extends "/api"
  ? { users: [] }
  : P extends "/api/payment-intent"
  ? {
      clientSecret: string | null;
      ephemeralKeySecret: string | null | undefined;
      stripeCustomerId: string;
    }
  : unknown;
