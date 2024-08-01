import { introsFetch, urlScheme } from "@/lib/intros-fetch";
import { useUser } from "@clerk/clerk-expo";
import { useStripe } from "@stripe/stripe-react-native";
import { View, Text, Button, Alert } from "react-native";

export default function Payment() {
  const { user, isLoaded } = useUser();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const initializePaymentSheet = async () => {
    const subscription = await introsFetch("/api/payment/subscription", {
      method: "POST",
    });

    const clientSecret =
      subscription.latest_invoice.payment_intent?.client_secret;
    if (!clientSecret) throw new Error("Can't find client secret");

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Intros",
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
