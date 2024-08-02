import { Button, Text, View } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { introsFetch } from "@/lib/intros-fetch";
import { Data } from "@intros/types";

type RouteData = Data<"/api/profiles/[id]">;

export default function Profile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [conversation, setConversation] = useState<
    RouteData["conversation"] | null
  >();
  const [profile, setProfile] = useState<RouteData["profile"] | null>(null);

  const fetchProfile = async () => {
    setProfile(null);

    const { profile, conversation } = await introsFetch(`/api/profiles/[id]`, {
      params: { id },
    });

    setProfile(profile);
    setConversation(conversation);
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleMessageButtonPress = async () => {};

  return (
    <View>
      <Text>Profile {id}</Text>
      <Text>Name: {profile?.name}</Text>
      <Text>Title: {profile?.title}</Text>
      <Text>Bio: {profile?.bio}</Text>

      {conversation ? (
        <Link href={`/inbox/${conversation.id}`}>Conversation</Link>
      ) : (
        <Button title="Start conversation" onPress={handleMessageButtonPress} />
      )}
    </View>
  );
}
