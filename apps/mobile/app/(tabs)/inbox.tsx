import { introsFetch } from "@/lib/intros-fetch";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Data } from "@intros/types";
import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

export default function Inbox() {
  const [numTokensAvailable, setNumTokensAvailable] = useState<number | null>();
  const [conversations, setConversations] = useState<
    Data<"/api/conversations">["conversations"] | null
  >(null);
  const [refreshing, setRefreshing] = useState(true);

  const fetchConversations = async () => {
    setRefreshing(true);

    const { conversations, numTokensAvailable } = await introsFetch(
      `/api/conversations`
    );

    setRefreshing(false);
    setConversations(conversations);
    setNumTokensAvailable(numTokensAvailable);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleRefresh = fetchConversations;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <SignedIn>
        <Text>Inbox</Text>
        <Text>Num tokens available: {numTokensAvailable}</Text>

        {conversations?.map((conversation) => {
          const notification = conversation.notifications[0];
          return (
            <View key={conversation.id}>
              <Link href={`/conversation/${conversation.id}`}>Link</Link>
              <Text>From: {conversation.userFrom?.profile?.name}</Text>
              <Text>To: {conversation.userTo?.profile?.name}</Text>
              <Text>
                Unread: {notification?.numUnreadMessages}, Seen?{" "}
                {notification?.seenAt ? "Y" : "N"}
              </Text>
            </View>
          );
        })}
      </SignedIn>

      <SignedOut>
        <Text>Must sign in for inbox</Text>
      </SignedOut>
    </ScrollView>
  );
}
