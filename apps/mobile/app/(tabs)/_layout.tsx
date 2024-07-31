import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="sign-up"
        options={{
          title: "Sign Up",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="sign-in"
        options={{
          title: "Sign In",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="verify-phone"
        options={{
          title: "Verify Phone",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "phone-portrait" : "phone-portrait-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
