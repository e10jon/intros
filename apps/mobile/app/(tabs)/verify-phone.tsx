import { useUser } from "@clerk/clerk-expo";
import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { PhoneNumberResource } from "@clerk/types";

export default function VerifyPhone() {
  const { user, isLoaded } = useUser();

  const [phone, setPhone] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [phoneResource, setPhoneResource] = useState<
    PhoneNumberResource | undefined
  >();
  const [successful, setSuccessful] = useState(false);

  const onAddPhonePress = async () => {
    if (!isLoaded || !user) return;

    try {
      const createPhoneResource = await user.createPhoneNumber({
        phoneNumber: phone,
      });

      createPhoneResource.prepareVerification();

      setPhoneResource(createPhoneResource);
      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!phoneResource) return;

    try {
      const phoneVerifyAttempt = await phoneResource.attemptVerification({
        code,
      });
      if (phoneVerifyAttempt?.verification.status === "verified") {
        setSuccessful(true);
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(phoneVerifyAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View>
      {(() => {
        if (!user) return <Text>Need to log in</Text>;
        if (successful) return <Text>Success!</Text>;
        if (user.hasVerifiedPhoneNumber)
          return <Text>Already verified phone.</Text>;

        if (pendingVerification) {
          return (
            <>
              <TextInput
                value={code}
                placeholder="Code..."
                onChangeText={(code) => setCode(code)}
              />
              <Button title="Verify Phone" onPress={onPressVerify} />
            </>
          );
        }

        return (
          <>
            <TextInput
              value={phone}
              placeholder="Phone number..."
              onChangeText={(val) => setPhone(val)}
            />
            <Button title="Submit" onPress={onAddPhonePress} />
          </>
        );
      })()}
    </View>
  );
}
