import React from "react";
import { Workout } from "@/app/(tabs)/workoutList"
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

type WorkoutProps = {
    data: Workout;
};

const WorkoutContainer = (workoutProps: WorkoutProps) => {
    return (
        <TouchableOpacity style={styles.WorkoutContainer}>
            <Text style={styles.WorkoutName}>
                {workoutProps.data.name}
            </Text>
            <Text style={{}}>
                {workoutProps.data.date.getDate() + ". " + (workoutProps.data.date.getMonth() + 1) + ". " + workoutProps.data.date.getFullYear()}
            </Text>
            <Text style={{}}>
                {workoutProps.data.distance + " km"}
            </Text>
        </TouchableOpacity>
    );
};

const WorkoutInfoBox = (workoutProps: WorkoutProps) => {
    return (
        <View style={styles.WorkoutContainer}>
            <Text style={styles.WorkoutName}>
                {workoutProps.data.name}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <View>
                    <Text>Duration:</Text>
                    <Text style={styles.WorkoutValue}>01:23:45</Text>
                </View>
                <View>
                    <Text>Distance:</Text>
                    <Text style={styles.WorkoutValue}>{workoutProps.data.distance + " km"}</Text>
                </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <View>
                    <Text>Current Speed:</Text>
                    <Text style={styles.WorkoutValue}>12 km/h</Text>
                </View>
                <View>
                    <Text>Average Speed:</Text>
                    <Text style={styles.WorkoutValue}>8 km/h</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    WorkoutContainer: {
        marginInline:15,
        marginTop:15,
        padding: 10,
        borderRadius: 5,
        backgroundColor: "lightgray",

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
