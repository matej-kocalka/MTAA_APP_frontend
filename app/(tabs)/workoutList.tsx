import { WorkoutContainer } from "@/components/workout";
import { Colors } from "@/constants/colors";
import { WorkoutContext } from "@/context/WorkoutContext";
import { usePathname, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, FlatList, Modal, TouchableOpacity, useColorScheme, View, TextInput, Text, RefreshControl } from "react-native";
import Workout from "@/models/Workout";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import useAuth from "@/hooks/useAuth";
import WorkoutService from "@/services/WorkoutService";
import WorkoutParticipant from "@/models/WorkoutParticipant";
import { FriendsContext } from "@/context/FriendsContext";
import ThemedContainer from "@/components/ThemedContainer";
import ThemedText from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useNotification } from "@/hooks/useNotification";

// export type Workout = {
//     id: number;
//     name: string;
//     date: Date;
//     distance: Float;
// };

const router = useRouter();

export default function WorkoutList() {
    const auth = useAuth();
    useNotification();
    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;

    const workoutManager = useContext(WorkoutContext);

    const [workouts, setWorkouts] = useState<Workout[]>([])
    const pathname = usePathname();
    const [visible, setVisible] = useState(false);
    const [friendsEmail, setFriendsEmail] = useState("");
    const friends = useContext(FriendsContext);
    const [sharing, setSharing] = useState<Workout>();

    const styles = StyleSheet.create({
        modalView: {
            margin: 20,
            padding: 20,
            width: "auto",
            height: "auto",
            borderRadius: 10,
            alignItems: "center",
            elevation: 5
        },
        modalBackground: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        modalContainer: {
            margin: 20,
            backgroundColor: theme.backgroundColor,
            borderRadius: 10,
            padding: 20
        },
        title: {
            fontSize: 20,
            marginBottom: 10,
            fontWeight: 'bold',
            color: theme.textColor,
        },
        input: {
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
            color: theme.textColor,
            backgroundColor: theme.tabsBackground,
        },
        buttonRow: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        modalButton: {
            backgroundColor: theme.secondaryAccent,
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 5,
            marginTop: 10
        },
        buttonText: {
            color: theme.buttonTextColor,
            fontWeight: 'bold',
            textAlign: "center",
            flexGrow: 1
        },

        topBarButton: {
            backgroundColor: theme.secondaryAccent,
            padding: 5,
            borderRadius: 5,
            marginRight: 15,
        }
    })


    const onDelete = (workout: Workout) => {
        if (workout.w_id) {
            WorkoutService.deleteWorkout(workout.w_id);
        }
        const work = [];
        for (var w of workouts) {
            if (w.w_id != workout.w_id) {
                work.push(w);
            }
        }

        const i: number = workoutManager!.workouts.findIndex(p => p.w_id == workout.w_id);
        workoutManager!.workouts.splice(i, 1);

        workoutManager!.StoreNewWorkoutArray();
        setWorkouts(work);
    }

    const onShare = (workout: Workout) => {
        console.log(workout, "  ", workout.w_id);
        setSharing(workout);
        setVisible(true);
    }

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = async () => {
        const fetchWorkouts = async () => {
            workoutManager?.setUser(auth.user!);
            const data = await workoutManager!.getWorkouts()!;
            setWorkouts(work => [...data]);
        };
        setRefreshing(true);
        await fetchWorkouts();
        setRefreshing(false);
    }

    useEffect(() => {
        const fetchWorkouts = async () => {
            workoutManager?.setUser(auth.user!);
            const data = await workoutManager!.getWorkouts()!;
            setWorkouts(work => [...data]);
        };

        fetchWorkouts();
    }, [pathname, workoutManager]);

    let shareWorkoutModal = (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Share with Friend</Text>
                    <TextInput
                        placeholder="Friend's email"
                        value={friendsEmail}
                        onChangeText={setFriendsEmail}
                        style={styles.input}
                    />
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: 'gray' }]}
                            onPress={() => setVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={() => { if (friendsEmail.trim() === '') { alert("Email cannot be empty!") } else { WorkoutService.shareWorkout(sharing?.w_id!, friendsEmail) }; setVisible(false); }}>
                            <Text style={styles.buttonText}>Share</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )

    if (workouts.length === 0) {
        return (
            <View style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}>
                <ThemedContainer>
                    <View style={{ alignItems: "center", margin: 30 }}><Ionicons name="walk" size={100} color={theme.accentColor} /></View>
                    <ThemedText style={{ textAlign: "center", fontSize: 20, margin: 10, marginBottom: 20 }}>No workouts</ThemedText>
                </ThemedContainer>
            </View>
        )
    }
    else {
        return (
            <View style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}>
                <FlatList<Workout>
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    contentInsetAdjustmentBehavior="automatic"
                    data={workouts}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => router.push({ pathname: "/workoutDetail", params: { id: item.w_id, userId: auth.user?.id } })}><WorkoutContainer onDelete={onDelete} onShare={onShare} data={item} /></TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.w_id!.toString()}
                />
                {shareWorkoutModal}
            </View>
        )
    }
}
