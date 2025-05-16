import RNFS from 'react-native-fs';
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Image, View, StyleSheet, useColorScheme, ScrollView, TouchableOpacity, Modal, TextInput, RefreshControl } from "react-native";
import { AuthContext } from "@/context/AuthContext";
import ThemedContainer from "@/components/ThemedContainer";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { downloadProfilePicture, deleteUserProfile, changePhoto } from "@/services/UserManagmentService";
import NetInfo from '@react-native-community/netinfo';
import useAuth from '@/hooks/useAuth';
import AuthService from '@/services/AuthService';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { useFocusEffect, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function RootLayout() {
  const router = useRouter();
  const scheduleNotification = async () => {
    // console.log("1");
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder",
        body: "You have a new friend request!",
      },
      trigger: {
        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10, // Trigger after 5 seconds
        repeats: false, // Set to true if you want it to repeat
      },
    });
    // console.log("2");
  };

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

  const deleteProfile = async () => {
    try {
      await deleteUserProfile(auth.getToken(), password);
      await handleLogout();
    } catch (e) {
      alert("Deletion failed!" + e)
    }
  };

  const styles = StyleSheet.create({
    buttonDisabled: {
      opacity: 0.5
    },

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

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access media library is required!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        const response = await changePhoto(auth.user!.token, image);
      }

      onRefresh();
    } catch (error) {
      console.log(error);
    }
  }

  const handleUsernameChange = async () => {
    var response = await AuthService.changeUsername(auth.getToken()!, newUsername.trim());
    if (response.status == 200) {
      auth!.user!.username = newUsername.trim();
      setUsername(newUsername.trim());
      onRefresh();
    } else {
      alert("Failed to change username");
    }
  }

  const handlePasswordChange = async () => {
    var response = await AuthService.changePassword(auth.getToken()!, newPassword.trim());
    if (response.status == 200) {
    } else {
      alert("Failed to change password");
    }
  }

  const onRefresh = async () => {
    const fetchAndSetImage = async () => {
      const localPath = await downloadProfilePicture(auth?.user?.token, "profile");
      if (localPath) {
        setLocalImageUri(localPath + `?t=${Date.now()}`);
      }
    };

    setRefreshing(true);
    NetInfo.fetch().then(state => {
      if (state.isConnected && state.isInternetReachable) {
        fetchAndSetImage();
        auth.updateUser();
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }
    )
    setUsername(auth!.user!.username);
    setRefreshing(false);
  }

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, [])
  )

  const [username, setUsername] = useState("");
  const [visibleUsername, setVisibleUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isDisabled, setDisabled] = useState(true);

  return (
    <ScrollView style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />
      }>
      <ThemedContainer style={{ alignItems: "center" }}>
        <Image source={localImageUri ? { uri: localImageUri } : defaultImage} style={styles.image} />
        <ThemedText style={styles.username}>{username}</ThemedText>
        <ThemedText style={styles.email}>{auth?.user?.email}</ThemedText>
      </ThemedContainer>
      <ThemedContainer style={{ padding: 0 }}>
        <TouchableOpacity style={[styles.changeButtons, { borderBottomWidth: 0 }]} onPress={() => router.push("../notificationScheduler")}><Ionicons name="alarm-outline" size={25} color={theme.accentColor} /><ThemedText style={{ marginLeft: 15, fontSize: 16 }}>Schedule workout reminder</ThemedText></TouchableOpacity>
      </ThemedContainer>
      <ThemedContainer style={{ padding: 0 }}>
        <TouchableOpacity disabled={isDisabled} style={[styles.changeButtons, isDisabled && styles.buttonDisabled]} onPress={() => { setVisibleUsername(true) }}><Ionicons name="person-outline" size={25} color={theme.accentColor} /><ThemedText style={{ marginLeft: 15, fontSize: 16 }}>Change username</ThemedText></TouchableOpacity>
        <TouchableOpacity disabled={isDisabled} style={[styles.changeButtons, isDisabled && styles.buttonDisabled]} onPress={() => { setVisiblePassword(true) }}><Ionicons name="lock-closed-outline" size={25} color={theme.accentColor} /><ThemedText style={{ marginLeft: 15, fontSize: 16 }}>Change password</ThemedText></TouchableOpacity>
        <TouchableOpacity disabled={isDisabled} style={[styles.changeButtons, isDisabled && styles.buttonDisabled]} onPress={pickImage}><Ionicons name="image-outline" size={25} color={theme.accentColor} /><ThemedText style={{ marginLeft: 15, fontSize: 16 }}>Change image</ThemedText></TouchableOpacity>
        <TouchableOpacity style={styles.changeButtons} onPress={handleLogout}><Ionicons name="log-out-outline" size={25} color={theme.accentColor} /><ThemedText style={{ marginLeft: 15, fontSize: 16 }}>Log out</ThemedText></TouchableOpacity>
        <TouchableOpacity disabled={isDisabled} style={[styles.changeButtons, isDisabled && styles.buttonDisabled, { borderBottomWidth: 0 }]} onPress={() => setVisibleDelete(true)}><Ionicons name="trash-outline" size={25} color={theme.deleteButton} /><ThemedText style={{ marginLeft: 15, fontSize: 16, color: theme.deleteButton }}>Delete profile</ThemedText></TouchableOpacity>
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
      <Modal
        visible={visibleDelete}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisibleDelete(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ThemedText style={styles.title}>Confirm profile deletion !</ThemedText>
            <TextInput
              placeholder="Your password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: 'gray' }]}
                onPress={() => setVisibleDelete(false)}
              >
                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: theme.deleteButton }]} onPress={() => { if (password.trim() === '') { alert("Password cannot be empty!") } else { deleteProfile(); setVisibleDelete(false); } }}>
                <ThemedText style={styles.buttonText}>Confirm</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
