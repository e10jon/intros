import { getEnvCred } from "@/get-env-cred";
import { StripeProvider as LibraryStripeProvider } from "@stripe/stripe-react-native";
import { PropsWithChildren } from "react";

const stripePublishableKey = getEnvCred("stripePublishableKey");

export default function StripeProvider(props: PropsWithChildren) {
  return (
    <LibraryStripeProvider publishableKey={stripePublishableKey}>
      <>{props.children}</>
    </LibraryStripeProvider>
  );
}
