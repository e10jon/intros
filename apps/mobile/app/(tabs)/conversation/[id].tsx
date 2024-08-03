import { Button, Text, TextInput, View } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { introsFetch } from "@/lib/intros-fetch";
import { Data } from "@intros/types";
import Message from "@/components/Message";

type RouteData = Data<"/api/profiles/[id]">;

export default function Conversation() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [newBody, setNewBody] = useState("");
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

  const handleSendMessagePress = async () => {
    const { message } = await introsFetch(`/api/conversations/[id]/message`, {
      method: "POST",
      body: { body: newBody },
      params: { id },
    });

    setNewBody("");
    setMessages((prev) => (prev ? [...prev, message] : [message]));
  };

  return (
    <View>
      <Text>Convo</Text>
      {messages && messages.map((m) => <Message key={m.id} message={m} />)}
      <TextInput value={newBody} onChangeText={setNewBody} />
      <Button title="Send" onPress={handleSendMessagePress} />
    </View>
  );
}
