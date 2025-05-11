import axios from 'axios';
import { API_URL } from '@/constants/api';
import useAuth from "@/hooks/useAuth";
import WorkoutDataSample from "@/models/WorkoutDataSample";

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
        const params = JSON.stringify({
            "workout_id": workout_id,
            "samples": samples
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
        console.log(params);
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
        return response.data;
    }

    async updateParticipantData() {
    }

    async getList() {
        const response = await axios.get(`${API_URL}/workout/getList`, {
            headers: {
            Authorization: `Bearer ${this.token}`,
            },
        });
        return response.data;
    }

    async getData(workout_id: number, from_sample: number) {
        const params = JSON.stringify({
            "workout_id": workout_id,
            "from_sample": from_sample
        });
        const response = await axios.get(`${API_URL}/workout/getData`, {
            headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
            },
        });
        return response.data;
    }

    async deleteWorkout(workout_id: number) {
        const params = JSON.stringify({
            "workout_id": workout_id,
        });
        const response = await axios.delete(`${API_URL}/workout/deleteWorkout`, {
            headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
            },
        });
        return response.data;
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
        return response.data;
    }

    async unshareWorkout(workout_id: number, shared_user_id: number) {
        const params = JSON.stringify({
            "workout_id": workout_id,
            "shared_user_id": shared_user_id
        });
        const response = await axios.delete(`${API_URL}/workout/unshareWorkout`, {
            headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
            },
        });
        return response.data;
    }

}

export default new WorkoutService();
