import ThemedButton from "@/components/ThemedButton";
import ThemedContainer from "@/components/ThemedContainer";
import { WorkoutContainer, WorkoutInfoBox } from "@/components/workout";
import { Colors } from "@/constants/colors";
import { useNavigation } from "expo-router";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
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


export type WorkoutProgress = {
    id: number;
    name: string;
    date: Date;
    distance: number;
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

/*
[{latitude: 0, longitude: 10},
{latitude: 10, longitude: 15},
{latitude: 15, longitude: 10},
{latitude: 0, longitude: 123},
{latitude: 2, longitude: 4},
{latitude: 2, longitude: 51}]
    */

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
    const mapRef= React.createRef();
    const [isWorkout, setWorkout] = useState(false);
    const [workoutProgress, setWorkoutProgress] = useState<WorkoutProgress>(preset)
    const [userPath, setUserPath] = useState<LatLng[]>([]);
    const [currentCoords, setCurrentCoords] = useState<LatLng>(0);

    const handleWorkoutStart = () => {
        try { workoutManager!.startNewWorkout(0, "New workout", auth.user) } catch (e) { console.log(e); }
        setWorkout(true);
    };

    const handleWorkoutStop = () => {
        workoutManager!.finishWorkout();
        setWorkoutProgress(preset);
        setWorkout(false);
    };

    useEffect(()=>{
        console.log("updated");
    }, [userPath]);

    useEffect(() => {   // refreshing
        const interval = setInterval(() => {
            //console.log("ping");

            let wp = workoutManager!.getWorkoutProgress(auth.user);
            if (wp) {
                /*
                        mapRef.current?.animateToRegion({
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                            latitudeDelta: 0.1,
                            longitudeDelta: 0.1
                        });*/

                setWorkoutProgress(wp);
            }

            let c= workoutManager!.getCurrentCoords();
            if(c) {
                setCurrentCoords(c);
            }
        }, 1000);

        return () => clearInterval(interval); // Clean up on unmount
    }, []);

    useEffect(()=>{
        if(currentCoords != 0){
            setUserPath(coordinates => [...coordinates, currentCoords]);
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
                    <ThemedButton style={{ marginBottom: 15, }} onPress={handleWorkoutStart}>Start Workout</ThemedButton>
                </ThemedContainer>

            </View>
        )
    }

}


