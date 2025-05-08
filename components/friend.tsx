import React from "react";
import { Friend } from "@/app/(tabs)/friendsList"
import { StyleSheet, Image, useColorScheme } from "react-native";
import ThemedThouchable from "./ThemedTouchable";
import ThemedText from "./ThemedText";
import { Colors } from "@/constants/colors";

type FriendProps = {
    data: Friend;
};

const FriendContainer = (friendProps: FriendProps) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;

    return (
        <ThemedThouchable style={styles.FriendContainer}>
            <Image
                source={friendProps.data.profilePic}
                style={styles.image}
            />
            <ThemedText style={[styles.FriendName, { color: theme.textAccent, }]}>
                {friendProps.data.name}
            </ThemedText>
        </ThemedThouchable>
    );
};

const styles = StyleSheet.create({
    FriendContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
    },
    
    FriendName: {
        flexGrow: 1,
        fontSize: 35,
        fontWeight: "300",
    },

    image: {
        backgroundColor: "white",
        borderRadius: 40,
        width: 80,
        height: 80,
        marginRight: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 2,
    }

});

export default FriendContainer;