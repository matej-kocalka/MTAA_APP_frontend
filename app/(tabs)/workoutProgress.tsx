import ThemedButton from "@/components/ThemedButton";
import ThemedContainer from "@/components/ThemedContainer";
import { WorkoutContainer, WorkoutInfoBox } from "@/components/workout";
import { Colors } from "@/constants/colors";
import { useNavigation, useRouter } from "expo-router";
import React, { useContext, useEffect, useLayoutEffect, useState, useRef } from "react";
import { ScrollView, View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView, Pressable, TextInput, Button, useColorScheme } from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import Workout from "@/models/Workout";
// import WorkoutManager from "@/managers/WorkoutManager";
import useAuth from "@/hooks/useAuth";
import { WorkoutContext } from "@/context/WorkoutContext";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import MapView, {LatLng, Polyline} from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import { WEB_SOCKET_URL } from "@/constants/api";



export type WorkoutProgress = {
    id: number;
    name: string;
    date: Date;
    distance: Float;
    duration: string;
    current_speed: number;
    steps: number;
};

Geolocation.setRNConfiguration({
    authorizationLevel:'always',
    enableBackgroundUpdates:true,
    locationProvider:'auto',
    skipPermissionRequests:false,
});

const router = useRouter();

export default function currentWorkout() {


    let preset: WorkoutProgress =
    {
        id: 1,
        name: "New Workout",
        date: new Date(),
        distance: 0.0,
        duration: "00:00:00",
        current_speed: 12,
        steps: 0,
    };

    const auth = useAuth();
    const workoutManager = useContext(WorkoutContext);
    const mapRef = useRef<MapView>();
    const socketRef = useRef<WebSocket|null>(null);
    const [isWorkout, setWorkout] = useState(false);
    const [workoutProgress, setWorkoutProgress] = useState<WorkoutProgress>(preset)
    const [userPath, setUserPath] = useState<LatLng[]>([]);
    const [currentCoords, setCurrentCoords] = useState<LatLng>(0);
    const [isSocketConnected, setIsSocketConneted] = useState<Boolean>(false);
    //const [minCoords, setMinCoords] = useState<LatLng>(0);
    //const [maxCoords, setMaxCoords] = useState<LatLng>(0);

    const handleWorkoutStart = () => {
        setWorkout(true);
        try { workoutManager!.startNewWorkout(name, auth.user) } catch (e) { console.log(e); }
    };

    const handleWorkoutStop = async () => {
        const workout = workoutManager?.getCurrentWorkout();
        workoutManager!.finishWorkout();
        setWorkoutProgress(preset);
        setWorkout(false);
        router.navigate({ pathname: "/(tabs)/workoutList"});
        router.push({ pathname: "/workoutDetail", params: { id: workout?.w_id } })
    };


    useEffect(() => {
        
        const interval = setInterval(() => {
            if(isWorkout){
                let wp = workoutManager!.getWorkoutProgress(auth.user);
                if (wp) {

                    setWorkoutProgress(wp);
                }

                workoutManager!.sendData(socketRef.current);

                let c= workoutManager!.getCurrentCoords();
                if(c) {
                    setCurrentCoords(c);
                }
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        }


    }, [isWorkout])

    useEffect(() => {   // refreshing
        const ws = new WebSocket(`${WEB_SOCKET_URL}/workout/socket?token=${auth.getToken()}`)

        ws.onopen = () => {
            setIsSocketConneted(true);
        };

        ws.onmessage = (event) => {
            workoutManager!.handleSocketMessage(JSON.parse(event.data));
        };

        ws.onclose = () => {
            setIsSocketConneted(false);
        };

        ws.onerror = (error) => {
            console.error(`WebSocket error: ${error}`);
        };
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        }; // Clean up on unmount
    }, []);

    useEffect(()=>{
        if(currentCoords != 0){
            setUserPath(coordinates => [...coordinates, currentCoords]);
            /*
            let minLat;
            let minLng;
            let maxLat;
            let maxLng;
            if (minCoords != 0){
                minLat = minCoords.latitude;
                minLng = minCoords.longitude;
                if (minLat > currentCoords.latitude) minLat = currentCoords.latitude;
                if (minLng > currentCoords.longitude) minLng = currentCoords.longitude;
            }else{
                minLat = currentCoords.latitude;
                minLng = currentCoords.longitude;
            }
            if(maxCoords != 0){
                maxLat = maxCoords.latitude;
                maxLng = maxCoords.longitude;
                if (maxLat > currentCoords.latitude) maxLat = currentCoords.latitude;
                if (maxLng > currentCoords.longitude) maxLng = currentCoords.longitude;
            } else{
                minLat = currentCoords.latitude;
                minLng = currentCoords.longitude;
            }
            setMinCoords({latitude: minLat, longitude: minLng});
            setMaxCoords({latitude: maxLat, longitude: maxLng});
            this.map.animateToRegion({
                latitude: (maxLat+minLat)/2,
                longitude: (maxLng+minLng)/2,
                latitudeDelta: (maxLat-minLat) * 1.1,
                longitudeDelta: (maxLng-minLng) * 1.1
            });
            */
            if(mapRef.current)
            mapRef.current!.animateToRegion({
                latitude: currentCoords.latitude,
                longitude: currentCoords.longitude,
                latitudeDelta: 0.0008,
                longitudeDelta: 0.0008
            });
        }
    }, [currentCoords]);


    const navigation = useNavigation(); //Top bar button
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: isWorkout ? () => (
                <TouchableOpacity style={styles.topBarButton} onPress={handleWorkoutStop}>
                    <Text style={{
                        color: theme.buttonTextColor,
                        fontWeight: 'bold',
                    }}>Finish Workout</Text></TouchableOpacity>
            ) : undefined,
        });
    }, [navigation, isWorkout]);

    const [visible, setVisible] = useState(false);
    const [friendName, setFriendName] = useState('');
    const [name, setName] = useState('');
    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;

    const styles = StyleSheet.create({
        map: {
            height: 350,
        },

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

    if (isWorkout) {
        return (
            <ScrollView style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}>
                <View style={styles.map}>
                    <MapView 
                        style={styles.map}
                        ref={mapRef}
                        initialRefion={{
                            latitude: 40,
                            longitude: 40,
                            latitudeDelta: 0.1,
                            longitudeDelta: 0.2
                        }}
                        showsBuildings={false}
                    >
                    <Polyline coordinates={userPath}
                        strokeColor="red"
                        strokeWidth={3}/>
                    </MapView>

                </View>
                <WorkoutInfoBox data={workoutProgress!} />
                <ThemedButton onPress={() => setVisible(true)}>Add friend</ThemedButton>

                <Modal
                    visible={visible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.title}>Add friend to Workout</Text>

                            <TextInput
                                placeholder=""
                                value={friendName}
                                onChangeText={setFriendName}
                                style={styles.input}
                            />
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: 'gray' }]}
                                    onPress={() => setVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton}>
                                    <Text style={styles.buttonText}>Send request</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        )
    }
    else {
        return (
            <View style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}>
                <ThemedContainer>
                    <View style={{ alignItems: "center", margin: 30 }}><Ionicons name="walk" size={100} color={theme.accentColor} /></View>
                    <ThemedText style={{ textAlign: "center", fontSize: 20, margin: 10 }}>No active workout</ThemedText>
                    <ThemedButton style={{ marginBottom: 15, }} onPress={() => setVisible(true)}>Start Workout</ThemedButton>
                </ThemedContainer>

                <Modal
                    visible={visible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.title}>Start a new workout</Text>
                            <TextInput
                                placeholder="New Workout"
                                value={name}
                                onChangeText={setName}
                                style={styles.input}
                            />
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: 'gray' }]}
                                    onPress={() => setVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={() => { if (name.trim() === '') { alert("Name cannot be empty!") } else { setVisible(false); handleWorkoutStart() } }}>
                                    <Text style={styles.buttonText}>Start</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

}


