import FriendContainer from "@/components/friend";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type Friend = {
    id: number;
    name: string;
};

export default function WorkoutList() {
    const [workouts, setWorkouts] = useState<Friend[]>([])
    return (
        <View>
            <FlatList<Friend>
                contentInsetAdjustmentBehavior="automatic"
                data={workouts}
                renderItem={({item}) => (
                    <FriendContainer data={item}/>
                )}
                keyExtractor={(item) => item.id.toString()}
                />
        </View>
    )
}

