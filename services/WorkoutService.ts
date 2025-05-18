import axios from 'axios';
import { API_URL } from '@/constants/api';
import WorkoutDataSample from "@/models/WorkoutDataSample";
import WorkoutParticipant from '@/models/WorkoutParticipant';

/**
 * A service class for handling workout-related API operations, including
 * creation, data upload, participant management, sharing, and deletion.
 */
export class WorkoutService {
    /** The user's authentication token. */
    private token = "";
    /** Username */
    public username = "";
    /** Password */
    public pass = "";

    /**
     * Sets the user's authentication token for all API requests.
     * @param {string} token - The JWT or bearer token to authorize API requests.
     */
    setToken(token: any) {
        this.token = token;
    }

    /**
    * Formats a `Date` object into `DD-MM-YYYY HH:mm:ss` format.
    * @param {Date} date - The date to format.
    * @returns {string} The formatted date string.
    */
    DateToString(date: Date) {
        return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }

    /**
    * Uploads a list of workout data samples to the backend.
    * @param {number} workout_id - The workout ID.
    * @param {WorkoutDataSample[]} samples - Array of data samples to upload.
    * @returns {Promise<number>} The HTTP status code of the response.
    */
    async uploadData(workout_id: number, samples: WorkoutDataSample[]) {
        const samplesArray = [];
        for (var s of samples) {
            samplesArray.push({ sample_time: this.DateToString(s.sample_time), position_lat: s.position_lat, position_lon: s.position_lon });
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

    /**
     * Creates a new workout with the specified name and start time.
     * @param {string} workout_name - The name of the workout.
     * @param {Date} workout_start - The start time of the workout.
     * @returns {Promise<import('axios').AxiosResponse>} A Promise of Axios response object.
     */
    async createWorkout(workout_name: string, workout_start: Date) {
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

    /**
     * Adds a participant to a workout.
     * @param {number} workout_id - The ID of the workout.
     * @param {string} participant_email - The participant's email.
     * @returns {Promise<import('axios').AxiosResponse>} A Promise of Axios response object.
     */
    async addParticipant(workout_id: number, participant_email: string) {
        const params = JSON.stringify({
            "workout_id": workout_id,
            "participant_email": participant_email
        });
        const response = await axios.put(`${API_URL}/workout/addParticipant`, params, {
            headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json"
            },
        });
        return response;
    }

    /**
     * Updates participant workout statistics.
     * @param {number} workout_id - The workout ID.
     * @param {WorkoutParticipant} participant - Participant data.
     * @returns {Promise<import('axios').AxiosResponse>} A Promise of Axios response object.
     */
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

    /**
     * Retrieves the list of workouts for the authenticated user.
     * @returns {Promise<import('axios').AxiosResponse>} A Promise of Axios response object.
     */
    async getList() {
        const response = await axios.get(`${API_URL}/workout/getList`, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });
        return response;
    }

    /**
     * Retrieves the list of workouts for a specific friend.
     * @param {number} friend_id - The friend's user ID.
     * @returns {Promise<import('axios').AxiosResponse>} A Promise of Axios response object.
     */
    async getListFriend(friend_id: number) {
        const response = await axios.get(`${API_URL}/workout/getListFriend/${friend_id}`, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });
        return response;
    }

    /**
     * Retrieves workout data starting from a specific sample index.
     * @param {number} workout_id - Workout ID.
     * @param {number} from_sample - Index of the starting sample.
     * @returns {Promise<import('axios').AxiosResponse>} A Promise of Axios response object.
     */
    async getData(workout_id: number, from_sample: number) {
        const response = await axios.get(`${API_URL}/workout/getData/${workout_id}:${from_sample}`, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });
        return response;
    }

    /**
     * Deletes a workout by ID.
     * @param {number} workout_id - Workout ID to delete.
     * @returns {Promise<import('axios').AxiosResponse>} A Promise of Axios response object.
     */
    async deleteWorkout(workout_id: number) {
        const response = await axios.delete(`${API_URL}/workout/deleteWorkout/${workout_id}`, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });
        return response;
    }

    /**
     * Shares a workout with another user.
     * @param {number} workout_id - ID of the workout to share.
     * @param {string} shared_user_email - Email of the user to share with.
     * @returns {Promise<import('axios').AxiosResponse>} A Promise of Axios response object.
     */
    async shareWorkout(workout_id: number, shared_user_email: string) {
        const params = JSON.stringify({
            "workout_id": workout_id,
            "shared_user_email": shared_user_email
        });
        const response = await axios.put(`${API_URL}/workout/shareWorkout`, params, {
            headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json"
            },
        });
        return response;
    }

    /**
     * Unshares a workout from a user.
     * @param {number} workout_id - Workout ID to unshare.
     * @param {string} shared_user_email - Email of the user to unshare with.
     * @returns {Promise<import('axios').AxiosResponse>} A Promise of Axios response object.
     */
    async unshareWorkout(workout_id: number, shared_user_email: string) {
        const response = await axios.delete(`${API_URL}/workout/unshareWorkout/${workout_id}:${shared_user_email}`, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });
        return response;
    }

}

export default new WorkoutService();
