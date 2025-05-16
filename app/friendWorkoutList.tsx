import { WorkoutContainer } from "@/components/workout";
import { Colors } from "@/constants/colors";
import { WorkoutContext } from "@/context/WorkoutContext";
import { useNavigation, usePathname, useRouter } from "expo-router";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { FlatList, TouchableOpacity, useColorScheme, View, Text, Alert } from "react-native";
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

    const friendManager: FriendManager | null = useContext(FriendsContext);

    const [workouts, setWorkouts] = useState<Workout[]>([])
    const pathname = usePathname();

    const handleFriendRemoval = async () => {
        await Alert.alert(
            'Confirm Action',
            'Are you sure you want to proceed?',
            [
                {
                    text: 'No',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        friendManager!.removeFriend(auth.user!, friendManager!.openedFriend!.id);
                        router.back();
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions(
            {
                title: friendManager!.openedFriend!.name, headerBackTitle: 'Back',
                headerRight: () => (
                    <TouchableOpacity style={{
                        backgroundColor: theme.deleteButton,
                        padding: 5,
                        borderRadius: 5,
                        marginRight: 0,
                    }} onPress={handleFriendRemoval}>
                        <Text style={{
                            color: theme.buttonTextColor,
                            fontWeight: 'bold',
                        }}> Remove friend </Text></TouchableOpacity>
                ),
            }
        );
    }, [navigation]);

    useEffect(() => {
        const fetchWorkouts = async () => {
            const friend = friendManager!.openedFriend;
            // console.log(friend);
            const data: Workout[] = await friendManager!.getWorkouts();
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
                    <TouchableOpacity onPress={() => router.push({ pathname: "/workoutDetail", params: { id: item.w_id, userId: friendManager!.openedFriend!.id } })}><WorkoutContainer onDelete={() => { }} onShare={() => { }} data={item} /></TouchableOpacity>
                )}
                keyExtractor={(item) => item.w_id!.toString()}
            />
        </View>
    )
}