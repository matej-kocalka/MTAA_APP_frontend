import WorkoutContainer from "@/components/workout";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type Workout = {
    id: number;
    name: string;
    date: Date;
    distance: Float;
};

export default function WorkoutList() {
    const [workouts, setWorkouts] = useState<Workout[]>([])
    return (
        <View>
            <FlatList<Workout>
                contentInsetAdjustmentBehavior="automatic"
                data={workouts}
                renderItem={({item}) => (
                    <WorkoutContainer data={item}/>
                )}
                keyExtractor={(item) => item.id.toString()}
                />
        </View>
    )
}

