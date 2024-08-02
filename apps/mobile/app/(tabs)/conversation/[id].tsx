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

  const fetchConversation = async () => {
    const { conversation } = await introsFetch(`/api/conversations/[id]`, {
      params: { id },
    });

    setConversation(conversation);
  };

  useEffect(() => {
    fetchConversation();
  }, [id]);

  const handleMessageButtonPress = async () => {};

  return (
    <View>
      <Text>Convo</Text>
    </View>
  );
}
