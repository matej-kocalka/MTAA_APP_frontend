import { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Alert,
  useColorScheme,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import ThemedButton from "@/components/ThemedButton";
import { Colors } from "@/constants/colors";
import messaging from "@react-native-firebase/messaging";
import { isAxiosError } from "axios";

// Handle background notifications
messaging().setBackgroundMessageHandler(
  async (remoteMessage: unknown): Promise<void> => {
    console.log("Message handled in the background!", remoteMessage);
  }
);

export default function Index(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const auth = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const theme = colorScheme ? Colors[colorScheme] : Colors.light;

  // Handles user login
  const handleLogin = async (): Promise<void> => {
    try {
      await auth?.login(email, password);
      router.push("/(tabs)/workoutList");
    } catch (e: unknown) {
      if (isAxiosError(e) && e.response) {
        console.log(e.response.data.message);
        Alert.alert("Login failed", e.response.data.message);
      } else {
        Alert.alert("Login failed", "Network error");
      }
    }
  };

  // Handles user registration
  const handleRegister = async (): Promise<void> => {
    try {
      const result = await auth?.register(email, password);
      if (result) {
        handleLogin();
      }
    } catch (e: unknown) {
      if (isAxiosError(e) && e.response) {
        console.log(e.response.data.message);
        Alert.alert("Registration failed", e.response.data.message);
      } else {
        Alert.alert("Registration failed", "Network error");
      }
    }
  };

  // Styles
  const styles = StyleSheet.create({
    input: {
      fontSize: 16,
      padding: 10,
    } as TextStyle,
    inputContainer: {
      fontSize: 17,
      borderWidth: 0,
      borderColor: "#ccc",
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
      color: theme.textColor,
      backgroundColor: theme.tabsBackground,
      margin: 15,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.3,
      shadowRadius: 1,
      elevation: 2,
    } as TextStyle,
    buttonText: {
      fontSize: 16,
    } as TextStyle,
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async (): Promise<void> => {
      if (await auth?.checkLoggedInUser()) {
        router.push("/(tabs)/workoutList");
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <View
      style={{
        backgroundColor: theme.backgroundColor,
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ paddingBottom: 100, width: 300 }}>
        <TextInput
          style={styles.inputContainer}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.inputContainer}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <ThemedButton onPress={handleLogin}>Login</ThemedButton>
        <ThemedButton onPress={handleRegister}>Register</ThemedButton>
      </View>
    </View>
  );
}
