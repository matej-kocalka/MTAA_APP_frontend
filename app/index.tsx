import WorkoutDataContainer from "@/components/workoutData";
import WoroutData from "@/components/workout";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import WorkoutContainer from "@/components/workout";


export default function Index() {
  const [input, setInput] = useState("");
  return (
    /*<View style={{ flex: 1, paddingTop: 10, flexDirection: "column", alignContent: "center"}}>
      
      <Text style={styles.input}>
        "Password:"
      </Text>
    </View>*/
    <View style={{flex: 1, flexDirection: "column", justifyContent: "center"}}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={input}
            autoCorrect={false}
            onChangeText={setInput}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={input}
            autoCorrect={false}
            onChangeText={setInput}
          />
        </View>
        <View style={{alignItems: "center"}}>
          <Link href="/workoutList" asChild style={{justifyContent:"center"}}>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>
          </Link>
          <Link href="/workoutList" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Register</Text>
            </Pressable>
          </Link>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
  },
  inputContainer: {
    margin: 20,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    borderColor: "#aaaaaa",
  },
  button: {
    width: 100,
    height: 30,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    borderColor: "#aaaaaa",
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 16,
  }
});
