import { introsFetch } from "@/lib/intros-fetch";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Data } from "@intros/shared";
import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

export default function Inbox() {
  const { user } = useUser();
  const [numTokensAvailable, setNumTokensAvailable] = useState<number | null>();
  const [conversations, setConversations] = useState<
    Data<"/api/conversations">["conversations"] | null
  >(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConversations = async () => {
    if (!user) return;
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
  }, [user]);

  const handleRefresh = fetchConversations;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <SignedIn>
        <View style={{ marginBottom: 10 }}>
          <Text>Inbox</Text>
          <Text>Num tokens available: {numTokensAvailable}</Text>
        </View>

        {conversations?.map((conversation) => {
          const notification = conversation.notifications[0];
          return (
            <View key={conversation.id} style={{ marginBottom: 10 }}>
              <Link href={`/conversation/${conversation.id}`}>Link</Link>
              <Text>From: {conversation.userFrom?.profile?.name}</Text>
              <Text>To: {conversation.userTo?.profile?.name}</Text>
              <Text>
                Unread: {notification?.numUnreadMessages}, Seen?{" "}
                {notification?.seenAt ? "Y" : "N"}, Muted?{" "}
                {conversation.mutedAt ? "Y" : "N"}, Reported?{" "}
                {conversation.reportedAt ? "Y" : "N"}
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
