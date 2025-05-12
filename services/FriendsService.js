import RNFS from 'react-native-fs';
import axios from 'axios';
import { Buffer } from 'buffer';
import { API_URL } from '@/constants/api';

// const PROFILE_PIC_PATH = `${RNFS.DocumentDirectoryPath}/images/profile.jpg`;

export const getFriendList = async (token) => {
  const response = await axios.get(`${API_URL}/friends/get`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export const removeFriend = async (token, friend_id) => {
  const response = await axios.delete(`${API_URL}/friends/remove`, { friend_id }, {
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
}

export const getFriendProfile = async (token, friend_id) => {
  const response = await axios.post(`${API_URL}/friends/get`, { friend_id }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  return response.data;
}

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

// export const getProfilePicturePath = (filename) => 'file://' + `${RNFS.DocumentDirectoryPath}/images/${filename}.jpg`;

export const createFriendRequest = async (token, email) => {
  const response = await axios.post(`${API_URL}/friends/request/create`, { email }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  return response.data;
}

export const getFriendRequests = async (token) => {
  const response = await axios.get(`${API_URL}/friends/request/get`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export const acceptFriendRequest = async (token, friend_id) => {
  const response = await axios.patch(`${API_URL}/friends/request/accept`, { friend_id }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  return response.data;
}

export const rejectFriendRequest = async (token, friend_id) => {
  const response = await axios.delete(`${API_URL}/friends/request/reject`, {
    data: { friend_id },
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  return response.data;
}