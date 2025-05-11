import ThemedButton from "@/components/ThemedButton";
import ThemedContainer from "@/components/ThemedContainer";
import { WorkoutInfoBoxResults } from "@/components/workout";
import { Colors } from "@/constants/colors";
import { useNavigation } from "expo-router";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView, Pressable, TextInput, Button, useColorScheme } from "react-native";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import Workout from "@/models/Workout";
// import WorkoutManager from "@/managers/WorkoutManager";
import useAuth from "@/hooks/useAuth";
import { WorkoutContext } from "@/context/WorkoutContext";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import MapView, { LatLng, Polyline } from "react-native-maps";
import WorkoutService from "@/services/WorkoutService";
import { uploadFiles } from "react-native-fs";


export type WorkoutProgress = {
    id: number;
    name: string;
    date: Date;
    distance: number;
    duration: string;
    current_speed: number;
    steps: number;
};

export default function currentWorkout() {
    let preset: WorkoutProgress =
    {
        id: 1,
        name: "New Workout",
        date: new Date(),
        distance: 0.0,
        duration: "00:00:00",
        current_speed: 0,
        steps: 0,
    };

    const auth = useAuth();
    const workoutManager = useContext(WorkoutContext);
    const { id } = useLocalSearchParams();
    const [workoutProgress, setWorkoutProgress] = useState<WorkoutProgress>(preset);
    const mapRef = useRef<MapView>();
    const [userPath, setUserPath] = useState<LatLng[]>([]);

    const UploadWorkout = async () =>{
        const workout = workoutManager?.getWorkout(Number(id));
        const response = await WorkoutService.createWorkout(workout.name, workout.start);
        const i : number = workoutManager?.workouts.findIndex(p => p.w_id == workout.w_id);
        workoutManager!.workouts[i] = response.data.workout_id;
        const status = await WorkoutService.uploadData(this.currentWorkout!.w_id, workout?.participants.find(p => p.user.id === auth.user.id).samples);
        workoutManager.StoreNewWorkoutArray();
    }

    useEffect(() => {
        const fetchWorkout = async () => {
            const workout = workoutManager?.getWorkout(Number(id));
            const result = await WorkoutService.getData(Number(id), 0);
            if(result.status == 200){
                let currentUser = workout?.participants.find(p => p.user.id === auth.user.id);
                const path = [];
                for(var s of result.data.samples){
                    path.push({sample_time: s.sample_time, coords:{latitude: s.position_lat, longitude: s.position_lon}});
                    currentUser?.samples.push({s_id: s.sample_id, sample_time: s.sample_time, position_lat: s.position_lat, position_lon: s.position_lon})
                }
                path.sort((a,b)=>a.sample_time > b.sample_time ? 1: -1);
                const coords = [];
                let minLat, minLng, maxLat, maxLng;
                if(path.length > 0){
                    minLat = maxLat = path[0].coords.latitude;
                    minLng = maxLng = path[0].coords.longitude;
                    for(var s of path){
                        if ( s.coords.latitude < minLat) minLat = s.coords.latitude;
                        if ( s.coords.latitude > maxLat) maxLat = s.coords.latitude;
                        if ( s.coords.longitude < minLng) minLng = s.coords.longitude;
                        if ( s.coords.longitude > maxLng) maxLng = s.coords.longitude;
                        coords.push(s.coords);
                    }
                // currentUser!.coordinates = coords;
                    setUserPath(coords);
                    mapRef.current!.animateToRegion({
                        latitude: (maxLat+minLat)/2,
                        longitude: (maxLng+minLng)/2,
                        latitudeDelta: (maxLat-minLat) * 1.2,
                        longitudeDelta: (maxLng-minLng) * 1.2
                    });
                }
            }
            const progress: WorkoutProgress = workout!.getWorkoutResults(auth.user) ?? preset;
            setWorkoutProgress(progress);
        };
        fetchWorkout();
    }, [id]);

    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({ title: workoutProgress.name, headerBackTitle: 'Back', headerTintColor: theme.accentColor });
    }, [navigation]);

    const colorScheme = useColorScheme();
    const theme = colorScheme ? Colors[colorScheme] : Colors.light;

    const styles = StyleSheet.create({
        mapContainer: {
            height: 350,
        },

        map: {
            flex: 1
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

    return (
        <ScrollView style={{ backgroundColor: theme.backgroundColor, flexGrow: 1 }}>
            <ThemedContainer style={styles.mapContainer}>
                <MapView style={styles.map}
                        ref={mapRef}
                        showsBuildings={false}
                    >
                    <Polyline 
                        coordinates={userPath}
                        strokeColor="red"
                        strokeWidth={3}
                        />
                </MapView>
            </ThemedContainer>
            {Number(id) < 0 ? 
                <ThemedButton onPress={UploadWorkout}> <ThemedText>Upload</ThemedText></ThemedButton>
                :
                null
            }
            <WorkoutInfoBoxResults data={workoutProgress!} />

        </ScrollView>
    )

}


