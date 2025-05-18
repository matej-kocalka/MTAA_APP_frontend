import AuthService from '@/services/AuthService';
import User from '@/models/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WorkoutService from '@/services/WorkoutService';

/**
 * A class for managing user authentication state and persistence.
 */
export class AuthManager {
  private user: User | null = null;
  private token: string | null = null;

  /**
   * Logs in a user with the given credentials.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns A Promise that resolves to a User object on success.
   */
  async login(email: string, password: string): Promise<User> {
    const data = await AuthService.login(email, password);
    const user_info = await AuthService.getUser(data.token);
    this.user = new User(user_info.user_id, user_info.email, user_info.user_name, data.token);
    this.token = data.token;
    WorkoutService.setToken(data.token);
    await AsyncStorage.setItem('user', JSON.stringify(this.user));
    return this.user;
  }

  /**
  * Registers a new user.
  *
  * @param email - The user's email.
  * @param password - The user's password.
  * @returns A Promise that resolves to `true` if registration succeeded.
  */
  async register(email: string, password: string): Promise<boolean> {
    const result = await AuthService.register(email, password);
    return result.status == 201;
  }

  /**
   * Logs out the current user and removes user data from local storage.
   */
  async logout() {
    this.user = null;
    await AsyncStorage.removeItem('user');
  }

  /**
   * Retrieves the current user if one is logged in.
   *
   * @returns The current user or `null` if not logged in.
   */
  getCurrentUser(): User | null {
    return this.user;
  }

  /**
   * Checks if a user is logged in by reading from local storage and verifying with the backend.
   *
   * @returns A Promise that resolves to a User object or `null` if not logged in or expired.
   */
  async checkLoggedInUser(): Promise<User | null> {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      if (jsonValue !== null) {
        const user = JSON.parse(jsonValue);
        this.user = user;
        try {
          await AuthService.getUser(user.token)
          return user;
        } catch (e: any) {
          if (e.response) {
            if (e.response.status) {
              alert("Login expired")
              return null;
            }
          }
          return user;
        }
      } else {
        return null;
      }
    } catch (e) {
      console.error('Error reading user from AsyncStorage', e);
      return null;
    }
  }

  /**
  * Updates the locally stored user information from the server.
  */
  async updateUser() {
    if (this.user) {
      const user_info = await AuthService.getUser(this.user.token);
      this.user.id = user_info.user_id;
      this.user.email = user_info.email;
      this.user.username = user_info.user_name;
    }
  }

  /**
     * Retrieves the current authentication token.
     *
     * @returns The token string or `null` if not set.
     */
  getToken(): string | null {
    return this.token;
  }
}

export default new AuthManager();
