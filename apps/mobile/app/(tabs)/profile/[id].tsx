import { Alert, Button, Text, TextInput, View } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { introsFetch } from "@/lib/intros-fetch";
import { Data } from "@intros/types";
import { useUser } from "@clerk/clerk-expo";

type RouteData = Data<"/api/profiles/[id]">;

export default function Profile() {
  const router = useRouter();
  const { user } = useUser();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [isComposingMessage, setIsComposingMessage] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const [conversation, setConversation] = useState<
    RouteData["conversation"] | null
  >();
  const [profile, setProfile] = useState<RouteData["profile"] | null>(null);

  const fetchProfile = async () => {
    setIsComposingMessage(false);
    setMessageBody("");
    setConversation(null);
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

  const handleStartConversationPress = () => {
    if (!user) return Alert.alert("Please sign in to send a message");

    if (!user.publicMetadata.tokenIsAvailable)
      return Alert.alert("No tokens available");

    setIsComposingMessage(true);
  };

  const handleSendMessagePress = async () => {
    if (!profile) return;

    const { conversation } = await introsFetch("/api/conversation", {
      body: { toUserId: profile.userId, body: messageBody },
      method: "POST",
    });

    setMessageBody("");
    setIsComposingMessage(false);

    router.push(`/conversation/${conversation.id}`);
  };

  return (
    <View>
      <Text>Profile {id}</Text>
      <Text>Name: {profile?.name}</Text>
      <Text>Title: {profile?.title}</Text>
      <Text>Bio: {profile?.bio}</Text>

      {conversation ? (
        <Link href={`/conversation/${conversation.id}`}>Conversation</Link>
      ) : (
        <Button
          title="Start conversation"
          onPress={handleStartConversationPress}
        />
      )}

      {isComposingMessage && (
        <View>
          <Text>Your message</Text>
          <TextInput value={messageBody} onChangeText={setMessageBody} />
          <Button title="Send message" onPress={handleSendMessagePress} />
        </View>
      )}
    </View>
  );
}
