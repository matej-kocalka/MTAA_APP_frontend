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

    const onDelete = (workout: Workout) => {
        if(workout.w_id){
            WorkoutService.deleteWorkout(workout.w_id);
        }
        const work = [];
        for (var w of workouts){
            if (w.w_id != workout.w_id){
                work.push(w);
            }
        }
        setWorkouts(work);
    }

    useEffect(() => {
        const fetchWorkouts = async () => {
            workoutManager?.setUser(auth.user);
            const data = await workoutManager!.getWorkouts()!;
            setWorkouts(work => [/*...work, */...data]);
        };

        fetchWorkouts();
    }, [pathname, workoutManager]);

    return (
        <View style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}>
            <FlatList<Workout>
                contentInsetAdjustmentBehavior="automatic"
                data={workouts}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => router.push({ pathname: "/workoutDetail", params: { id: item.w_id, name: item.name } })}><WorkoutContainer onDelete={onDelete} data={item} /></TouchableOpacity>
                )}
                keyExtractor={(item) => item.w_id.toString()}
            />
        </View>
    )
}