import { Webhook } from "svix";
import { getEnvCred } from "@/lib/get-env-cred";
import { inspect } from "@/lib/inspect";
import { WebhookPayload } from "@/container/modules/clerk/types";
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

  if (payload.type === "user.created") {
    await cnt.clerk.captureUserCreatedEvent(
      payload as WebhookPayload<"user.created">
    );
  } else if (payload.type === "user.updated") {
    await cnt.clerk.captureUserUpdatedEvent(
      payload as WebhookPayload<"user.updated">
    );
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
