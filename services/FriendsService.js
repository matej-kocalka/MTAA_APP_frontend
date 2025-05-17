import RNFS from 'react-native-fs';
import axios from 'axios';
import { Buffer } from 'buffer';
import { API_URL } from '@/constants/api';

/**
 * Retrieves the authenticated user's friend list.
 * @param {string} token - The user's authentication token.
 * @returns A Promise resolving to the Axios response object.
 */
export const getFriendList = async (token) => {
  const response = await axios.get(`${API_URL}/friends/get`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Removes a friend by ID.
 * @param {string} token - The user's authentication token.
 * @param {number} friend_id - The ID of the friend to remove.
 * @returns A Promise resolving to the Axios response object.
 */
export const removeFriend = async (token, friend_id) => {
  const response = await axios.delete(`${API_URL}/friends/remove`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: { friend_id },
  });

  return response.data;
};

/**
 * Gets the profile data of a friend.
 * @param {string} token - The user's authentication token.
 * @param {number} friend_id - The ID of the friend.
 * @returns A Promise resolving to the Axios response object.
 */
export const getFriendProfile = async (token, friend_id) => {
  const response = await axios.post(`${API_URL}/friends/get`, { friend_id }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  return response.data;
};

/**
 * Downloads and saves a friend's profile picture locally.
 * @param {string} token - The user's authentication token.
 * @param {number} friend_id - The friend's ID.
 * @returns {Promise<string|null>} Local path to the saved profile picture or null on failure.
 */
export const getFriendProfilePicture = async (token, friend_id) => {
  const PROFILE_PIC_PATH = `${RNFS.DocumentDirectoryPath}/${friend_id}.jpg`;
  try {
    const response = await axios.get(`${API_URL}/user/get/photo`, {
      responseType: 'arraybuffer',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    await RNFS.writeFile(PROFILE_PIC_PATH, base64Image, 'base64');

    console.log('Profile picture saved to:', PROFILE_PIC_PATH);
    return 'file://' + PROFILE_PIC_PATH;
  } catch (error) {
    return null;
  }
};

/**
 * Creates a new friend request by email.
 * @param {string} token - The user's authentication token.
 * @param {string} email - The email address of the user to friend.
 * @returns A Promise resolving to the Axios response object.
 */
export const createFriendRequest = async (token, email) => {
  const response = await axios.post(`${API_URL}/friends/request/create`, { email }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  return response.data;
};

/**
 * Fetches incoming friend requests.
 * @param {string} token - The user's authentication token.
 * @returns A Promise resolving to the Axios response object.
 */
export const getFriendRequests = async (token) => {
  const response = await axios.get(`${API_URL}/friends/request/get`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Accepts a friend request.
 * @param {string} token - The user's authentication token.
 * @param {number} friend_id - The ID of the friend request to accept.
 * @returns A Promise resolving to the Axios response object.
 */
export const acceptFriendRequest = async (token, friend_id) => {
  const response = await axios.patch(`${API_URL}/friends/request/accept`, { friend_id }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  return response.data;
};

/**
 * Rejects a friend request.
 * @param {string} token - The user's authentication token.
 * @param {number} friend_id - The ID of the friend request to reject.
 * @returns A Promise resolving to the Axios response object.
 */
export const rejectFriendRequest = async (token, friend_id) => {
  const response = await axios.delete(`${API_URL}/friends/request/reject`, {
    data: { friend_id },
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  return response.data;
};

/**
 * Downloads a friend's profile picture and saves it locally.
 * @param {string} token - The user's authentication token.
 * @param {number} friend_id - The friend's ID.
 * @returns {Promise<string|null>} Local path to the saved profile picture or null on failure.
 */
export const downloadFriendsProfilePicture = async (token, friend_id) => {
  const PROFILE_PIC_PATH = `${RNFS.DocumentDirectoryPath}/${friend_id}.jpg`;
  try {
    const response = await axios.post(`${API_URL}/friends/getphoto`,
      { friend_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    await RNFS.writeFile(PROFILE_PIC_PATH, base64Image, 'base64');

    return 'file://' + PROFILE_PIC_PATH;
  } catch (error) {
    return null;
  }
};
