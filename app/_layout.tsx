import { Colors } from "@/constants/colors";
import { AuthProvider } from "@/context/AuthContext";
import { FriendsProvider } from "@/context/FriendsContext";
import { WorkoutProvider } from "@/context/WorkoutContext";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform, StatusBar, useColorScheme } from "react-native";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    const requestPermissions = async () => {
      if (Device.isDevice) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission for notifications not granted!');
        }
      } else {
        alert('Must use physical device for notifications');
      }
    };

    requestPermissions();
  }, []);

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
      <FriendsProvider>
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
      </FriendsProvider>
    </AuthProvider>
  );
}
