import axios from 'axios';
import { API_URL } from '@/constants/api';
import useAuth from "@/hooks/useAuth";
import WorkoutDataSample from "@/models/WorkoutDataSample";
import WorkoutParticipant from '@/models/WorkoutParticipant';

class WorkoutService {
    private token = "";
    public username = "";
    public pass = "";

    setToken(token){
        this.token = token;
    }

    DateToString(date: Date){
        return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }

    async uploadData(workout_id: number, samples: WorkoutDataSample[]) {
        const samplesArray = [];
        for (var s of samples){
            samplesArray.push({sample_time: this.DateToString(s.sample_time), position_lat: s.position_lat, position_lon: s.position_lon})
        }
        const params = JSON.stringify({
            "workout_id": workout_id,
            "samples": samplesArray
        });
        const response = await axios.post(`${API_URL}/workout/uploadData`, params, {
            headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
            },
        });
        return response.status;
    }

    async createWorkout(workout_name: string, workout_start : Date) {
        const params = JSON.stringify({
            "workout_name": workout_name,
            "workout_start": this.DateToString(workout_start)
        });
        const response = await axios.post(`${API_URL}/workout/createWorkout`, params, {
            headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
            },
        });
        return response;
    }

    async addParticipant(workout_id : number, participant_id: number) {
        const params = JSON.stringify({
            "workout_id": workout_id,
            "participant_id": participant_id
        });
        const response = await axios.put(`${API_URL}/workout/addParticipant`, params, {
            headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
            },
        });
        return response;
    }

    async updateParticipantData(workout_id: number, participant: WorkoutParticipant) {
        const params = JSON.stringify({
            "workout_id": workout_id,
            "total_distance": participant.total_distance,
            "avg_speed": participant.avg_speed,
            "maxSpeed": participant.max_speed
        });
        const response = await axios.put(`${API_URL}/workout/updateParticipantData`, params, {
            headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
            },
        });
        return response;
    }

    async getList() {
        const response = await axios.get(`${API_URL}/workout/getList`, {
            headers: {
            Authorization: `Bearer ${this.token}`,
            },
        });
        return response;
    }

    async getData(workout_id: number, from_sample: number) {
        const response = await axios.get(`${API_URL}/workout/getData/${workout_id}:${from_sample}`, {
            headers: {
            Authorization: `Bearer ${this.token}`,
            },
        });
        return response;
    }

    async deleteWorkout(workout_id: number) {
        const response = await axios.delete(`${API_URL}/workout/deleteWorkout/${workout_id}`, {
            headers: {
            Authorization: `Bearer ${this.token}`,
            },
        });
        return response;
    }

    async shareWorkout(workout_id: number, shared_user_id: number) {
        const params = JSON.stringify({
            "workout_id": workout_id,
            "shared_user_id": shared_user_id
        });
        const response = await axios.put(`${API_URL}/workout/shareWorkout`, params, {
            headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
            },
        });
        return response;
    }

    async unshareWorkout(workout_id: number, shared_user_id: number) {
        const response = await axios.delete(`${API_URL}/workout/unshareWorkout/${workout_id}:${shared_user_id}`, {
            headers: {
            Authorization: `Bearer ${this.token}`,
            },
        });
        return response;
    }

}

export default new WorkoutService();
