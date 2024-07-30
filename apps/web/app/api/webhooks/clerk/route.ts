import { Webhook } from "svix";
import { getEnvCred } from "@/get-env-cred";
import { inspect } from "@/inspect";

export async function POST(request: Request) {
  const body = await request.text();

  try {
    validateWebhookRequest(body, request.headers);
  } catch (e) {
    return new Response("Bad Request", { status: 400 });
  }

  const json = JSON.parse(body);
  inspect(json);

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
