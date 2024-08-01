import { WebhookPayload } from "@/container/modules/clerk/types";
import { Container } from "../..";
import { clerkClient } from "@clerk/nextjs/server";

export class ClerkModule {
  constructor(private cnt: Container) {}

  apiClient = clerkClient;

  private upsertUser = async (
    payload: WebhookPayload<"user.created" | "user.updated">
  ) => {
    const phoneNumber = payload.data.phone_numbers[0];
    const emailAddress = payload.data.email_addresses[0];

    const email = emailAddress.email_address;
    const clerkId = payload.data.id;
    const data = { email, phone: phoneNumber?.phone_number };

    await this.cnt.prisma.user.upsert({
      where: { clerkId },
      create: { ...data, clerkId },
      update: data,
    });
  };

  captureUserCreatedEvent = this.upsertUser;
  captureUserUpdatedEvent = this.upsertUser;
}
