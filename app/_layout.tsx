import { Colors } from "@/constants/colors";
import { AuthProvider } from "@/context/AuthContext";
import { WorkoutProvider } from "@/context/WorkoutContext";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform, StatusBar, useColorScheme } from "react-native";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setTranslucent(false);
      StatusBar.setBackgroundColor("transparent");
    }
  }, []);

  const colorScheme = useColorScheme();
  const theme = colorScheme ? Colors[colorScheme] : Colors.light;

  return (
    <AuthProvider>
      <WorkoutProvider>
        <Stack screenOptions={{
          headerStyle: {
            backgroundColor: theme.tabsBackground,
          },
          headerTintColor: theme.headerColor,
        }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </WorkoutProvider>
    </AuthProvider>
  );
}
