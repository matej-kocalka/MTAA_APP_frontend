// @ts-nocheck
import RNFS from 'react-native-fs';
import axios from 'axios';
import { Buffer } from 'buffer';
import { API_URL } from '@/constants/api';

const FormData = global.FormData;

/**
 * Downloads the user's profile picture from the backend and saves it locally.
 * 
 * @function downloadProfilePicture
 * @param {string} token - The user's authentication token.
 * @param {string} filename - The filename for the saved image.
 * @returns A Promise resolving to the Axios response object.
 */
export const downloadProfilePicture = async (token, filename) => {
  const PROFILE_PIC_PATH = `${RNFS.DocumentDirectoryPath}/${filename}.jpg`;
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

/**
 * Uploads a new profile photo for the user.
 * 
 * @function changePhoto
 * @param {string} token - The user's authentication token.
 * @param {{uri: string}} image - Image object containing the URI to the local image file.
 * @returns A Promise resolving to the Axios response object.
 * @throws Will throw an error if the upload fails.
 */
export const changePhoto = async (token, image) => {
  try {
    const formData = new FormData();
    console.log(image.uri);
    formData.append("image", {
      uri: image.uri,
      type: "image/jpeg",
      name: "profile"
    });

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      transformRequest: () => {
        return formData;
      },
    };

    await axios.patch(`${API_URL}/user/change/photo`, formData, config)
  } catch (error) {
    console.error('Error uploading photo:', error.response.data);
    throw error;
  }
};


/**
 * Deletes the user profile given the correct password.
 * 
 * @function deleteUserProfile
 * @param {string} token - The user's authentication token.
 * @param {string} password - The user's password required for verification.
 * @returns A Promise resolving to the Axios response object.
 */
export const deleteUserProfile = async (token, password) => {
  try {
    console.log(token)
    const response = await axios.delete(`${API_URL}/user/change/delete`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      data: {
        password,
      },
    });
    return response;
  } catch (e) {
    console.log(e.response?.data || e.message);
  }
};