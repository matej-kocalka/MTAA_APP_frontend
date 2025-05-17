import axios from 'axios';
import { API_URL } from '@/constants/api';

/**
 * A service class for handling authentication and user profile operations on the backend.
 */
export class AuthService {
  /**
   * Logs in a user using their email and password.
   * @param email - User's email address.
   * @param password - User's password.
   * @returns A Promise resolving to the Axios response object.
   */
  async login(email: string, password: string): Promise<{ token: string; user_id: string }> {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  }

  /**
   * Registers a new user with email and password.
   * @param email - User's email address.
   * @param password - User's password.
   * @returns A Promise resolving to the Axios response object.
   */
  async register(email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/register`, { email, password });
    return response;
  }

  /**
   * Retrieves user information using a JWT token.
   * @param token - The JWT token.
   * @returns A Promise resolving to the Axios response object.
   */
  async getUser(token: string) {
    const response = await axios.get(`${API_URL}/auth/getuser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  /**
   * Changes the username for the authenticated user.
   * @param token - The JWT token.
   * @param username - The new username.
   * @returns A Promise resolving to the Axios response object.
   */
  async changeUsername(token: string, username: string) {
    const response = await axios.patch(`${API_URL}/user/change/username`, { username }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }

  /**
   * Changes the password for the authenticated user.
   * @param token - The JWT token.
   * @param password - The new password.
   * @returns A Promise resolving to the Axios response object.
   */
  async changePassword(token: string, password: string) {
    const response = await axios.patch(`${API_URL}/user/change/password`, { password }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }

  /**
   * Registers a push notification token for the authenticated user.
   * @param AuthToken - The JWT token for authentication.
   * @param token - The device push token to register.
   * @returns A Promise resolving to the Axios response object.
   */
  async registerPushToken(AuthToken: string, token: string) {
    const response = await axios.post(`${API_URL}/auth/registerToken`, { token }, {
      headers: {
        Authorization: `Bearer ${AuthToken}`
      },
    });
    return response;
  }
}

export default new AuthService();
