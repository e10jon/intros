import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { introsFetch } from "@/lib/intros-fetch";
import { Data } from "@intros/shared";
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

  const scrollView = useRef<ScrollView>(null);

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

  const handleMutePress = async () => {
    Alert.alert("", "Are you sure you want to mute this conversation?", [
      {
        text: "Yes",
        onPress: async () => {
          const { message } = await introsFetch(
            `/api/conversations/[id]/mute`,
            {
              method: "POST",
              body: {},
              params: { id },
            }
          );

          setIsSending(false);
          setNewBody("");
          setMessages((prev) => (prev ? [...prev, message] : [message]));
        },
        style: "destructive",
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const handleReportPress = async () => {
    Alert.prompt(
      "",
      "If you want to report this conversation, please tell us why:",
      [
        {
          text: "Report",
          onPress: async (reason) => {
            if (!reason) return;

            const { message } = await introsFetch(
              `/api/conversations/[id]/report`,
              {
                method: "POST",
                body: { reason },
                params: { id },
              }
            );

            setIsSending(false);
            setNewBody("");
            setMessages((prev) => (prev ? [...prev, message] : [message]));
          },
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text>{profiles?.map((p) => p.name).join(" + ")}</Text>
      </View>

      <ScrollView
        ref={scrollView}
        style={styles.messagesContainer}
        onContentSizeChange={() => {
          scrollView.current?.scrollToEnd({ animated: false });
        }}
      >
        {messages && messages.map((m) => <Message key={m.id} message={m} />)}
      </ScrollView>

      <View style={styles.bodyInputContainer}>
        <TextInput
          style={styles.bodyInput}
          value={newBody}
          onChangeText={setNewBody}
          onSubmitEditing={handleSendMessagePress}
        />
        <Button title="Send" onPress={handleSendMessagePress} />
        <Button title="Mute" onPress={handleMutePress} />
        <Button title="Report" onPress={handleReportPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: "100%",
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
