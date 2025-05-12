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
import FriendManager from "@/managers/FriendManager";
import { FriendsContext } from "@/context/FriendsContext";

const router = useRouter();

export default function WorkoutList() {
    const auth = useAuth();
    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;

    const friendManager : FriendManager = useContext(FriendsContext);

    const [workouts, setWorkouts] = useState<Workout[]>([])
    const pathname = usePathname();


    useEffect(() => {
        const fetchWorkouts = async () => {
            const friend = friendManager.openedFriend;
            console.log(friend);
            const data = await friendManager!.getWorkouts()!;
            setWorkouts(work => [...data]);
        };

        fetchWorkouts();
    }, [pathname, friendManager]);

    return (
        <View style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}>
            <FlatList<Workout>
                contentInsetAdjustmentBehavior="automatic"
                data={workouts}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => router.push({ pathname: "/workoutDetail", params: { id: item.w_id, userId: friendManager.openedFriend.id} })}></TouchableOpacity>
                )}
                keyExtractor={(item) => item.w_id.toString()}
            />
        </View>
    )
}