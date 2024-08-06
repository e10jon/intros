import { introsFetch } from "@/lib/intros-fetch";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import {
  Button,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Data } from "@intros/shared";
import { Link } from "expo-router";

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [profiles, setProfiles] = useState<
    Data<"/api/profiles">["profiles"] | null
  >(null);
  const [refreshing, setRefreshing] = useState(true);

  const handleRefresh = () => {
    setRefreshing(true);
  };

  useEffect(() => {
    if (!refreshing) return;
    introsFetch("/api/profiles").then((data) => {
      setProfiles(data.profiles);
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

      {profiles && (
        <View>
          <Text>Profiles</Text>
          {profiles.map((profile) => (
            <View key={profile.id}>
              <Link href={`/profile/${profile.id}`} asChild>
                <Pressable>
                  <Text>{profile.name}</Text>
                  <Text>{profile.title}</Text>
                </Pressable>
              </Link>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
