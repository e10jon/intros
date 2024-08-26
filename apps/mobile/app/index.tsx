import { StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";
import { introsFetch } from "@intros/shared";

export default function Home() {
  useEffect(() => {
    introsFetch("/ GET", {}).then((res) => {
      console.log(res);
    });
  }, []);

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
