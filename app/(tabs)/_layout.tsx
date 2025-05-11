import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useContext } from "react";
import { Button, useColorScheme } from "react-native";
import { Redirect, Stack } from 'expo-router';
import useAuth from "@/hooks/useAuth";
import DeviceInfo from "react-native-device-info";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme ? Colors[colorScheme] : Colors.light;
  const { user } = useAuth();
  const tablet = DeviceInfo.isTablet();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          borderTopColor: theme.borderColor,
          shadowOpacity: 0,
          backgroundColor: theme.tabsBackground, 
        },
        tabBarActiveTintColor: theme.accentColor,
        tabBarInactiveTintColor: '#888',

        headerStyle: {
          backgroundColor: theme.tabsBackground,
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
        {tablet ? 
            <Tabs.Screen
            name="workoutProgress"
            options={{
              title: 'Excercise',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="footsteps-outline" size={size} color={color} />
              ),
              href: null,
            }}
            />
        :
          <Tabs.Screen
          name="workoutProgress"
          options={{
            title: 'Excercise',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="footsteps-outline" size={size} color={color} />
            ),
          }}
          />
        }
      
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
