import { WebhookPayload } from "@/container/modules/clerk/types";
import { Container } from "../..";
import { clerkClient } from "@clerk/nextjs/server";
import { numTokensPerMonth } from "@/lib/constants";

export class ClerkModule {
  constructor(private cnt: Container) {}

  apiClient = clerkClient();

  private upsertUser = async (
    payload: WebhookPayload<"user.created" | "user.updated">
  ) => {
    const phoneNumber = payload.data.phone_numbers[0];
    const emailAddress = payload.data.email_addresses[0];

    const email = emailAddress.email_address;
    const clerkId = payload.data.id;
    const data = { email, phone: phoneNumber?.phone_number };

    // create or update the database user
    const user = await this.cnt.prisma.user.upsert({
      where: { clerkId },
      create: {
        ...data,
        clerkId,
        // create the monthly tokens for new users
        tokens: {
          createMany: {
            data: [...new Array(numTokensPerMonth)].map(() => ({})),
          },
        },
      },
      update: data,
    });

    await this.syncMetadata({
      prismaUserId: user.id,
      clerkUserId: user.clerkId,
      currentTokenIsAvailable: payload.data.public_metadata.tokenIsAvailable,
      currentCreationIsComplete:
        payload.data.public_metadata.creationIsComplete,
    });

    return user;
  };

  captureUserCreatedEvent = this.upsertUser;
  captureUserUpdatedEvent = this.upsertUser;

  async syncMetadata({
    prismaUserId,
    clerkUserId,
    currentTokenIsAvailable,
    currentCreationIsComplete,
  }: {
    prismaUserId: string;
    clerkUserId: string;
    currentTokenIsAvailable?: boolean;
    currentCreationIsComplete?: boolean;
  }) {
    const publicMetadata: UserPublicMetadata = {};

    // check for token availability
    const numAvailableTokens = await this.cnt.prisma.token.count({
      where: { userId: prismaUserId, conversationId: null },
    });

    if (
      (numAvailableTokens > 0 && !currentTokenIsAvailable) ||
      (numAvailableTokens <= 0 && currentTokenIsAvailable)
    ) {
      publicMetadata.tokenIsAvailable = numAvailableTokens > 0;
    }

    // check for user creation
    if (!currentCreationIsComplete) publicMetadata.creationIsComplete = true;

    if (Object.keys(publicMetadata).length === 0) return;

    console.log(
      `[clerk] updateUserMetadata ${clerkUserId} ${JSON.stringify(
        publicMetadata
      )} `
    );
    return await this.cnt.clerk.apiClient.users.updateUserMetadata(
      clerkUserId,
      { publicMetadata }
    );
  }
}
