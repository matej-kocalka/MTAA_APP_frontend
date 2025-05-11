import RNFS from 'react-native-fs';
import axios from 'axios';
import { Buffer } from 'buffer';
import { API_URL } from '@/constants/api';

// const PROFILE_PIC_PATH = `${RNFS.DocumentDirectoryPath}/images/profile.jpg`;

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

export const getProfilePicturePath = (filename) => 'file://' + `${RNFS.DocumentDirectoryPath}/images/${filename}.jpg`;
