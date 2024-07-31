import { Webhook } from "svix";
import { getEnvCred } from "@/get-env-cred";
import { inspect } from "@/inspect";
import { WebhookPayload } from "@/lib/clerk-types";
import { Container } from "@/container";

export async function POST(request: Request) {
  const body = await request.text();

  try {
    validateWebhookRequest(body, request.headers);
  } catch (e) {
    return new Response("Bad Request", { status: 400 });
  }

  const payload = JSON.parse(body) as WebhookPayload;
  inspect(payload);

  const cnt = await Container.init();

  try {
    if (payload.type === "user.created") {
      await cnt.webhooks.captureUserCreatedEvent(
        payload as WebhookPayload<"user.created">
      );
    } else if (payload.type === "user.updated") {
      await cnt.webhooks.captureUserUpdatedEvent(
        payload as WebhookPayload<"user.updated">
      );
    }
  } catch (e) {
    inspect(e, "error");
  }

  return new Response("OK", { status: 200 });
}

const validateWebhookRequest = (body: string, headers: Headers) => {
  const webhookSecret = getEnvCred("svixWebhookSecret");
  const sivx = new Webhook(webhookSecret);

  return sivx.verify(body, {
    "svix-id": headers.get("svix-id") ?? "",
    "svix-timestamp": headers.get("svix-timestamp") ?? "",
    "svix-signature": headers.get("svix-signature") ?? "",
  });
};
