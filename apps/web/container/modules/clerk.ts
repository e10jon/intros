import { WebhookPayload } from "@/lib/clerk-types";
import { Container } from "..";

export class ClerkModule {
  constructor(private cnt: Container) {}

  private upsertUser = async (
    payload: WebhookPayload<"user.created" | "user.updated">
  ) => {
    const phoneNumber = payload.data.phone_numbers[0];
    const emailAddress = payload.data.email_addresses[0];

    const clerkId = payload.data.id;
    const email = emailAddress.email_address;
    const data = {
      clerkId,
      email,
      emailIsVerified: emailAddress?.verification.status === "verified",
      phone: phoneNumber?.phone_number,
      phoneIsVerified: phoneNumber?.verification?.status === "verified",
      firstName: payload.data.first_name,
      lastName: payload.data.last_name,
    };

    await this.cnt.prisma.user.upsert({
      where: { clerkId },
      create: data,
      update: data,
    });
  };

  captureUserCreatedEvent = this.upsertUser;
  captureUserUpdatedEvent = this.upsertUser;
}
