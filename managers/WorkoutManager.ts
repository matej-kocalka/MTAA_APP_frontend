import { Pedometer } from 'expo-sensors';
import User from "@/models/User";
import Workout from "@/models/Workout";
import WorkoutDataSample from "@/models/WorkoutDataSample";
import WorkoutParticipant from "@/models/WorkoutParticipant";
import Geolocation from "@react-native-community/geolocation";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { LatLng }from "react-native-maps";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { WorkoutContext } from '@/context/WorkoutContext';
import WorkoutService from '@/services/WorkoutService';

export default class WorkoutManager {
    private currentUser: User | null = null;
    private currentWorkout: Workout | null = null;
    private pedometerSubscription: any = null;
    private currentParticipant: WorkoutParticipant | null = null;
    private watchId: number | null = null;
    private currentCoords: LatLng | null = null;
    public workouts: Workout[] = [];
    private timeStamps: Float[] = [];
    private distanceStamps: Float [] = [];
    private lastSample: Date = Date();

    private QUEUE_KEY = 'workout_queue';
    privateSendDataCounter = 0;

    startNewWorkout(name: string, user: User | null) {
        this.currentParticipant = null;
        this.currentWorkout = null;
        this.currentCoords = null;
        this.stopPedometerTracking();
        this.stopLocationTracking();

        if (!this.currentWorkout) {
            let participants: WorkoutParticipant[] = [];
            let sample: WorkoutDataSample[] = [];
            if (user) {
                this.currentUser = user;
                this.currentParticipant = new WorkoutParticipant(user, 0, 0, 0, 0, 0, [], sample, []);
                participants.push(this.currentParticipant);
                let date = new Date()
                this.currentWorkout = new Workout(-Math.floor(Math.random() * 65536), name, date, participants);
                this.workouts.push(this.currentWorkout);
                this.createWorkout(name, date);

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

        //this.currentParticipant!.samples.push(new WorkoutDataSample(1, new Date(), 0, 0)); //needs to be changed
        //this.currentParticipant!.samples = [...this.currentParticipant!.samples, new WorkoutDataSample(1, new Date(), 0, 0)];
        this.stopPedometerTracking();
        this.stopLocationTracking();
        this.workoutUploadData()
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

    async StoreNewWorkoutArray(){
        await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(this.workouts));
    }

    getWorkout(workout_id: number) {
        return this.workouts?.find(w => w.w_id === workout_id);
    }
    getCurrentWorkout(){
        return this.currentWorkout;
    }

    // Method to get all workouts stored in AsyncStorage
    async getWorkouts(): Promise<Workout[]> {
        var workoutsPhone : Workout[] = [];
        try {
            const workoutsJson = await AsyncStorage.getItem(this.QUEUE_KEY);

            if (workoutsJson) {
                const parsedWorkouts = JSON.parse(workoutsJson);

                // Convert parsed objects into Workout instances
                workoutsPhone = parsedWorkouts.map((workout: any) => {
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

            }
        } catch (error) {
            console.error("Error retrieving workouts from storage:", error);
        }

        const workoutsBackend : Workout[] = [];
        const result = await WorkoutService.getList();
        if(result.status == 200){
            for(var w of result.data.workouts){
                workoutsBackend.push(new Workout(w.workout_id, w.workout_name, new Date(Date.parse(w.workout_start)), [new WorkoutParticipant(this.currentUser, w.total_distance, w.avg_speed, w.max_speed, 0, 0, [], [], [])]));
            }
        }

        const mergedArray = [
            ...workoutsBackend,
            ...workoutsPhone
        ].filter((value, index, self) => 
            self.findIndex((v) => v.w_id === value.w_id) === index
        );
        this.workouts = mergedArray;
        this.StoreNewWorkoutArray();
        
        return mergedArray;
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
                if(this.currentCoords){
                    let dist = this.distance(position.coords.latitude, position.coords.longitude, this.currentCoords!.latitude, this.currentCoords!.longitude);
                    this.currentParticipant!.total_distance += this.distance(latitude, longitude, this.currentCoords!.latitude, this.currentCoords!.longitude);
                    if( this.distanceStamps.length < 5){
                        this.distanceStamps = [dist, ...this.distanceStamps];
                        this.timeStamps = [(new Date()).getTime(), ...this.timeStamps]
                    } else {
                        this.distanceStamps = [dist, ...this.distanceStamps];
                        this.distanceStamps.pop();

                        var distTotal = 0;
                        for (var n of this.distanceStamps){
                            distTotal += n;
                        }
                        var timeTotal = ((new Date()).getTime() -this.timeStamps[0])/1000.0; 
                        const speed = (distTotal/timeTotal )*3.6;
                        this.currentParticipant!.current_speed = speed;
                        if (this.currentParticipant!.max_speed < speed) this.currentParticipant!.max_speed = speed;
                    }
                }
                var newSampleTime = new Date();
                this.currentParticipant!.samples = [...this.currentParticipant!.samples, {s_id: null, sample_time: (newSampleTime), position_lat: latitude, position_lon: longitude}];
                this.currentParticipant!.samplesNotSent = [...this.currentParticipant!.samplesNotSent, {s_id: null, sample_time: (newSampleTime), position_lat: latitude, position_lon: longitude}];
                if(this.lastSample < newSampleTime) this.lastSample=newSampleTime;
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
        if (this.watchId){
            Geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    distance(lat1 : Float, lon1 : Float, lat2 : Float, lon2 : Float) {
        let r = 6371000; // m
        let p = Math.PI / 180;

        let a = 0.5 - Math.cos((lat2 - lat1) * p) / 2
                        + Math.cos(lat1 * p) * Math.cos(lat2 * p) *
                        (1 - Math.cos((lon2 - lon1) * p)) / 2;

        return 2 * r * Math.asin(Math.sqrt(a));
    }

    async createWorkout(workoutName, workoutStart){
        const response = await WorkoutService.createWorkout(workoutName, workoutStart);
        if(response.status == 201){
            this.currentWorkout!.w_id = response.data.workout_id;
        }
    }

    DateToString(date: Date){
        return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }

    async workoutUploadData(ws){
        if (this.currentWorkout!.w_id && this.currentParticipant!.samplesNotSent.length > 1){
            const samplesToSent = this.currentParticipant!.samplesNotSent;
            this.currentParticipant!.samplesNotSent = [];
            if(ws){
                const samplesArray = [];
                for (var s of samplesToSent){
                    samplesArray.push({sample_time: this.DateToString(s.sample_time), position_lat: s.position_lat, position_lon: s.position_lon});
                }
                const message = JSON.stringify({
                    "workout_id": this.currentWorkout!.w_id,
                    "samples": samplesArray,
                    "load_from": this.lastSample
                });
                ws.send(message);
            } else {
                const status = await WorkoutService.uploadData(this.currentWorkout!.w_id, samplesToSent);
                if (status != 201){
                    this.currentParticipant!.samplesNotSent = [...samplesToSent, ...this.currentParticipant!.samplesNotSent]
                }
                if(this.currentWorkout && this.currentParticipant){
                    await WorkoutService.updateParticipantData(this.currentWorkout.w_id, this.currentParticipant);
                }
            }
        }
    }

    sendData(ws){
        this.privateSendDataCounter++;

        if(this.privateSendDataCounter >= 5){
            this.workoutUploadData(ws);
            this.privateSendDataCounter = 0;
        }
    }

    setUser(user){
        this.currentUser = user;
    }

    handleSocketMessage(message){
        
        var samples = message.samples
        samples.sort((a,b)=>a.sample_time > b.sample_time ? 1: -1);
        for(var s of message.samples){
            let user = this.currentWorkout?.participants.find(p => p.user.id === s.user_id);
            if(user){
                var sampleTime = new Date(Date.parse(s.sample_time));
                user?.samples.push({s_id: s.sample_id, sample_time: sampleTime, position_lat: s.position_lat, position_lon: s.position_lon});
                user?.coordinates.push({latitude:s.position_lat, longitude: s.position_lon});
            
                if(this.lastSample < sampleTime) this.lastSample=sampleTime;
            }
        }
    }
}
