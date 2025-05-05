import React from "react";
import { StyleSheet } from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import ThemedText from "./ThemedText";
import ThemedContainer from "./ThemedContainer";

type WorkoutData = {
    duration: Float;
    distance: Float;
    averageSpeed: Float;
    maxSpeed: Float;
}

const WorkoutDataContainer = (data: WorkoutData) => {
    return (
        <ThemedContainer >
            <ThemedContainer style={{flexDirection: "row"}}>
                <ThemedText style={{flex: 0.5}}>
                    {"Duration:"}
                </ThemedText>
                <ThemedText style={{flex: 0.5}}>
                    {"Distance:"}
                </ThemedText>
            </ThemedContainer>
            <ThemedContainer style={{flexDirection: "row"}}>
                <ThemedText style={{flex: 0.5}}>
                    {data.duration}
                </ThemedText>
                <ThemedText style={{flex: 0.5}}>
                    {data.distance + " km"}
                </ThemedText>
            </ThemedContainer>
            <ThemedContainer style={{flexDirection: "row"}}>
                <ThemedText style={{flex: 0.5}}>
                    {"Average Speed:"}
                </ThemedText>
                <ThemedText style={{flex: 0.5}}>
                    {"Max Speed:"}
                </ThemedText>
            </ThemedContainer>
            <ThemedContainer style={{flexDirection: "row"}}>
                <ThemedText style={{flex: 0.5}}>
                    {data.averageSpeed + " km/s"}
                </ThemedText>
                <ThemedText style={{flex: 0.5}}>
                    {data.maxSpeed + " km/s"}
                </ThemedText>
            </ThemedContainer>
        </ThemedContainer>
    );
};

export default WorkoutDataContainer;