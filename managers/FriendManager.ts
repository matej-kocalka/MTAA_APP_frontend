import { Friend } from "@/app/(tabs)/friendsList";
import User from "@/models/User";
import Workout from "@/models/Workout";
import WorkoutParticipant from "@/models/WorkoutParticipant";
import { createFriendRequest, getFriendList, acceptFriendRequest, rejectFriendRequest, getFriendRequests, removeFriend, getFriendProfilePicture } from "@/services/FriendsService"
import WorkoutService from "@/services/WorkoutService";

/**
 * Manages friend-related functionality such as sending requests,
 * accepting/rejecting requests, listing friends, and retrieving workouts.
 */
export default class FriendManager {
    /** List of friends. */
    private friendList: User[] = [];
    /** List of friend requests. */
    private friendRequestList: User[] = [];
    /** The currently opened/selected friend. */
    public openedFriend: Friend | null = null;

    /**
   * Retrieves the user's friend list from the server.
   * @param currentUser - The currently logged-in user.
   * @returns A Promise that resolves to an array of User objects.
   */
    async getFriends(currentUser: User) {
        type friendListRequest = {
            email: string;
            user_id: number;
            user_name: string;
        };
        const list: friendListRequest[] = await getFriendList(currentUser!.token);
        this.friendList.length = 0;
        for (let i = 0; i < list.length; i++) {
            this.friendList.push(new User(list[i].user_id, list[i].email, list[i].user_name, ""))
        }
        return this.friendList;
    }

    /**
   * Retrieves the list of incoming friend requests.
   * @param currentUser - The currently logged-in user.
   * @returns A Promise that resolves to an array of User objects representing request senders.
   */
    async getRequests(currentUser: User) {
        type friendListRequest = {
            user_id: number;
            user_name: string;
            email: string;
        };
        const list: friendListRequest[] = await getFriendRequests(currentUser!.token);
        this.friendRequestList.length = 0;
        for (let i = 0; i < list.length; i++) {
            this.friendRequestList.push(new User(list[i].user_id, list[i].email, list[i].user_name, ""))
        }
        return this.friendRequestList;
    }

    /**
   * Sends a friend request to another user.
   * @param currentUser - The currently logged-in user.
   * @param friendsEmail - The email of the user to add as a friend.
   */
    async addFriends(currentUser: User, friendsEmail: string) {
        createFriendRequest(currentUser.token, friendsEmail);
    }

    /**
   * Removes an existing friend.
   * @param currentUser - The currently logged-in user.
   * @param friendId - The ID of the friend to remove.
   */
    async removeFriend(currentUser: User, friendId: number) {
        removeFriend(currentUser.token, friendId);
    }

    /**
   * Accepts a friend request.
   * @param currentUser - The currently logged-in user.
   * @param friendId - The ID of the friend whose request is being accepted.
   */
    async acceptRequest(currentUser: User, friendId: number) {
        acceptFriendRequest(currentUser.token, friendId);
    }

    /**
     * Rejects a friend request.
     * @param currentUser - The currently logged-in user.
     * @param friendId - The ID of the friend whose request is being rejected.
     */
    async rejectRequest(currentUser: User, friendId: number) {
        rejectFriendRequest(currentUser.token, friendId);
    }

    /**
   * Retrieves the workouts associated with the currently opened friend.
   * @returns A Promise that resolves to an array of Workout objects.
   */
    async getWorkouts() {
        const result = await WorkoutService.getListFriend(this.openedFriend!.id);
        var workouts: Workout[] = []
        if (result.status == 200) {
            for (var w of result.data.workouts) {
                workouts.push(new Workout(w.workout_id, w.workout_name, new Date(Date.parse(w.workout_start)), [new WorkoutParticipant(new User(this.openedFriend!.id, this.openedFriend!.email, this.openedFriend!.name, ""), w.total_distance, w.avg_speed, w.max_speed, 0, 0, [], [], [])]));
            }
        }
        return workouts;
    }

    /**
  * Retrieves the profile picture URL for a specific friend.
  * @param currentUser - The currently logged-in user.
  * @param friendId - The friend's user ID.
  * @returns {Promise<string|null>} Local path to the saved profile picture or null on failure.
  */
    async getFriendsProfilePicture(currentUser: User, friendId: number) {
        return getFriendProfilePicture(currentUser.token, friendId);
    }
}