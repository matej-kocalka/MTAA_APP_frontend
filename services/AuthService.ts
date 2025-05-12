import axios from 'axios';
import { API_URL } from '@/constants/api';

class AuthService {
  async login(email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data; //returns JWT token and user_id
  }
  async register(email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/register`, { email, password });
    return response;
  }

  async getUser(token: string) {
    const response = await axios.get(`${API_URL}/auth/getuser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;

  }

  async changeUsername(token: string, username: string) {
    const response = await axios.patch(`${API_URL}/user/change/username`, { username }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
  async changePassword(token: string, password: string) {
    const response = await axios.patch(`${API_URL}/user/change/password`, {  password }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
}

export default new AuthService();
