import AuthService from '@/services/AuthService';
import User from '@/models/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WorkoutService from '@/services/WorkoutService';
import { use } from 'react';

class AuthManager {
  private user: User | null = null;
  private token: string | null = null;

  async login(email: string, password: string): Promise<User> {
    const data = await AuthService.login(email, password);
    const user_info = await AuthService.getUser(data.token);
    this.user = new User(user_info.user_id, user_info.email, user_info.user_name, data.token);
    this.token = data.token;
    WorkoutService.setToken(data.token);
    await AsyncStorage.setItem('user', JSON.stringify(this.user));
    return this.user;
  }

  async register(email: string, password: string): Promise<boolean> {
    const result = await AuthService.register(email, password);
    return result.status == 201;
  }

  async logout() {
    this.user = null;
    await AsyncStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    return this.user;
  }

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

  async updateUser() {
    if (this.user) {
      const user_info = await AuthService.getUser(this.user.token);
      this.user.id = user_info.user_id;
      this.user.email = user_info.email;
      this.user.username = user_info.user_name;
    }
  }

  getToken(): string | null {
    return this.token;
  }
}

export default new AuthManager();
