import WorkoutDataContainer from "@/components/workoutData";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Alert,
  useColorScheme,
} from "react-native";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import ThemedButton from "@/components/ThemedButton";
import { Colors } from "@/constants/colors";
import messaging from "@react-native-firebase/messaging";

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const theme = colorScheme ? Colors[colorScheme] : Colors.light;


  const handleLogin = async () => {
    try {
      await auth?.login(email, password);
      router.push("/(tabs)/workoutList")
    } catch (e) {
      console.log(e)
      Alert.alert('Login failed', 'Invalid credentials');
    }
  };

  const handleRegister = async () => {
    try {
       const result = await auth?.register(email, password);
      if(result) {
        handleLogin();
      }
    } catch (e) {
      console.log(e)
      Alert.alert('Login failed', 'Invalid credentials');
    }
  };

  const styles = StyleSheet.create({
    input: {
      fontSize: 16,
      padding: 10,

    },
    inputContainer: {
      fontSize: 17,
      borderWidth: 0,
      borderColor: '#ccc',
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
      color: theme.textColor,
      backgroundColor: theme.tabsBackground,
      margin: 15,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.3,
      shadowRadius: 1,
      elevation: 2,
    },
    buttonText: {
      fontSize: 16,
    }
  });

  return (
    <View style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 ,justifyContent:"center", alignItems:"center"}}>
      <View style={{paddingBottom:100, width:300}}>
        <TextInput style={styles.inputContainer} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput style={styles.inputContainer} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <ThemedButton onPress={handleLogin}>Login</ThemedButton>
        <ThemedButton onPress={handleRegister}>Register</ThemedButton>
      </View>
    </View>
  );
}
