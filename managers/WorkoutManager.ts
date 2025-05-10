import { Pedometer } from 'expo-sensors';
import User from "@/models/User";
import Workout from "@/models/Workout";
import WorkoutDataSample from "@/models/WorkoutDataSample";
import WorkoutParticipant from "@/models/WorkoutParticipant";
import Geolocation from "@react-native-community/geolocation";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { LatLng }from "react-native-maps";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class WorkoutManager {
    private currentUser: User | null = null;
    private currentWorkout: Workout | null = null;
    private pedometerSubscription: any = null;
    private currentParticipant: WorkoutParticipant | null = null;
    private watchId: Number | null = null;
    private currentCoords: LatLng | null = null;

    private QUEUE_KEY = 'workout_queue';

    startNewWorkout(w_id: number, name: string, user: User | null) {
        if (!this.currentWorkout) {
            let participants: WorkoutParticipant[] = [];
            let sample: WorkoutDataSample[] = [];
            if (user) {
                this.currentUser = user;
                this.currentParticipant = new WorkoutParticipant(user, 0, 0, 0, 0, 0, sample)
                participants.push(this.currentParticipant);
                this.currentWorkout = new Workout(w_id, name, new Date(), participants);

                this.startPedometerTracking();
                this.startLocationTracking();

                return this.currentWorkout;
            } else {
                throw new Error('Workout participant is null');
            }
        } else {
            throw new Error('Workout running');
        }
    }

    getCurrentCoords(){
        return this.currentCoords;
    }

    finishWorkout() {
        this.currentParticipant?.samples.push(new WorkoutDataSample(1, new Date(), 0, 0)) //needs to be changed
        this.stopPedometerTracking();
        this.stopLocationTracking();
        this.addWorkoutToQueue(this.currentWorkout!);
        this.currentWorkout = null;
        this.currentParticipant = null;
    }

    async addWorkoutToQueue(workout: Workout) {
        try {
            // Retrieve the existing workouts from AsyncStorage
            const workoutsJson = await AsyncStorage.getItem(this.QUEUE_KEY);
            let workouts: Workout[] = workoutsJson ? JSON.parse(workoutsJson) : [];

            // Add the new workout to the array
            workouts.push(workout);

            // Store the updated list of workouts back to AsyncStorage
            await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(workouts));
        } catch (error) {
            console.error("Error saving workout to queue:", error);
        }
    }

    // Method to get all workouts stored in AsyncStorage
    async getWorkouts(): Promise<Workout[]> {
        try {
            const workoutsJson = await AsyncStorage.getItem(this.QUEUE_KEY);

            if (workoutsJson) {
                const parsedWorkouts = JSON.parse(workoutsJson);

                // Convert parsed objects into Workout instances
                const workouts: Workout[] = parsedWorkouts.map((workout: any) => {
                    return new Workout(
                        workout.w_id,
                        workout.name,
                        new Date(workout.start), // Convert start to Date object
                        workout.participants.map((participant: any) => new WorkoutParticipant(
                            new User(
                                participant.user.id,
                                participant.user.email,
                                participant.user.username,
                                participant.user.token
                            ), // Convert user object
                            participant.total_distance,
                            participant.avg_speed,
                            participant.max_speed,
                            participant.current_speed,
                            participant.steps,
                            participant.samples.map((sample: any) => new WorkoutDataSample(
                                sample.s_id,
                                new Date(sample.sample_time),
                                sample.position_lat,
                                sample.position_lon,
                            ))
                        ))
                    );
                });

                return workouts;
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error retrieving workouts from storage:", error);
            return [];
        }
    }

    getCurrentParticipant(){
        return this.currentParticipant;
    }

    getParticipant(user: User | null): WorkoutParticipant | null {
        if (user) {
            const participant = this.currentWorkout!.participants.find(u => u.user.id === user.id);
            if (participant) {
                return participant;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    getWorkoutProgress(user: User | null) {
        type WorkoutProgress = {
            id: number;
            name: string;
            date: Date;
            distance: number;
            duration: string;
            current_speed: number;
            steps: number;
        };
        if (this.currentWorkout) {
            if (user) {
                const participant = this.currentWorkout!.participants.find(u => u.user.id === user.id);
                if (participant) {
                    const elapsedMs: number = (new Date()).getTime() - this.currentWorkout!.start.getTime();
                    const hours: number = Math.floor(elapsedMs / (1000 * 60 * 60));
                    const minutes: number = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds: number = Math.floor((elapsedMs % (1000 * 60)) / 1000);

                    const duration: string = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

                    const progress: WorkoutProgress = {
                        id: this.currentWorkout!.w_id,
                        name: this.currentWorkout!.name,
                        date: this.currentWorkout!.start,
                        distance: participant.total_distance,
                        duration: duration,
                        current_speed: participant.current_speed,
                        steps: participant.steps,
                    }
                    return progress;
                }
            }
        }
    }

    addParticipant(user: User) {
        let sample: WorkoutDataSample[] = [];
        this.currentWorkout?.participants.push(new WorkoutParticipant(user, 0, 0, 0, 0, 0, sample));
    }


    // Start tracking pedometer data and adding it to the workout session
    startPedometerTracking() {
        if (this.currentWorkout) {
            this.pedometerSubscription = Pedometer.watchStepCount((result) => {
                this.currentParticipant!.steps = result.steps // Add step data to the workout
            });
        } else {
            console.error('Start a workout session first.');
        }
    }

    // Stop tracking pedometer data
    stopPedometerTracking() {
        if (this.pedometerSubscription) {
            this.pedometerSubscription.remove(); // Stop the subscription to the pedometer updates
            this.pedometerSubscription = null;
        }
    }

    startLocationTracking(){

        Geolocation.requestAuthorization(
            ()=>{

            },
            ()=>{

            }
        );

        const res = Geolocation.watchPosition(
            async position => {
                const {latitude, longitude} = position.coords;
                this.currentCoords = {latitude: latitude, longitude: longitude};
            },
            error => {
                console.log(error);
            },
            {
                enableHighAccuracy:true,
                distanceFilter: 0,
                interval: 5000,
                useSignificantChanges: true
            }
        )
        this.watchId = Number(res);
    }

    stopLocationTracking(){
        Geolocation.clearWatch(this.watchId);
    }
}
