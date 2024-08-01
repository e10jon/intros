import { introsFetch } from "@/lib/intros-fetch";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { Button, RefreshControl, ScrollView, Text } from "react-native";
import { Data } from "@intros/types";

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [users, setUsers] = useState<Data<"/api">["users"] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
  };

  useEffect(() => {
    if (!refreshing) return;
    introsFetch("/api").then((data) => {
      setUsers(data.users);
      setRefreshing(false);
    });
  }, [refreshing]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
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
    </ScrollView>
  );
}
