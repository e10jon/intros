import { NextResponse } from "next/server";
import { Container } from "@/container";

import { Data } from "../../../../mobile/intros-fetch/types";

export async function POST(): Promise<
  NextResponse<Data<"/api/payment-intent">>
> {
  const cnt = await Container.init();

  await cnt.createStripeCustomerIdIfNotExists();

  const { paymentIntent, ephemeralKey, stripeCustomerId } =
    await cnt.stripe.createPaymentIntent(1000, "usd");

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    ephemeralKeySecret: ephemeralKey.secret,
    stripeCustomerId,
  });
}
