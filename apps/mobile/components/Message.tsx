import { Data } from "@intros/types";
import { Text, View } from "react-native";

export default function Message({
  message,
}: {
  message: Data<"/api/conversations/[id]">["messages"][number];
}) {
  return (
    <View>
      <Text>{message.body}</Text>
    </View>
  );
}
