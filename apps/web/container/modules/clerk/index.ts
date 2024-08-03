import { auth, User as ClerkUser, currentUser } from "@clerk/nextjs/server";
import { WebhookPayload } from "@/container/modules/clerk/types";
import { Container } from "../..";
import { clerkClient } from "@clerk/nextjs/server";
import { numTokensPerMonth } from "@/lib/constants";
import { User } from "@prisma/client";

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
    const prismaUser = await this.cnt.prisma.user.upsert({
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

    await this.syncWithClerk({
      prismaUser,
      clerkUser: {
        id: clerkId,
        externalId: prismaUser.id,
        publicMetadata: payload.data.public_metadata,
      },
    });

    return prismaUser;
  };

  captureUserCreatedEvent = this.upsertUser;
  captureUserUpdatedEvent = this.upsertUser;

  async syncWithClerk({
    prismaUser,
    clerkUser,
  }: {
    prismaUser: User;
    clerkUser: Pick<ClerkUser, "id" | "externalId" | "publicMetadata">;
  }) {
    const metaDataPromise = (async () => {
      const publicMetadata: UserPublicMetadata = {};

      // check for token availability
      const numAvailableTokens = await this.cnt.prisma.token.count({
        where: { userId: prismaUser.id, conversationId: null },
      });

      if (
        (numAvailableTokens > 0 &&
          !clerkUser.publicMetadata.tokenIsAvailable) ||
        (numAvailableTokens <= 0 && clerkUser.publicMetadata.tokenIsAvailable)
      ) {
        publicMetadata.tokenIsAvailable = numAvailableTokens > 0;
      }

      // check for user creation
      if (!clerkUser.publicMetadata.creationIsComplete)
        publicMetadata.creationIsComplete = true;

      if (Object.keys(publicMetadata).length === 0) return;

      console.log(
        `[clerk] updateUserMetadata ${clerkUser.id} ${JSON.stringify(
          publicMetadata
        )} `
      );
      return await this.cnt.clerk.apiClient.users.updateUserMetadata(
        clerkUser.id,
        { publicMetadata }
      );
    })();

    const updateUserPromise = (async () => {
      if (clerkUser.externalId === prismaUser.id) return;

      const args = { externalId: prismaUser.id };
      console.log(
        `[clerk] updateUser ${clerkUser.id} ${JSON.stringify(args)} `
      );
      await this.cnt.clerk.apiClient.users.updateUser(clerkUser.id, args);
    })();

    return await Promise.all([metaDataPromise, updateUserPromise]);
  }
}
