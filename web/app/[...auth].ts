import NextAuth, { AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";

export const authOptions: AuthOptions = {
  providers: [EmailProvider({})],
};

export default NextAuth(authOptions);
