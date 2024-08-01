import Stripe from "stripe";
import { getEnvCred } from "@/get-env-cred";
import { Container } from "@/container";
import { CreateSubscription } from "@intros/types";

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

  async captureInvoicePaidEvent(payload: Stripe.InvoicePaidEvent) {}
}
