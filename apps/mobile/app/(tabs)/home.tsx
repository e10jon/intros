import { introsFetch } from "@/lib/intros-fetch";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { Data } from "@intros/types";

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [users, setUsers] = useState<Data<"/api">["users"] | null>(null);

  useEffect(() => {
    introsFetch("/api").then((data) => {
      setUsers(data.users);
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

      {users && <Text>Users: {JSON.stringify(users)}</Text>}
    </View>
  );
}
