import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { introsFetch } from "@/lib/intros-fetch";
import { Data } from "@intros/types";
import Message from "@/components/Message";

type RouteData = Data<"/api/conversations/[id]">;

export default function Conversation() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [newBody, setNewBody] = useState("");
  const [profiles, setProfiles] = useState<RouteData["profiles"] | null>();
  const [conversation, setConversation] = useState<
    RouteData["conversation"] | null
  >();
  const [messages, setMessages] = useState<
    Data<"/api/conversations/[id]">["messages"] | null
  >();
  const [isSending, setIsSending] = useState(false);

  const fetchConversation = async () => {
    setConversation(null);
    setMessages(null);
    setProfiles(null);

    const { conversation, messages, profiles } = await introsFetch(
      `/api/conversations/[id]`,
      {
        params: { id },
      }
    );

    setConversation(conversation);
    setMessages(messages);
    setProfiles(profiles);
  };

  useEffect(() => {
    fetchConversation();
  }, [id]);

  const handleSendMessagePress = async () => {
    if (!newBody || isSending) return;

    setIsSending(true);
    const { message } = await introsFetch(`/api/conversations/[id]/message`, {
      method: "POST",
      body: { body: newBody },
      params: { id },
    });

    setIsSending(false);
    setNewBody("");
    setMessages((prev) => (prev ? [...prev, message] : [message]));
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text>{profiles?.map((p) => p.name).join(" + ")}</Text>
      </View>

      <ScrollView styles={styles.messagesContainer}>
        {messages && messages.map((m) => <Message key={m.id} message={m} />)}
      </ScrollView>

      <View style={styles.bodyInputContainer}>
        <TextInput
          style={styles.bodyInput}
          value={newBody}
          onChangeText={setNewBody}
        />
        <Button title="Send" onPress={handleSendMessagePress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
  },
  header: {
    alignItems: "center",
  },
  messagesContainer: {
    flexGrow: 1,
  },
  bodyInput: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    textAlign: "right",
    flexGrow: 1,
  },
  bodyInputContainer: {
    backgroundColor: "white",
    flexDirection: "row",
  },
});
