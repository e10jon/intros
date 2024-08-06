import { useState } from "react";
import { TextInput, Button, View, Text, Alert } from "react-native";
import { SignedIn, SignedOut, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useCalendars } from "expo-localization";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const calendars = useCalendars();

  const [firstName, setFirstname] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    if (!firstName) return Alert.alert("First Name is required");
    if (!lastName) return Alert.alert("Last Name is required");

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
        unsafeMetadata: {
          timeZone: calendars[0].timeZone,
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/sign-up-after");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View>
      <SignedIn>
        <Text>You are already signed in.</Text>
      </SignedIn>

      <SignedOut>
        {!pendingVerification && (
          <>
            <TextInput
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email..."
              onChangeText={(email) => setEmailAddress(email)}
            />

            <TextInput
              value={firstName}
              placeholder="First Name..."
              onChangeText={(name) => setFirstname(name)}
            />

            <TextInput
              value={lastName}
              placeholder="Last Name..."
              onChangeText={(name) => setLastName(name)}
            />

            <TextInput
              value={password}
              placeholder="Password..."
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />

            <Button title="Sign Up" onPress={onSignUpPress} />
          </>
        )}

        {pendingVerification && (
          <>
            <TextInput
              value={code}
              placeholder="Code..."
              onChangeText={(code) => setCode(code)}
            />

            <Button title="Verify Email" onPress={onPressVerify} />
          </>
        )}
      </SignedOut>
    </View>
  );
}
