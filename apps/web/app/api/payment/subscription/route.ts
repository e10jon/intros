import { NextResponse } from "next/server";
import { Container } from "@/container";
import { Data } from "@intros/types";

export async function POST(): Promise<
  NextResponse<Data<"/api/payment/subscription">>
> {
  const cnt = await Container.init();

  const subscription = await cnt.stripe.createSubscription();

  return NextResponse.json(subscription);
}
