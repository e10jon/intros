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
            <TabBarIcon name={focused ? "add" : "add-outline"} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="sign-in"
        options={{
          title: "Sign In",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "log-in" : "log-in-outline"}
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

      <Tabs.Screen
        name="payment"
        options={{
          title: "Payment",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "card" : "card-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="edit-profile"
        options={{
          title: "Edit Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person-circle" : "person-circle-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "file-tray" : "file-tray-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="sign-up-after"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="profile/[id]"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="conversation/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
