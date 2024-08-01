import { WebhookPayload } from "@/lib/clerk-types";
import { Container } from "..";
import Stripe from "stripe";
import { getEnvCred } from "@/get-env-cred";

export type CreateSubscription = Stripe.Response<
  Stripe.Subscription & {
    latest_invoice: Stripe.Invoice & {
      payment_intent: Stripe.PaymentIntent;
    };
    pending_setup_intent?: Stripe.SetupIntent;
  }
>;

export class StripeModule {
  constructor(private cnt: Container) {}

  /** Direct access to Stripe API client. */
  apiClient = new Stripe(getEnvCred("stripeSecretKey"));

  async createSubscription() {
    const priceId = getEnvCred("stripePriceId");
    const customerId = await this.cnt.getStripeCustomerId();

    const subscription = (await this.apiClient.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId, quantity: 1 }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent", "pending_setup_intent"],
    })) as CreateSubscription;

    return subscription;
  }
}
