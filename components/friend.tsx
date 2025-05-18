import React, { useState } from "react";
import { Friend } from "@/app/(tabs)/friendsList"
import { StyleSheet, Image, useColorScheme, View, TouchableOpacity } from "react-native";
import ThemedText from "./ThemedText";
import { Colors } from "@/constants/colors";
import ThemedContainer from "./ThemedContainer";
import ThemedButton from "./ThemedButton";
import User from "@/models/User";
import FriendManager from "@/managers/FriendManager";
import { router } from "expo-router";

type FriendProps = {
    data: Friend;
    user: User;
    friendManager: FriendManager;
};

/**
 * Component displaying a friend entry with their profile picture and name.
 * Clicking on the container navigates to the friend's workout list.
 *
 * @param {FriendProps} friendProps - Props containing friend info, user and manager
 * @returns JSX.Element
 */
const FriendContainer = (friendProps: FriendProps) => {
    const openList = () => {
        friendProps.friendManager.openedFriend = friendProps.data;
        router.push({ pathname: "/friendWorkoutList" });
    }
    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;
    const defaultImage = require("@/assets/images/profile.png");
    const [ImageUri, setLocalImageUri] = useState(friendProps.data.profilePic)

    return (
        <TouchableOpacity onPress={openList} testID="FriendContainer">
            <ThemedContainer style={styles.FriendContainer}  >
                <Image
                    source={ImageUri ? { uri: ImageUri + '?t=' + Date.now() } : defaultImage}
                    style={styles.image}
                />
                <View>
                    <ThemedText style={[styles.FriendName, { color: theme.textAccent, }]} numberOfLines={1} ellipsizeMode="tail">
                        {friendProps.data.name}
                    </ThemedText>
                    <ThemedText>
                        {friendProps.data.email}
                    </ThemedText>
                </View>
            </ThemedContainer>
        </TouchableOpacity>
    );
};

const handleAccept = async (data: Friend, user: User, friendManager: FriendManager) => {
    await friendManager.acceptRequest(user, data.id);
}

const handleReject = async (data: Friend, user: User, friendManager: FriendManager) => {
    await friendManager.rejectRequest(user, data.id);
}

/**
 * Component showing a friend request with Accept and Reject buttons.
 *
 * @param {FriendProps} friendProps - Props containing friend info, user and manager
 * @returns JSX.Element
 */
const FriendRequest = (friendProps: FriendProps) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;

    return (
        <ThemedContainer testID="FriendRequest">
            <View>
                <ThemedText>Friend request from:</ThemedText>
                <ThemedText style={[styles.FriendRequestName, { color: theme.textAccent }]}>
                    {friendProps.data.name}
                </ThemedText>
                <ThemedText style={{ flexGrow: 1, textAlign: "center", fontSize: 18, marginBottom: 15 }}>
                    {friendProps.data.email}
                </ThemedText>
            </View>
            <View style={{ flexDirection: "row" }}>
                <ThemedButton style={{ marginInline: 0, flexGrow: 1, marginRight: 5 }} onPress={() => handleAccept(friendProps.data, friendProps.user, friendProps.friendManager)}>Accept</ThemedButton>
                <ThemedButton style={{ marginInline: 0, flexGrow: 1, marginLeft: 5, backgroundColor: theme.deleteButton }} onPress={() => handleReject(friendProps.data, friendProps.user, friendProps.friendManager)}>Reject</ThemedButton>
            </View>
        </ThemedContainer>
    );
};

const styles = StyleSheet.create({
    FriendContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
    },

    FriendName: {
        fontSize: 35,
        fontWeight: "300",
    },

    FriendRequestName: {
        flexGrow: 1,
        textAlign: "center",
        fontSize: 35,
        fontWeight: "300",
        marginTop: 20,
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

export { FriendContainer, FriendRequest };
