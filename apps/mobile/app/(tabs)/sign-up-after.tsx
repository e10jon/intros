import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";

export default function SignUpAfter() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!user) return;

      if (!user.publicMetadata.creationIsComplete) {
        user.reload();
        return;
      }

      router.replace("/");
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <Text>Please wait...</Text>;
}
