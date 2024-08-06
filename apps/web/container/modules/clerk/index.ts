import { User as ClerkUser } from "@clerk/nextjs/server";
import { WebhookPayload } from "@/container/modules/clerk/types";
import { Container } from "../..";
import { clerkClient } from "@clerk/nextjs/server";
import { defaultDailyIntrosLimit, numTokensPerMonth } from "@intros/types";
import { User } from "@prisma/client";
import { addHours, addMonths, startOfDay, startOfToday } from "date-fns";
import slugify from "slugify";

export class ClerkModule {
  constructor(private cnt: Container) {}

  apiClient = clerkClient();

  private upsertUser = async (
    payload: WebhookPayload<"user.created" | "user.updated">
  ) => {
    const phoneNumber = payload.data.phone_numbers[0];
    const emailAddress = payload.data.email_addresses[0];
    const clerkId = payload.data.id;
    const timeZone = payload.data.unsafe_metadata.timeZone;

    const profileName = [
      payload.data.first_name,
      payload.data.last_name[0].toUpperCase(), // no . yet because of slug
    ].join(" ");

    // create a unique slug for the profile
    let slug = slugify(profileName, { lower: true });
    const numExistingSlugs = await this.cnt.prisma.profile.count({
      where: { slug: { startsWith: slug } },
    });
    if (numExistingSlugs > 0) slug = `${slug}${numExistingSlugs}`;

    const email = emailAddress.email_address;
    const data = { email, phone: phoneNumber?.phone_number };

    const now = new Date();

    // create or update the database user
    const prismaUser = await this.cnt.prisma.user.upsert({
      where: { clerkId },
      create: {
        ...data,
        clerkId,
        nextTokenReset: addMonths(now, 1),
        // create the monthly tokens for new users
        tokens: {
          createMany: {
            data: [...new Array(numTokensPerMonth)].map(() => ({})),
          },
        },
        profile: {
          create: {
            name: profileName,
            slug: `${slug}.`, // add the . to the end
          },
        },
        settings: {
          create: {
            dailyIntrosLimit: defaultDailyIntrosLimit,
            timeZone,
            dailyIntrosResetTime: addHours(startOfDay(now), 5), // 5 am default
            sendEmailsTime: addHours(startOfDay(now), 12), // 12 pm default
          },
        },
      },
      update: data,
    });

    await this.syncWithClerk({
      prismaUser,
      clerkUser: {
        // convert the payload data to the clerk user
        id: clerkId,
        externalId: payload.data.external_id,
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
      if (numAvailableTokens !== clerkUser.publicMetadata.numAvailableTokens) {
        publicMetadata.numAvailableTokens = numAvailableTokens;
      }

      // check for user creation
      if (!clerkUser.publicMetadata.creationIsComplete)
        publicMetadata.creationIsComplete = true;

      // check for admin privilege
      if (clerkUser.publicMetadata.isAdmin !== prismaUser.isAdmin)
        publicMetadata.isAdmin = prismaUser.isAdmin;

      // check for suspension
      const suspendedUntil = prismaUser.suspendedUntil?.toISOString();
      if (clerkUser.publicMetadata.suspendedUntil !== suspendedUntil)
        publicMetadata.suspendedUntil = suspendedUntil;

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
      return await this.cnt.clerk.apiClient.users.updateUser(
        clerkUser.id,
        args
      );
    })();

    return await Promise.all([metaDataPromise, updateUserPromise]);
  }
}
