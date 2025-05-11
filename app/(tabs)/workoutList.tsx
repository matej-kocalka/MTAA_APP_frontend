import { WorkoutContainer } from "@/components/workout";
import { Colors } from "@/constants/colors";
import { WorkoutContext } from "@/context/WorkoutContext";
import { usePathname, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, useColorScheme, View } from "react-native";
import Workout from "@/models/Workout";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import useAuth from "@/hooks/useAuth";
import WorkoutService from "@/services/WorkoutService";
import WorkoutParticipant from "@/models/WorkoutParticipant";

// export type Workout = {
//     id: number;
//     name: string;
//     date: Date;
//     distance: Float;
// };

const router = useRouter();

export default function WorkoutList() {
    // const [workouts, setWorkouts] = useState<Workout[]>([ //Dummy Workouts
    //     {
    //         id: 1,
    //         name: "Morning Run",
    //         date: new Date('2025-04-20T07:00:00'),
    //         distance: 5.0,
    //     },
    //     {
    //         id: 2,
    //         name: "Evening Walk",
    //         date: new Date('2025-04-19T18:30:00'),
    //         distance: 2.3,
    //     },
    //     {
    //         id: 3,
    //         name: "Cycling Session",
    //         date: new Date('2025-04-18T09:00:00'),
    //         distance: 15.5,
    //     },
    //     {
    //         id: 4,
    //         name: "Yoga Practice",
    //         date: new Date('2025-04-17T08:00:00'),
    //         distance: 0, // Distance could be 0 for non-distance-based activities
    //     },
    // ]);
    const auth = useAuth();
    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;

    const workoutManager = useContext(WorkoutContext);

    const [workouts, setWorkouts] = useState<Workout[]>([])
    const pathname = usePathname();

    useEffect(() => {
        const fetchWorkouts = async () => {
            const data = await workoutManager!.getWorkouts()!;
            const workouts : Workout[] = [];
            const result = await WorkoutService.getList();
            if(result.status == 200){
                for(var w of result.data.workouts){
                    workouts.push(new Workout(w.workout_id, w.workout_name, new Date(Date.parse(w.workout_start)), [new WorkoutParticipant(auth.user, w.total_distance, w.avg_speed, w.max_speed, 0, 0, [], [], [])]));
                }
            }
            setWorkouts(work => [/*...work, */...workouts]);
        };

        fetchWorkouts();
    }, [pathname, workoutManager]);

    return (
        <View style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}>
            <FlatList<Workout>
                contentInsetAdjustmentBehavior="automatic"
                data={workouts}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => router.push({ pathname: "/workoutDetail", params: { id: item.w_id } })}><WorkoutContainer data={item} /></TouchableOpacity>
                )}
                keyExtractor={(item) => item.w_id.toString()}
            />
        </View>
    )
}