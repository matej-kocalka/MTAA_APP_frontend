import RNFS from 'react-native-fs';
import React, { useContext, useEffect, useState } from "react";
import { Image, View, StyleSheet, useColorScheme, ScrollView, TouchableOpacity } from "react-native";
import { AuthContext } from "@/context/AuthContext";
import ThemedContainer from "@/components/ThemedContainer";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { downloadProfilePicture, getProfilePicturePath } from "@/services/UserManagmentService";
import NetInfo from '@react-native-community/netinfo';
import useAuth from '@/hooks/useAuth';

export default function RootLayout() {
  const auth = useAuth();
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

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage cleared!");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  const styles = StyleSheet.create({
    image: {
      backgroundColor: theme.tabsBackground,
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

    changeButtons: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomColor: theme.backgroundColor,
      borderBottomWidth: 1,
      padding: 15,
    }
  });

  const defaultImage = require("@/assets/images/profile.png");
  const [localImageUri, setLocalImageUri] = useState("");

  // NetInfo.fetch().then(state => {
  //   const isOnline = state.isConnected && state.isInternetReachable;
  //   console.error('Is device online?', isOnline);
  // });

  useEffect(() => {
    const fetchAndSetImage = async () => {
      const localPath = await downloadProfilePicture(auth?.user?.token, "profile");
      if (localPath) {
        setLocalImageUri(localPath + `?t=${Date.now()}`);
      }
    };

    NetInfo.fetch().then(state => {
      if (state.isConnected && state.isInternetReachable) {
        fetchAndSetImage();
       } //else
        // setLocalImageUri(getProfilePicturePath("profile") + `?t=${Date.now()}`);
        // console.error(getProfilePicturePath("profile") + `?t=${Date.now()}`);
     }
  )
  }, []);

  return (
    <ScrollView style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}>
      <ThemedContainer style={{ alignItems: "center" }}>
        <Image source={localImageUri ? { uri: localImageUri } : defaultImage} style={styles.image} />
        <ThemedText style={styles.username}>{auth?.user?.username}</ThemedText>
        <ThemedText style={styles.email}>{auth?.user?.email}</ThemedText>
      </ThemedContainer>
      <ThemedContainer style={{ padding: 0 }}>
        <TouchableOpacity style={styles.changeButtons}><Ionicons name="person-outline" size={25} color={theme.accentColor} /><ThemedText style={{ marginLeft: 15, fontSize: 16 }}>Change username</ThemedText></TouchableOpacity>
        <TouchableOpacity style={styles.changeButtons}><Ionicons name="lock-closed-outline" size={25} color={theme.accentColor} /><ThemedText style={{ marginLeft: 15, fontSize: 16 }}>Change password</ThemedText></TouchableOpacity>
        <TouchableOpacity style={styles.changeButtons}><Ionicons name="image-outline" size={25} color={theme.accentColor} /><ThemedText style={{ marginLeft: 15, fontSize: 16 }}>Change image</ThemedText></TouchableOpacity>
        <TouchableOpacity style={styles.changeButtons} onPress={handleLogout}><Ionicons name="log-out-outline" size={25} color={theme.accentColor} /><ThemedText style={{ marginLeft: 15, fontSize: 16 }}>Log out</ThemedText></TouchableOpacity>
        <TouchableOpacity style={[styles.changeButtons, { borderBottomWidth: 0 }]} onPress={clearStorage}><Ionicons name="trash-outline" size={25} color={theme.deleteButton} /><ThemedText style={{ marginLeft: 15, fontSize: 16, color: theme.deleteButton }}>Delete profile</ThemedText></TouchableOpacity>
      </ThemedContainer>

    </ScrollView>
  );
}
