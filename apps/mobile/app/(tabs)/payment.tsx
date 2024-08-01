import { introsFetch, urlScheme } from "@/lib/intros-fetch";
import { useUser } from "@clerk/clerk-expo";
import { useStripe } from "@stripe/stripe-react-native";
import { View, Text, Button, Alert } from "react-native";

export default function Payment() {
  const { user, isLoaded } = useUser();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const initializePaymentSheet = async () => {
    const { clientSecret, ephemeralKeySecret, stripeCustomerId } =
      await introsFetch("/api/payment-intent", { method: "POST" });

    if (!ephemeralKeySecret || !clientSecret)
      throw new Error("Invalid payment intent");

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Intros",
      customerId: stripeCustomerId,
      customerEphemeralKeySecret: ephemeralKeySecret,
      paymentIntentClientSecret: clientSecret,
      returnURL: `https://google.com`, // TODO: use router keys
    });

    if (error)
      throw new Error(
        `Failed to initialize payment sheet ${JSON.stringify(error)}`
      );
  };

  const openPaymentSheet = async () => {
    await initializePaymentSheet();

    const { error } = await presentPaymentSheet();

    if (error)
      throw new Error(
        `Failed to present payment sheet ${JSON.stringify(error)}`
      );
  };

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
