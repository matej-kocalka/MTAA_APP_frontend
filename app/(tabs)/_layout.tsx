import { Tabs } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Tabs
    screenOptions={{
    }}>
      <Tabs.Screen
        name="workoutList"
        options={{
            title: 'Workouts'
        }}
      />
      <Tabs.Screen
        name="friendsList"
        options={{
            title: 'Friends'
        }}
      />
      <Tabs.Screen
        name="workoutProgress"
        options={{
            title: 'Excercise'
        }}
      />
    </Tabs>
  );
}
