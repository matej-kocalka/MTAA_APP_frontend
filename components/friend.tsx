import React from "react";
import { Friend } from "@/app/(tabs)/friendsList"
import { StyleSheet, Text, View } from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

type FriendProps = {
    data: Friend;
};

const FriendContainer = (workoutProps: FriendProps) => {
    return (
        <View style={{}}>
            <Text style={{}}>
                {workoutProps.data.name}
            </Text>
        </View>
    );
};

export default FriendContainer;