import { useEffect } from 'react';
import { Alert, PermissionsAndroid } from 'react-native';
import messaging from "@react-native-firebase/messaging";
import AuthService from '../services/AuthService';
import useAuth from '@/hooks/useAuth';

const requestUserPermission = async () => {
}

const registerToken = async () => {
  try {
  } catch (error) {
    console.error("Failed to get token: ", error);
  }
}

/**
 * Custom React hook to handle notification permissions and Firebase Cloud Messaging (FCM) token registration.
 * - Requests notification permissions on Android.
 * - Retrieves and registers the FCM token with the backend via AuthService.
 * - Listens for incoming FCM messages and displays an alert with the message data.
 * 
 * @function useNotification
 * @returns {() => void} Returns an unsubscribe function to stop listening for FCM messages.
 */
export const useNotification = () => {
  const auth = useAuth();
  useEffect(() => {
    const setup = async () => {
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      if (result === PermissionsAndroid.RESULTS.GRANTED || result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log("granted: ", result);

        const token = await messaging().getToken();
        console.log("FCM Token: ", token);

        await AuthService.registerPushToken(auth.getToken()!, token);

      } else {
        console.log("denied: ", result);
      }
    }

    setup()

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, [])


}