import FriendContainer from "@/components/friend";
import { useState } from "react";
import { FlatList, View } from "react-native";

export type Friend = {
    id: number;
    name: string;
    profilePic: any;
};



export default function FriendList() {
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

    // const [friends, setWorkouts] = useState<Friend[]>([])
    return (
        <View style={{ flexGrow: 1}}>
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

