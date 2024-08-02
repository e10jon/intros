import StripeProvider from "@/components/StripeProvider";
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
    <StripeProvider>
      {(() => {
        if (!isLoaded) return <Text>Loading...</Text>;
        if (!user) return <Text>Need to log in</Text>;
        if (user.publicMetadata.stripeSubscriptionId)
          return <Text>Already subscribed</Text>;

        return <Button onPress={openPaymentSheet} title="Payment" />;
      })()}
    </StripeProvider>
  );
}
