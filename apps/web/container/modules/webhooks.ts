import { WebhookPayload } from "@/lib/clerk-types";
import { Container } from "..";

export class WebhooksModule {
  constructor(private cnt: Container) {}

  captureSessionCreatedEvent = async (
    payload: WebhookPayload<"session.created">
  ) => {
    await this.upsertUser({
      clerkId: payload.data.user_id,
    });
  };

  captureUserCreatedEvent = async (payload: WebhookPayload<"user.created">) => {
    await this.upsertUser({
      clerkId: payload.data.id,
      email: payload.data.email_addresses[0].email_address,
      emailIsVerified:
        payload.data.email_addresses[0].verification.status === "verified",
      firstName: payload.data.first_name,
      lastName: payload.data.last_name,
    });
  };

  private upsertUser = async ({
    clerkId,
    email,
    emailIsVerified,
    firstName,
    lastName,
  }: {
    clerkId: string;
    email?: string;
    emailIsVerified?: boolean;
    firstName?: string | null;
    lastName?: string | null;
  }) => {
    await this.cnt.prisma.user.upsert({
      where: { clerkId },
      create: { clerkId, email, emailIsVerified, firstName, lastName },
      update: { email, firstName, lastName },
    });
  };
}
