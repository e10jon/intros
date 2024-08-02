import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { introsFetch } from "@/lib/intros-fetch";
import { Data } from "@intros/types";

export default function Profile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<
    Data<"/api/profiles/[id]">["profile"] | null
  >(null);

  const fetchProfile = async () => {
    const { profile } = await introsFetch(`/api/profiles/[id]`, {
      params: { id },
    });
    setProfile(profile);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <View>
      <Text>Profile {id}</Text>
      <Text>Name: {profile?.name}</Text>
      <Text>Title: {profile?.title}</Text>
      <Text>Bio: {profile?.bio}</Text>
    </View>
  );
}
