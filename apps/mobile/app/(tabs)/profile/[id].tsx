import { Alert, Button, Text, TextInput, View } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { introsFetch } from "@/lib/intros-fetch";
import { Data } from "@intros/shared";
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
    if (!profile) return;
    if (!user) return Alert.alert("Please sign in to send a message");

    if ((user.publicMetadata.numAvailableTokens ?? 0) === 0)
      return Alert.alert("No tokens available");

    if (profile.numNewIntrosRemaining <= 0)
      return Alert.alert("Profile has no intros available");

    setIsComposingMessage(true);
  };

  const handleSendMessagePress = async () => {
    if (!profile) return;

    const response = await introsFetch("/api/conversation", {
      body: { toUserId: profile.userId, body: messageBody },
      method: "POST",
    });

    if ("errorCode" in response) {
      if (response.errorCode === "ModerationFail") {
        Alert.alert(
          "Failure",
          `Message failed moderation: ${response.moderationCategories.join(
            ", "
          )}`
        );
      } else if (response.errorCode === "NoTokensAvailable") {
        Alert.alert("Failure", "You have no tokens available.");
      } else if (response.errorCode === "NoNewIntrosRemainaing") {
        Alert.alert("Failure", "Recipient has no intros remaining.");
      }
      return;
    }

    // successful request:
    setMessageBody("");
    setIsComposingMessage(false);

    router.push(`/conversation/${response.conversation.id}`);
  };

  return (
    <View>
      <Text>Profile {id}</Text>
      <Text>Name: {profile?.name}</Text>
      <Text>Title: {profile?.title}</Text>
      <Text>Bio: {profile?.bio}</Text>
      <Text>
        Can receive intros:{" "}
        {profile && profile.numNewIntrosRemaining > 0 ? "Y" : "N"}
      </Text>

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
