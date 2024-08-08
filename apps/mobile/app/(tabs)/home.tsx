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
import LocationPicker from "@/components/LocationPicker";

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [profiles, setProfiles] = useState<
    Data<"/api/profiles">["profiles"] | null
  >(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchInterests, setSearchInterests] = useState("");
  const [searchCountryName, setSearchCountryName] = useState("");
  const [searchProvinceName, setSearchProvinceName] = useState("");
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProfiles();
    setRefreshing(false);
  };

  const fetchProfiles = async () => {
    const { profiles } = await introsFetch(`/api/profiles`, {
      query: {
        name: searchName,
        interests: searchInterests,
        country: searchCountryName,
        province: searchProvinceName,
      },
    });
    setProfiles(profiles);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleSearchNameChange = (text: string) => setSearchName(text);
  const handleSearchInterestsChange = (text: string) =>
    setSearchInterests(text);

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

        <TextInput
          placeholder="Interests"
          value={searchInterests}
          onChangeText={handleSearchInterestsChange}
          onSubmitEditing={handleSearchPress}
        />

        <Text>
          Location: {searchCountryName}, {searchProvinceName}
        </Text>
        <Button
          title="Location"
          onPress={() => setIsLocationPickerOpen(true)}
        />
        {isLocationPickerOpen && (
          <LocationPicker
            selectedCountryName={searchCountryName}
            selectedProvinceName={searchProvinceName}
            onCountryValueChange={(country) =>
              setSearchCountryName(country?.name || "")
            }
            onProvinceValueChange={(province) =>
              setSearchProvinceName(province?.name || "")
            }
            onModalClose={() => setIsLocationPickerOpen(false)}
          />
        )}

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
                  <Text>
                    {profile.country}, {profile.province}
                  </Text>
                  <Text>{profile.title}</Text>
                  <Text>{profile.interests.join(", ")}</Text>
                  <Text>{JSON.stringify(profile.distances)}</Text>
                </Pressable>
              </Link>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
