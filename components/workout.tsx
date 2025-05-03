import React from "react";
import { Workout } from "@/app/(tabs)/workoutList"
import {StyleSheet, Text, View} from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

type WorkoutProps = {
    data: Workout;
};

const WorkoutContainer = (workoutProps: WorkoutProps) => {
    return (
        <View style={{}}>
            <Text style={{}}>
                {workoutProps.data.name}
            </Text>
            <Text style={{}}>
                {workoutProps.data.date.getDate() + ". " + (workoutProps.data.date.getMonth()+1) + ". " + workoutProps.data.date.getFullYear()}
            </Text>
            <Text style={{}}>
                {workoutProps.data.distance + " km"}
            </Text>
        </View>
    );
};

export default WorkoutContainer;