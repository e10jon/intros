import { introsFetch } from "@/intros-fetch";
import { useUser } from "@clerk/clerk-expo";
import { useStripe } from "@stripe/stripe-react-native";
import { useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";

export default function Payment() {
  const { user, isLoaded } = useUser();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const initializePaymentSheet = async () => {
    const { clientSecret, ephemeralKeySecret, stripeCustomerId } =
      await introsFetch("/api/payment-intent");

    if (!ephemeralKeySecret || !clientSecret)
      throw new Error("Invalid payment intent");

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Intros",
      customerId: stripeCustomerId,
      customerEphemeralKeySecret: ephemeralKeySecret,
      paymentIntentClientSecret: clientSecret,
    });

    if (!error) throw new Error("Failed to initialize payment sheet");
  };

  const openPaymentSheet = async () => {
    await initializePaymentSheet();
    const { error } = await presentPaymentSheet();
    console.log(error);
  };

  useEffect(() => {
    initializePaymentSheet();
  }, [isLoaded]);

  return (
    <View>
      {!isLoaded || !user ? (
        <Text>Need to log in</Text>
      ) : (
        <Button onPress={openPaymentSheet} title="Payment" />
      )}
    </View>
  );
}
