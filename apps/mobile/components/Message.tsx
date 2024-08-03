import { useUser } from "@clerk/clerk-expo";
import { Data } from "@intros/types";
import { StyleSheet, Text, View } from "react-native";

export default function Message({
  message,
}: {
  message: Data<"/api/conversations/[id]">["messages"][number];
}) {
  const { user } = useUser();

  if (!user) return null;

  return (
    <View
      style={[
        styles.message,
        message.userId === user.externalId
          ? styles.messageFromUser
          : styles.messageToUser,
      ]}
    >
      <Text style={styles.message}>{message.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    padding: 4,
  },
  messageFromUser: {
    alignItems: "flex-end",
    color: "blue",
  },
  messageToUser: {
    alignItems: "flex-start",
  },
});
