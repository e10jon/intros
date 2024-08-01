import Stripe from "stripe";
import { getEnvCred } from "@/get-env-cred";
import { Container } from "@/container";
import { CreateSubscription } from "@intros/types";

export class StripeModule {
  constructor(private cnt: Container) {}

  /** Direct access to Stripe API client. */
  apiClient = new Stripe(getEnvCred("stripeSecretKey"));

  /** Will use the Stripe API to create a customer and save the ID in Prisma,
   * if the current user does not already have one. Returns the customer ID string. */
  getStripeCustomerId = async () => {
    const user = await this.cnt.getCurrentPrismaUserOrThrow();
    if (user.stripeCustomerId) return user.stripeCustomerId;

    const stripeCustomer = await this.apiClient.customers.create({
      email: user.email || undefined,
    });

    await this.cnt.updateCurrentPrismaUser({
      stripeCustomerId: stripeCustomer.id,
    });

    return stripeCustomer.id;
  };

  async createSubscription() {
    const priceId = getEnvCred("stripePriceId");
    const customerId = await this.getStripeCustomerId();

    const subscription = (await this.apiClient.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId, quantity: 1 }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent", "pending_setup_intent"],
    })) as CreateSubscription;

    return subscription;
  }

  async captureInvoicePaidEvent(payload: Stripe.InvoicePaidEvent) {
    const priceId = getEnvCred("stripePriceId");

    const subscriptionLine = payload.data.object.lines.data.find(
      (l) => l.price?.id === priceId
    );
    if (!subscriptionLine) return;

    const stripeSubscriptionId =
      typeof subscriptionLine.subscription === "string"
        ? subscriptionLine.subscription
        : subscriptionLine.subscription?.id;
    if (!stripeSubscriptionId) return;

    const stripeCustomerId =
      typeof payload.data.object.customer === "string"
        ? payload.data.object.customer
        : payload.data.object.customer?.id;
    if (!stripeCustomerId) return;

    const user = await this.cnt.prisma.user.findUnique({
      where: { stripeCustomerId },
    });
    if (!user)
      throw new Error(`No user found for stripeCustomerId ${stripeCustomerId}`);

    await this.cnt.clerk.apiClient.users.updateUserMetadata(user.clerkId, {
      publicMetadata: {
        stripeSubscriptionId,
        subscriptionIsActive: true,
      },
    });
  }
}
