import { introsFetch } from "@/lib/intros-fetch";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import {
  Button,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
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
  const [refreshing, setRefreshing] = useState(false);
  const [searchName, setSearchName] = useState("");

  const handleRefresh = () => {
    setRefreshing(true);
  };

  const fetchProfiles = async () => {
    if (refreshing) return;

    setRefreshing(true);
    const { profiles } = await introsFetch(`/api/profiles`, {
      query: { name: searchName },
    });

    setRefreshing(false);
    setProfiles(profiles);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSearchNameChange = (text: string) => {
    setSearchName(text);
  };

  const handleSearchPress = async () => {
    await fetchProfiles();
  };

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

      <View>
        <TextInput
          placeholder="Name"
          value={searchName}
          onChangeText={handleSearchNameChange}
          onSubmitEditing={handleSearchPress}
        />
        <Button title="Search" onPress={handleSearchPress} />
      </View>

      {profiles && (
        <View>
          <Text>Profiles</Text>
          {profiles.map((profile) => (
            <View key={profile.id}>
              <Link href={`/profile/${profile.id}`} asChild>
                <Pressable>
                  <Text>{profile.name}</Text>
                  <Text>{profile.title}</Text>
                  <Text>{profile.interests.join(", ")}</Text>
                </Pressable>
              </Link>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
