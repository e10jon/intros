import { introsFetch } from "@/intros-fetch";
import { useEffect } from "react";
import { View, Text } from "react-native";

export default function Payment() {
  useEffect(() => {
    introsFetch("/api/payment-intent").then((data) => {
      console.log(data);
    });
  }, []);

  return (
    <View>
      <Text>Payment</Text>
    </View>
  );
}
