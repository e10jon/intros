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
      phone: payload.data.phone_numbers[0].phone_number,
      phoneIsVerified:
        payload.data.phone_numbers[0].verification.status === "verified",
      firstName: payload.data.first_name,
      lastName: payload.data.last_name,
    });
  };

  private upsertUser = async (args: {
    clerkId: string;
    email?: string;
    emailIsVerified?: boolean;
    phone?: string;
    phoneIsVerified?: boolean;
    firstName?: string | null;
    lastName?: string | null;
  }) => {
    await this.cnt.prisma.user.upsert({
      where: { clerkId: args.clerkId },
      create: args,
      update: args,
    });
  };
}
