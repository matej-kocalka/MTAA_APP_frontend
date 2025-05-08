import { router } from "expo-router";
import React, { useContext } from "react";
import { Image, View, StyleSheet, useColorScheme, ScrollView } from "react-native";
import { AuthContext } from "@/context/AuthContext";
import ThemedContainer from "@/components/ThemedContainer";
import ThemedButton from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/colors";

export default function RootLayout() {
  const auth = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const theme = colorScheme ? Colors[colorScheme] : Colors.light;

  const handleLogout = async () => {
    try {
      await auth?.logout();
      router.push("../../")
    } catch (e) {
      console.log(e)
      // Alert.alert('Login failed', 'Invalid credentials');
    }
  };

  const styles = StyleSheet.create({
    image: {
      backgroundColor: "white",
      borderRadius: 75,
      width: 150,
      height: 150,
      marginTop: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.3,
      shadowRadius: 1,
      elevation: 2,
    },

    username: {
      marginTop: 30,
      marginBottom: 5,
      fontSize: 40,
      fontWeight: "normal",
    },

    email: {
      marginBottom: 20,
      fontSize: 15,
      fontWeight: "normal",
    }
  });

  return (
    <ScrollView style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}>
      <ThemedContainer style={{ alignItems: "center" }}>
        <Image source={require("@/assets/images/adaptive-icon.png")} style={styles.image} />
        <ThemedText style={styles.username}>{auth?.user?.username}</ThemedText>
        <ThemedText style={styles.email}>{auth?.user?.email}</ThemedText>
      </ThemedContainer>
      <ThemedButton >Change username</ThemedButton>
      <ThemedButton >Change password</ThemedButton>
      <ThemedButton >Change image</ThemedButton>
      <ThemedButton onPress={handleLogout}>Log out</ThemedButton>

      <ThemedButton style={{marginTop:30, backgroundColor: theme.deleteButton}}onPress={handleLogout}>Delete profile</ThemedButton>
    </ScrollView>
  );
}
