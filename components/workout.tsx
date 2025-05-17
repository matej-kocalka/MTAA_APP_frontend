import React from "react";
import Workout from "@/models/Workout";
import { StyleSheet, View, Text, useColorScheme, Touchable, TouchableOpacity } from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import ThemedText from "./ThemedText";
import ThemedContainer from "./ThemedContainer";
import { Colors } from "@/constants/colors";
import useAuth from "@/hooks/useAuth";
import WorkoutParticipant from "@/models/WorkoutParticipant";

/**
 * Represents the progress of a workout.
 */
export type WorkoutProgress = {
    id: number;
    name: string;
    date: Date;
    distance: Float;
    duration: string;
    current_speed: number;
    steps: number;
};

/**
* Props passed to `WorkoutContainer`.
*/
export type WorkoutProps = {
    /**
   * Workout model data.
   */
    data: Workout;

    /**
     * Callback when the workout is deleted.
     */
    onDelete: (workout: Workout) => void;

    /**
     * Callback when the workout is shared.
     */
    onShare: (workout: Workout) => void;
};

/**
 * Props passed to progress components.
 */
export type WorkoutPropsProgress = {
    data: WorkoutProgress;
};

/**
 * Renders a container for displaying basic workout information, such as name, date, and distance.
 * Also allows sharing and deleting if the current user is the owner.
 */
const WorkoutContainer = (workoutProps: WorkoutProps) => {
    const auth = useAuth();
    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;
    const participant: WorkoutParticipant | null = workoutProps.data.getParticipant(auth.user);

    return (
        <ThemedContainer>
            <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                    <ThemedText style={[styles.WorkoutName, { color: theme.textAccent, }]}>
                        {workoutProps.data.name}
                    </ThemedText>
                    <ThemedText style={{}}>
                        {workoutProps.data.start.getDay() + ". " + (workoutProps.data.start.getMonth() + 1) + ". " + workoutProps.data.start.getFullYear()}
                    </ThemedText>
                    <ThemedText style={{}}>
                        {participant?.total_distance ? participant?.total_distance.toFixed(2) + " m" : ""}
                    </ThemedText>
                </View>
                {workoutProps.data.participants[0].user.id == auth.user?.id ?
                    <View style={{ flexDirection: "row", flex: 0.2 }}>
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "space-evenly" }}>
                            <View >
                                <TouchableOpacity onPress={() => workoutProps.onShare(workoutProps.data)}>
                                    <ThemedText>Share</ThemedText>
                                </TouchableOpacity>
                            </View>
                            <View style={{}}>
                                <TouchableOpacity onPress={() => workoutProps.onDelete(workoutProps.data)}>
                                    <ThemedText>Delete</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    : null}
            </View>
        </ThemedContainer>
    );
};

/**
 * Renders a box showing live workout progress.
 */
const WorkoutInfoBox = (workoutProps: WorkoutPropsProgress) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;

    return (
        <ThemedContainer>
            <ThemedText style={[styles.WorkoutName, { color: theme.textAccent, }]}>
                {workoutProps.data.name}
            </ThemedText>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <View>
                    <ThemedText>Duration:</ThemedText>
                    <ThemedText style={styles.WorkoutValue}>{workoutProps.data.duration}</ThemedText>
                </View>
                <View>
                    <ThemedText style={{ textAlign: "right" }}>Distance:</ThemedText>
                    <ThemedText style={[styles.WorkoutValue, { textAlign: "right" }]}>{workoutProps.data.distance.toFixed(2) + " m"}</ThemedText>
                </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <View>
                    <ThemedText>Current Speed:</ThemedText>
                    <ThemedText style={styles.WorkoutValue}>{workoutProps.data.current_speed.toFixed(2) + " km/h"}</ThemedText>
                </View>
                <View>
                    <ThemedText style={{ textAlign: "right" }}>Steps:</ThemedText>
                    <ThemedText style={[styles.WorkoutValue, { textAlign: "right" }]}>{workoutProps.data.steps}</ThemedText>
                </View>
            </View>
        </ThemedContainer>
    )
}

/**
 * Renders a box showing final workout results, including calculated average speed.
 */
const WorkoutInfoBoxResults = (workoutProps: WorkoutPropsProgress) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;

    var time = workoutProps.data.duration.split(":");

    return (
        <ThemedContainer>
            <ThemedText style={[styles.WorkoutName, { color: theme.textAccent, }]}>
                {workoutProps.data.name}
            </ThemedText>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <View>
                    <ThemedText>Duration:</ThemedText>
                    <ThemedText style={styles.WorkoutValue}>{workoutProps.data.duration ? workoutProps.data.duration : "00:00:00"}</ThemedText>
                </View>
                <View>
                    <ThemedText style={{ textAlign: "right" }}>Distance:</ThemedText>
                    <ThemedText style={[styles.WorkoutValue, { textAlign: "right" }]}>{(workoutProps.data.distance ? workoutProps.data.distance.toFixed(2) : 0) + " m"}</ThemedText>
                </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <View>
                    <ThemedText>Average speed:</ThemedText>
                    <ThemedText style={styles.WorkoutValue}>{((workoutProps.data.distance / (Number(time[0]) * Number(3600 + time[1]) * 60 + Number(time[2]))) * 3.6)?.toFixed(2) + " km/h"}</ThemedText>
                </View>
                <View>
                    <ThemedText style={{ textAlign: "right" }}>Steps:</ThemedText>
                    <ThemedText style={[styles.WorkoutValue, { textAlign: "right" }]}>{workoutProps.data.steps}</ThemedText>
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


export { WorkoutInfoBox, WorkoutContainer, WorkoutInfoBoxResults };
