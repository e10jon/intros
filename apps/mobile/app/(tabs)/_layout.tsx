import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="gear" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="data"
        options={{
          title: "Data",
          headerLeft: () => <Text>Left</Text>,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="database" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="routines"
        options={{
          title: "Routines",
          headerLeft: () => <Text>Left</Text>,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="pencil-square" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          headerLeft: () => <Text>Left</Text>,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="calendar" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="inbox" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
