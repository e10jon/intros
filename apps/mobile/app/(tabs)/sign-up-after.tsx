import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";

export default function SignUpAfter() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    if (!user.publicMetadata.creationIsComplete) {
      user.reload();
      return;
    }

    router.replace("/");
  }, [user]);

  return <Text>Please wait...</Text>;
}
