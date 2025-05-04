import React from "react";
import { Friend } from "@/app/(tabs)/friendsList"
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

type FriendProps = {
    data: Friend;
};

const FriendContainer = (friendProps: FriendProps) => {
    return (
        <TouchableOpacity style={styles.FriendContainer}>
            <Image
                source={friendProps.data.profilePic}
                style={styles.image}
            />
            <Text style={styles.FriendName}>
                {friendProps.data.name}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    FriendContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginInline: 15,
        marginTop: 15,
        padding: 12,
        borderRadius: 5,
        backgroundColor: "lightgray",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        
        elevation: 2,
    },
    FriendName: {
        flexGrow: 1,
        fontSize: 35,
    },

    image: {
        borderWidth: 1,
        borderRadius: 40,
        width: 80,
        height: 80,
        marginRight: 20
    }

});

export default FriendContainer;