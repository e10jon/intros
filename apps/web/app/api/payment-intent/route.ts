import { NextResponse } from "next/server";
import { Container } from "@/container";

export type Data = {
  paymentIntentClientSecret: string | null;
  ephemeralKeySecret: string | null | undefined;
  stripeCustomerId: string;
};

export async function POST(): Promise<NextResponse<Data>> {
  const cnt = await Container.init();

  await cnt.createStripeCustomerIdIfNotExists();

  const { paymentIntent, ephemeralKey, stripeCustomerId } =
    await cnt.stripe.createPaymentIntent(1000, "usd");

  return NextResponse.json({
    paymentIntentClientSecret: paymentIntent.client_secret,
    ephemeralKeySecret: ephemeralKey.secret,
    stripeCustomerId,
  });
}
