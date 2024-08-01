import { getEnvCred } from "@/get-env-cred";
import { inspect } from "@/inspect";
import { Container } from "@/container";

const webhookSecret = getEnvCred("stripeWebhookSecret");

export async function POST(request: Request) {
  const stripeSignature = request.headers.get("stripe-signature");
  if (!stripeSignature)
    return new Response("No stripe signature", { status: 400 });

  const body = await request.text();
  const cnt = await Container.init();

  const payload = cnt.stripe.apiClient.webhooks.constructEvent(
    body,
    stripeSignature,
    webhookSecret
  );

  inspect(payload);

  if (payload.type === "invoice.paid") {
    await cnt.stripe.captureInvoicePaidEvent(payload);
  }

  return new Response("OK", { status: 200 });
}
