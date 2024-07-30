import { introsFetch } from "@/intros-fetch";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { Button, Text, View } from "react-native";

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();

  useEffect(() => {
    introsFetch("/api").then((data) => {
      console.log(data);
    });
  }, []);

  return (
    <View>
      <Text>You are home</Text>
      <SignedIn>
        <Text>Welcome, {user?.emailAddresses[0].emailAddress}</Text>
        <Button
          title="Sign Out"
          onPress={async () => {
            signOut();
          }}
        />
      </SignedIn>

      <SignedOut>
        <Text>You are not signed in.</Text>
      </SignedOut>
    </View>
  );
}
