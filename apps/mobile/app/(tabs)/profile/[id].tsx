import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { introsFetch } from "@/lib/intros-fetch";

export default function Profile() {
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    introsFetch(`/api/profiles/[id]`, { params: { id } }).then((data) => {
      console.log(data);
    });
  }, []);

  return (
    <View>
      <Text>Profile {id}</Text>
    </View>
  );
}
