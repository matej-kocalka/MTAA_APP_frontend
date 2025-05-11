import useAuth from "@/hooks/useAuth";
import User from "@/models/User";
import { createFriendRequest, getFriendList, getFriendProfile, acceptFriendRequest, rejectFriendRequest, getFriendRequests } from "@/services/FriendsService"

export default class FriendManager {
    private friendList: User[] = [];
    private friendRequestList: User[] = [];

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

    async addFriends(currentUser: User, friendsEmail: string) {
        createFriendRequest(currentUser.token, friendsEmail);
    }

    async acceptRequest(currentUser: User, friendId: number) {
        acceptFriendRequest(currentUser.token, friendId);
    }

    async rejectRequest(currentUser: User, friendId: number) {
        rejectFriendRequest(currentUser.token, friendId);
    }
}