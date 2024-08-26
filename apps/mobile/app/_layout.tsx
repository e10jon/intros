import { Stack } from "expo-router/stack";
import { ClerkProvider } from "@clerk/clerk-expo";
import { getEnvCred } from "../lib/get-env-cred";
import { tokenCache } from "../lib/token-cache";

export default function Layout() {
  return (
    <ClerkProvider
      publishableKey={getEnvCred("clerkPublishableKey")}
      tokenCache={tokenCache}
    >
      <Stack />
    </ClerkProvider>
  );
}
