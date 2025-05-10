import ThemedButton from "@/components/ThemedButton";
import ThemedContainer from "@/components/ThemedContainer";
import { WorkoutInfoBoxResults } from "@/components/workout";
import { Colors } from "@/constants/colors";
import { useNavigation } from "expo-router";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView, Pressable, TextInput, Button, useColorScheme } from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import Workout from "@/models/Workout";
// import WorkoutManager from "@/managers/WorkoutManager";
import useAuth from "@/hooks/useAuth";
import { WorkoutContext } from "@/context/WorkoutContext";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";


export type WorkoutProgress = {
    id: number;
    name: string;
    date: Date;
    distance: number;
    duration: string;
    current_speed: number;
    steps: number;
};

export default function currentWorkout() {
    let preset: WorkoutProgress =
    {
        id: 1,
        name: "New Workout",
        date: new Date(),
        distance: 0.0,
        duration: "00:00:00",
        current_speed: 0,
        steps: 0,
    };

    const auth = useAuth();
    const workoutManager = useContext(WorkoutContext);
    const { id } = useLocalSearchParams();
    const [workoutProgress, setWorkoutProgress] = useState<WorkoutProgress>(preset)

    useEffect(() => {
        const fetchWorkout = async () => {
            const allWorkouts = await workoutManager?.getWorkouts();
            const workout = allWorkouts?.find(w => w.w_id === Number(id));
            const progress: WorkoutProgress = workout!.getWorkoutResults(auth.user) ?? preset;
            setWorkoutProgress(progress);
        };
        fetchWorkout();
    }, [id]);

    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({ title: workoutProgress.name, headerBackTitle: 'Back', headerTintColor: theme.accentColor });
    }, [navigation]);

    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;

    const styles = StyleSheet.create({
        map: {
            height: 350,
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
    })

    return (
        <ScrollView style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}>
            <ThemedContainer style={styles.map}>
                <Text>Map placeholder</Text>
            </ThemedContainer>
            <WorkoutInfoBoxResults data={workoutProgress!} />

        </ScrollView>
    )

}


