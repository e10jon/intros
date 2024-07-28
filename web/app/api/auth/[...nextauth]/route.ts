import NextAuth, { AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { getEnvCred } from "../../../../get-env-cred";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import { prisma } from "../../../../prisma";

export const authOptions: AuthOptions = {
  adapter: <Adapter>PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: "smtp.sendgrid.net",
        port: 465,
        auth: {
          user: "apikey",
          pass: getEnvCred("sendgridApiKey"),
        },
      },
      from: "ethan@ethanjon.net",
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
