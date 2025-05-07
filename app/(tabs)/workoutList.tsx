import { WorkoutContainer } from "@/components/workout";
import { Colors } from "@/constants/colors";
import { useState } from "react";
import { FlatList, useColorScheme, View } from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type Workout = {
    id: number;
    name: string;
    date: Date;
    distance: Float;
};

export default function WorkoutList() {
    const [workouts, setWorkouts] = useState<Workout[]>([ //Dummy Workouts
        {
            id: 1,
            name: "Morning Run",
            date: new Date('2025-04-20T07:00:00'),
            distance: 5.0,
        },
        {
            id: 2,
            name: "Evening Walk",
            date: new Date('2025-04-19T18:30:00'),
            distance: 2.3,
        },
        {
            id: 3,
            name: "Cycling Session",
            date: new Date('2025-04-18T09:00:00'),
            distance: 15.5,
        },
        {
            id: 4,
            name: "Yoga Practice",
            date: new Date('2025-04-17T08:00:00'),
            distance: 0, // Distance could be 0 for non-distance-based activities
        },
    ]);
    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;
    // const [workouts, setWorkouts] = useState<Workout[]>([])
    return (
        <View style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}>
            <FlatList<Workout>
                contentInsetAdjustmentBehavior="automatic"
                data={workouts}
                renderItem={({ item }) => (
                    <WorkoutContainer data={item} />
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    )
}