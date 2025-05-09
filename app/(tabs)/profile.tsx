import { router } from "expo-router";
import React, { useContext } from "react";
import { Image, View, StyleSheet, useColorScheme, ScrollView, TouchableOpacity } from "react-native";
import { AuthContext } from "@/context/AuthContext";
import ThemedContainer from "@/components/ThemedContainer";
import ThemedButton from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  const auth = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const theme = colorScheme ? Colors[colorScheme] : Colors.light;

  const handleLogout = async () => {
    try {
      await auth?.logout();
      // router.replace("/login")
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
    },

    changeButtons:{
      flexDirection:"row",
      alignItems:"center",
      borderBottomColor:theme.backgroundColor,
      borderBottomWidth:1,
      padding: 15,
    }
  });

  return (
    <ScrollView style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}>
      <ThemedContainer style={{ alignItems: "center" }}>
        <Image source={require("@/assets/images/adaptive-icon.png")} style={styles.image} />
        <ThemedText style={styles.username}>{auth?.user?.username}</ThemedText>
        <ThemedText style={styles.email}>{auth?.user?.email}</ThemedText>
      </ThemedContainer>
      <ThemedContainer style={{padding:0}}>
        <TouchableOpacity style={styles.changeButtons}><Ionicons name="person-outline" size={25} color={theme.accentColor}/><ThemedText style={{marginLeft: 15, fontSize: 16}}>Change username</ThemedText></TouchableOpacity>
        <TouchableOpacity style={styles.changeButtons}><Ionicons name="lock-closed-outline" size={25} color={theme.accentColor}/><ThemedText style={{marginLeft: 15, fontSize: 16}}>Change password</ThemedText></TouchableOpacity>
        <TouchableOpacity style={styles.changeButtons}><Ionicons name="image-outline" size={25} color={theme.accentColor}/><ThemedText style={{marginLeft: 15, fontSize: 16}}>Change image</ThemedText></TouchableOpacity>
        <TouchableOpacity style={styles.changeButtons} onPress={handleLogout}><Ionicons name="log-out-outline" size={25} color={theme.accentColor}/><ThemedText style={{marginLeft: 15, fontSize: 16}}>Log out</ThemedText></TouchableOpacity>
        <TouchableOpacity style={[styles.changeButtons, {borderBottomWidth: 0}]}><Ionicons name="trash-outline" size={25} color={theme.accentColor}/><ThemedText style={{marginLeft: 15, fontSize: 16}}>Delete profile</ThemedText></TouchableOpacity>
      </ThemedContainer>
      
    </ScrollView>
  );
}
