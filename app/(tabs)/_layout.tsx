import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Button, useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme ? Colors[colorScheme] : Colors.light;
  return (
    <Tabs

      screenOptions={{
        tabBarStyle: {
          borderTopColor:theme.borderColor,
          shadowOpacity:0,
          backgroundColor: theme.tabsBackground, // 👈 Set your desired background color
        },
        tabBarActiveTintColor: theme.accentColor,
        tabBarInactiveTintColor: '#888',

        headerStyle: {
          backgroundColor: theme.tabsBackground, // 👈 Top bar background color
        },
        headerTintColor: theme.headerColor,
      }}>
      <Tabs.Screen
        name="workoutList"
        options={{
          title: 'Workout history',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmarks-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workoutProgress"
        options={{
          title: 'Excercise',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="footsteps-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="friendsList"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
