import React from "react";
import { Workout } from "@/app/(tabs)/workoutList"
import { StyleSheet } from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import ThemedThouchable from "./ThemedTouchable";
import ThemedText from "./ThemedText";
import ThemedContainer from "./ThemedContainer";

type WorkoutProps = {
    data: Workout;
};

const WorkoutContainer = (workoutProps: WorkoutProps) => {
    return (
        <ThemedThouchable style={styles.WorkoutContainer}>
            <ThemedText style={styles.WorkoutName}>
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
    return (
        <ThemedContainer style={styles.WorkoutContainer}>
            <ThemedText style={styles.WorkoutName}>
                {workoutProps.data.name}
            </ThemedText>
            <ThemedContainer style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <ThemedContainer>
                    <ThemedText>Duration:</ThemedText>
                    <ThemedText style={styles.WorkoutValue}>01:23:45</ThemedText>
                </ThemedContainer>
                <ThemedContainer>
                    <ThemedText>Distance:</ThemedText>
                    <ThemedText style={styles.WorkoutValue}>{workoutProps.data.distance + " km"}</ThemedText>
                </ThemedContainer>
            </ThemedContainer>
            <ThemedContainer style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <ThemedContainer>
                    <ThemedText>Current Speed:</ThemedText>
                    <ThemedText style={styles.WorkoutValue}>12 km/h</ThemedText>
                </ThemedContainer>
                <ThemedContainer>
                    <ThemedText>Average Speed:</ThemedText>
                    <ThemedText style={styles.WorkoutValue}>8 km/h</ThemedText>
                </ThemedContainer>
            </ThemedContainer>
        </ThemedContainer>
    )
}

const styles = StyleSheet.create({
    WorkoutContainer: {
        marginInline:15,
        marginTop:15,
        padding: 10,
        borderRadius: 5,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 4,
    },
    WorkoutName: {
        fontSize: 30,

    },

    WorkoutValue: {
        fontSize: 35,
    }
});


export { WorkoutInfoBox, WorkoutContainer };
