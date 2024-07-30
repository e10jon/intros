import {
  ClerkProvider,
  ClerkLoaded,
  getClerkInstance,
} from "@clerk/clerk-expo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { getEnvCred } from "@/get-env-cred";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const expoPublicClerkPublishableKey = getEnvCred(
  "expoPublicClerkPublishableKey"
);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (!loaded) return;
    SplashScreen.hideAsync();
  }, [loaded]);

  const getAuthTokenFromClerk = async () => {
    const clerk = getClerkInstance();
    const token = await clerk.session?.getToken();
    return token;
    // can use this token to pass to backend like:
    // fetch('http://example.com/', { headers: { Authorization: token })
  };

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ClerkProvider publishableKey={expoPublicClerkPublishableKey}>
        <ClerkLoaded>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ClerkLoaded>
      </ClerkProvider>
    </ThemeProvider>
  );
}
