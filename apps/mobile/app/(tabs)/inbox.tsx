import { introsFetch } from "@/lib/intros-fetch";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Data } from "@intros/types";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function Inbox() {
  const [numTokensAvailable, setNumTokensAvailable] = useState<number | null>();
  const [conversations, setConversations] = useState<
    Data<"/api/conversations">["conversations"] | null
  >(null);

  const fetchConversations = async () => {
    const { conversations, numTokensAvailable } = await introsFetch(
      `/api/conversations`
    );
    setConversations(conversations);
    setNumTokensAvailable(numTokensAvailable);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <ScrollView>
      <SignedIn>
        <Text>Inbox</Text>
        <Text>Num tokens available: {numTokensAvailable}</Text>

        {conversations?.map((conversation) => (
          <View key={conversation.id}>
            <Link href={`/conversation/${conversation.id}`}>Link</Link>
            <Text>From: {conversation.userFrom?.profile?.name}</Text>
            <Text>To: {conversation.userTo?.profile?.name}</Text>
          </View>
        ))}
      </SignedIn>

      <SignedOut>
        <Text>Must sign in for inbox</Text>
      </SignedOut>
    </ScrollView>
  );
}
