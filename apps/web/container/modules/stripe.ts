import { WebhookPayload } from "@/lib/clerk-types";
import { Container } from "..";
import Stripe from "stripe";
import { getEnvCred } from "@/get-env-cred";

export class StripeModule {
  constructor(private cnt: Container) {}

  /** Direct access to Stripe API client. */
  apiClient = new Stripe(getEnvCred("stripeSecretKey"));

  /** Creates a PaymentIntent intended to be used by the frontend. */
  async createPaymentIntent(amount: number, currency: string) {
    const currentPrismaUser = await this.cnt.getCurrentPrismaUserOrThrow();
    if (!currentPrismaUser.stripeCustomerId)
      throw new Error("No Stripe customer ID");

    const ephemeralKey = await this.apiClient.ephemeralKeys.create(
      { customer: currentPrismaUser.stripeCustomerId },
      { apiVersion: "2024-06-20" }
    );

    const paymentIntent = await this.apiClient.paymentIntents.create({
      amount,
      currency,
      customer: currentPrismaUser.stripeCustomerId,
      automatic_payment_methods: { enabled: true },
    });

    return {
      paymentIntent,
      ephemeralKey,
      stripeCustomerId: currentPrismaUser.stripeCustomerId,
    };
  }
}
