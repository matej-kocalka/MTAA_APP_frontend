import AuthService from '@/services/AuthService';
import User from '@/models/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WorkoutService from '@/services/WorkoutService';

class AuthManager {
  private user: User | null = null;
  private token: string | null;

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

  getToken(): string | null{
    return this.token;
  }
}

export default new AuthManager();
