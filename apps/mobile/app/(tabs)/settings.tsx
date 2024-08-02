import { SignedIn, SignedOut, useSignIn, useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, Button, View } from "react-native";
import { useState, useCallback } from "react";

export default function Settings() {
  const { user } = useUser();

  return (
    <View>
      <SignedIn>
        <Text>You are already signed in.</Text>
      </SignedIn>

      <SignedOut>
        <Text>You are not signed in.</Text>
      </SignedOut>
    </View>
  );
}
