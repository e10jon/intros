import { Stack } from "expo-router/stack";
import { StytchProvider, StytchClient } from "@stytch/react-native";
import { getEnvCred } from "../lib/get-env-cred";

export default function Layout() {
  const stytch = new StytchClient(getEnvCred("stychPublicToken"));

  return (
    <StytchProvider stytch={stytch}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" />
      </Stack>
    </StytchProvider>
  );
}
