import RNFS from 'react-native-fs';
import React, { useContext, useEffect, useState } from "react";
import { Image, View, StyleSheet, useColorScheme, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native";
import { AuthContext } from "@/context/AuthContext";
import ThemedContainer from "@/components/ThemedContainer";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { downloadProfilePicture, getProfilePicturePath } from "@/services/UserManagmentService";
import NetInfo from '@react-native-community/netinfo';
import useAuth from '@/hooks/useAuth';
import AuthService from '@/services/AuthService';

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
    },
      modalView: {
          margin: 20,
          padding: 20,
          width: "auto",
          height: "auto",
          borderRadius: 10,
          alignItems: "center",
          elevation: 5
      },
      modalBackground: {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
      },
      modalContainer: {
          margin: 20,
          backgroundColor: theme.backgroundColor,
          borderRadius: 10,
          padding: 20
      },
      modalButton: {
          backgroundColor: theme.secondaryAccent,
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderRadius: 5,
          marginTop: 10
      },
      title: {
          fontSize: 20,
          marginBottom: 10,
          fontWeight: 'bold',
          color: theme.textColor,
      },
      input: {
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
          color: theme.textColor,
          backgroundColor: theme.tabsBackground,
      },
      buttonRow: {
          flexDirection: 'row',
          justifyContent: 'space-between'
      },
      buttonText: {
          color: theme.buttonTextColor,
          fontWeight: 'bold',
          textAlign: "center",
          flexGrow: 1
      },

      topBarButton: {
          backgroundColor: theme.secondaryAccent,
          padding: 5,
          borderRadius: 5,
          marginRight: 15,
      }
  });

  const defaultImage = require("@/assets/images/profile.png");
  const [localImageUri, setLocalImageUri] = useState("");

  // NetInfo.fetch().then(state => {
  //   const isOnline = state.isConnected && state.isInternetReachable;
  //   console.error('Is device online?', isOnline);
  // });

  const handleUsernameChange = async () => {
    var response = await AuthService.changeUsername(auth.getToken(), newUsername.trim());
    if(response.status == 200){
      auth!.user!.username = newUsername.trim();
      setUsername(newUsername.trim());
    }  else {
      alert("Failed to change username");
    }
  }
  const handlePasswordChange = async () => {
    var response = await AuthService.changePassword(auth.getToken(), newPassword.trim());
    if(response.status == 200){
    } else {
      alert("Failed to change password");
    }
  }

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
     setUsername(auth!.user!.username);
  }, []);
  
    const [username, setUsername] = useState("");
    const [visibleUsername, setVisibleUsername] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
  return (
    <ScrollView style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}>
      <ThemedContainer style={{ alignItems: "center" }}>
        <Image source={localImageUri ? { uri: localImageUri } : defaultImage} style={styles.image} />
        <ThemedText style={styles.username}>{username}</ThemedText>
        <ThemedText style={styles.email}>{auth?.user?.email}</ThemedText>
      </ThemedContainer>
      <ThemedContainer style={{ padding: 0 }}>
        <TouchableOpacity style={styles.changeButtons} onPress={ () => {setVisibleUsername(true)}}><Ionicons name="person-outline" size={25} color={theme.accentColor} /><ThemedText style={{ marginLeft: 15, fontSize: 16 }}>Change username</ThemedText></TouchableOpacity>
        <TouchableOpacity style={styles.changeButtons} onPress={ () => {setVisiblePassword(true)}}><Ionicons name="lock-closed-outline" size={25} color={theme.accentColor} /><ThemedText style={{ marginLeft: 15, fontSize: 16 }}>Change password</ThemedText></TouchableOpacity>
        <TouchableOpacity style={styles.changeButtons}><Ionicons name="image-outline" size={25} color={theme.accentColor} /><ThemedText style={{ marginLeft: 15, fontSize: 16 }}>Change image</ThemedText></TouchableOpacity>
        <TouchableOpacity style={styles.changeButtons} onPress={handleLogout}><Ionicons name="log-out-outline" size={25} color={theme.accentColor} /><ThemedText style={{ marginLeft: 15, fontSize: 16 }}>Log out</ThemedText></TouchableOpacity>
        <TouchableOpacity style={[styles.changeButtons, { borderBottomWidth: 0 }]} onPress={clearStorage}><Ionicons name="trash-outline" size={25} color={theme.deleteButton} /><ThemedText style={{ marginLeft: 15, fontSize: 16, color: theme.deleteButton }}>Delete profile</ThemedText></TouchableOpacity>
      </ThemedContainer>
      <Modal
          visible={visibleUsername}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setVisibleUsername(false)}
      >
          <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                  <ThemedText style={styles.title}>Change Username</ThemedText>
                  <TextInput
                      placeholder="New username"
                      value={newUsername}
                      onChangeText={setNewUsername}
                      style={styles.input}
                  />
                  <View style={styles.buttonRow}>
                      <TouchableOpacity
                          style={[styles.modalButton, { backgroundColor: 'gray' }]}
                          onPress={() => setVisibleUsername(false)}
                      >
                          <ThemedText style={styles.buttonText}>Cancel</ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.modalButton} onPress={() => { if (newUsername.trim() === '') { alert("Username cannot be empty!") } else { handleUsernameChange(); setVisibleUsername(false); } }}>
                          <ThemedText style={styles.buttonText}>Send request</ThemedText>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      </Modal>
      <Modal
          visible={visiblePassword}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setVisiblePassword(false)}
      >
          <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                  <ThemedText style={styles.title}>Change password</ThemedText>
                  <TextInput
                      placeholder="New password"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      style={styles.input}
                      secureTextEntry 
                  />
                  <View style={styles.buttonRow}>
                      <TouchableOpacity
                          style={[styles.modalButton, { backgroundColor: 'gray' }]}
                          onPress={() => setVisiblePassword(false)}
                      >
                          <ThemedText style={styles.buttonText}>Cancel</ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.modalButton} onPress={() => { if (newPassword.trim() === '') { alert("Password cannot be empty!") } else { handlePasswordChange(); setVisiblePassword(false); } }}>
                          <ThemedText style={styles.buttonText}>Send request</ThemedText>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      </Modal>
    </ScrollView>
  );
}
