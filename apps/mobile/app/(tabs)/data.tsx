import { Link } from "expo-router";
import { Text } from "react-native";

export default function Data() {
  return (
    <Text>
      Data
      <Link href={"/onboarding"}>Onboarding</Link>
    </Text>
  );
}
