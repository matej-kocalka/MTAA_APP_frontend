import FriendContainer from "@/components/friend";
import ThemedButton from "@/components/ThemedButton";
import { Colors } from "@/constants/colors";
import { useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { FlatList, TouchableOpacity, useColorScheme, View, Text } from "react-native";

export type Friend = {
    id: number;
    name: string;
    profilePic: any;
};



export default function FriendList() {
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{
                    backgroundColor: theme.secondaryAccent,
                    padding: 5,
                    borderRadius: 5,
                    marginRight: 15,
                }} onPress={() => alert('To be completed')}>
                    <Text style={{
                        color: theme.buttonTextColor,
                        fontWeight: 'bold',
                    }}> Add friends </Text></TouchableOpacity>
            ),
        });
    }, [navigation]);

    const [friends, setFriends] = useState<Friend[]>([  //Dummy friends
        {
            id: 1,
            name: "John",
            profilePic: require('../../assets/images/favicon.png'),
        },
        {
            id: 2,
            name: "Alena",
            profilePic: require('../../assets/images/favicon.png'),
        },
        {
            id: 3,
            name: "Bob",
            profilePic: require('../../assets/images/favicon.png'),
        },
        {
            id: 4,
            name: "Alice",
            profilePic: require('../../assets/images/favicon.png'),
        },
    ]);
    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;
    // const [friends, setWorkouts] = useState<Friend[]>([])
    return (
        <View style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}>
            <FlatList<Friend>
                contentInsetAdjustmentBehavior="automatic"
                data={friends}
                renderItem={({ item }) => (
                    <FriendContainer data={item} />
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    )
}

