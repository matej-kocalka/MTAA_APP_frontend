import React from "react";
import { Workout } from "@/app/(tabs)/workoutList"
import { StyleSheet, View, Text, useColorScheme } from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import ThemedThouchable from "./ThemedTouchable";
import ThemedText from "./ThemedText";
import ThemedContainer from "./ThemedContainer";
import { Colors } from "@/constants/colors";

type WorkoutProps = {
    data: Workout;
};


const WorkoutContainer = (workoutProps: WorkoutProps) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;

    return (
        <ThemedThouchable>
            <ThemedText style={[styles.WorkoutName, {color: theme.textAccent,}]}>
                {workoutProps.data.name}
            </ThemedText>
            <ThemedText style={{}}>
                {workoutProps.data.date.getDate() + ". " + (workoutProps.data.date.getMonth() + 1) + ". " + workoutProps.data.date.getFullYear()}
            </ThemedText>
            <ThemedText style={{}}>
                {workoutProps.data.distance + " km"}
            </ThemedText>
        </ThemedThouchable>
    );
};

const WorkoutInfoBox = (workoutProps: WorkoutProps) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;

    return (
        <ThemedContainer>
            <ThemedText style={[styles.WorkoutName, {color: theme.textAccent,}]}>
                {workoutProps.data.name}
            </ThemedText>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <View>
                    <ThemedText>Duration:</ThemedText>
                    <ThemedText style={styles.WorkoutValue}>01:23:45</ThemedText>
                </View>
                <View>
                    <ThemedText>Distance:</ThemedText>
                    <ThemedText style={styles.WorkoutValue}>{workoutProps.data.distance + " km"}</ThemedText>
                </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <View>
                    <ThemedText>Current Speed:</ThemedText>
                    <ThemedText style={styles.WorkoutValue}>12 km/h</ThemedText>
                </View>
                <View>
                    <ThemedText>Average Speed:</ThemedText>
                    <ThemedText style={styles.WorkoutValue}>8 km/h</ThemedText>
                </View>
            </View>
        </ThemedContainer>
    )
}

const styles = StyleSheet.create({
    WorkoutName: {
        fontSize: 30,
        fontWeight: "300",
    },

    WorkoutValue: {
        fontSize: 35,
        fontWeight: "300",
    }
});


export { WorkoutInfoBox, WorkoutContainer };
