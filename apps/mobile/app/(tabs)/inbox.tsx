import { introsFetch } from "@/lib/intros-fetch";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Data } from "@intros/types";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

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
    <View>
      <SignedIn>
        <Text>Inbox</Text>
        <Text>Num tokens available: {numTokensAvailable}</Text>

        {conversations?.map((conversation) => (
          <View key={conversation.id}>
            <Text>From: {conversation.userFrom?.profile?.name}</Text>
            <Text>To: {conversation.userTo?.profile?.name}</Text>
          </View>
        ))}
      </SignedIn>

      <SignedOut>
        <Text>Must sign in for inbox</Text>
      </SignedOut>
    </View>
  );
}
