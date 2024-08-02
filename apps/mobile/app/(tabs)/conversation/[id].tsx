import { Button, Text, View } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { introsFetch } from "@/lib/intros-fetch";
import { Data } from "@intros/types";
import Message from "@/components/Message";

type RouteData = Data<"/api/profiles/[id]">;

export default function Profile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [conversation, setConversation] = useState<
    RouteData["conversation"] | null
  >();
  const [messages, setMessages] = useState<
    Data<"/api/conversations/[id]">["messages"] | null
  >();

  const fetchConversation = async () => {
    const { conversation, messages } = await introsFetch(
      `/api/conversations/[id]`,
      {
        params: { id },
      }
    );

    setConversation(conversation);
    setMessages(messages);
  };

  useEffect(() => {
    fetchConversation();
  }, [id]);

  const handleMessageButtonPress = async () => {};

  return (
    <View>
      <Text>Convo</Text>
      {messages && messages.map((m) => <Message key={m.id} message={m} />)}
    </View>
  );
}
