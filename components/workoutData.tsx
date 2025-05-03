import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

type WorkoutData = {
    duration: Float;
    distance: Float;
    averageSpeed: Float;
    maxSpeed: Float;
}

const WorkoutDataContainer = (data: WorkoutData) => {
    return (
        <View >
            <View style={{flexDirection: "row"}}>
                <Text style={{flex: 0.5}}>
                    {"Duration:"}
                </Text>
                <Text style={{flex: 0.5}}>
                    {"Distance:"}
                </Text>
            </View>
            <View style={{flexDirection: "row"}}>
                <Text style={{flex: 0.5}}>
                    {data.duration}
                </Text>
                <Text style={{flex: 0.5}}>
                    {data.distance + " km"}
                </Text>
            </View>
            <View style={{flexDirection: "row"}}>
                <Text style={{flex: 0.5}}>
                    {"Average Speed:"}
                </Text>
                <Text style={{flex: 0.5}}>
                    {"Max Speed:"}
                </Text>
            </View>
            <View style={{flexDirection: "row"}}>
                <Text style={{flex: 0.5}}>
                    {data.averageSpeed + " km/s"}
                </Text>
                <Text style={{flex: 0.5}}>
                    {data.maxSpeed + " km/s"}
                </Text>
            </View>
        </View>
    );
};

export default WorkoutDataContainer;