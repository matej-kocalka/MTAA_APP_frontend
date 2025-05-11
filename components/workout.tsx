import React from "react";
import Workout from "@/models/Workout";
import { WorkoutProgress } from "@/app/(tabs)/workoutProgress"
import { StyleSheet, View, Text, useColorScheme, Touchable, TouchableOpacity } from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import ThemedThouchable from "./ThemedTouchable";
import ThemedText from "./ThemedText";
import ThemedContainer from "./ThemedContainer";
import { Colors } from "@/constants/colors";
import useAuth from "@/hooks/useAuth";
import WorkoutParticipant from "@/models/WorkoutParticipant";


type WorkoutProps = {
    data: Workout;
    onDelete: (workout: Workout) => void;
};

type WorkoutPropsProgress = {
    data: WorkoutProgress;
};


const WorkoutContainer = (workoutProps: WorkoutProps) => {
    const auth = useAuth();
    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;
    const participant:WorkoutParticipant|null = workoutProps.data.getParticipant(auth.user);

    return (
        <ThemedContainer>
            <View style={{flexDirection:"row"}}>
                <View style={{flex:1}}>
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
                <View style={{justifyContent:"center"}}>
                    <TouchableOpacity onPress={() => workoutProps.onDelete(workoutProps.data)}> <ThemedText>Delete</ThemedText></TouchableOpacity>
                </View>
            </View>
        </ThemedContainer>
    );
};

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
                    <ThemedText style={styles.WorkoutValue}>{workoutProps.data.duration}</ThemedText>
                </View>
                <View>
                    <ThemedText style={{ textAlign: "right" }}>Distance:</ThemedText>
                    <ThemedText style={[styles.WorkoutValue, { textAlign: "right" }]}>{workoutProps.data.distance.toFixed(2) + " m"}</ThemedText>
                </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <View>
                    <ThemedText>Average speed:</ThemedText>
                    <ThemedText style={styles.WorkoutValue}>{((workoutProps.data.distance/(Number(time[0])*Number(3600+time[1])*60+Number(time[2])))*3.6).toFixed(2) + " km/h"}</ThemedText>
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
