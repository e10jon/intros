import { StyleSheet, Text, View } from "react-native";
import { useUser } from "@clerk/clerk-expo";

export default function Home() {
  const { user } = useUser();
  console.log({ user });

  return (
    <View style={styles.container}>
      <Text>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
