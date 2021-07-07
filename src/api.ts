import axios from 'axios';
import { apiUrl } from '@/env';
import {
  IUserProfile,
  IUserProfileUpdate,
  IUserProfileCreate,
  ICryptobot,
} from './interfaces';

function authHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export const api = {
  async logInGetToken(username: string, password: string) {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    return axios.post(`${apiUrl}/api/v1/login/access-token`, params);
  },
  async getMe(token: string) {
    return axios.get<IUserProfile>(`${apiUrl}/api/v1/users/me`, authHeaders(token));
  },
  async updateMe(token: string, data: IUserProfileUpdate) {
    return axios.put<IUserProfile>(`${apiUrl}/api/v1/users/me`, data, authHeaders(token));
  },
  async getUsers(token: string) {
    return axios.get<IUserProfile[]>(`${apiUrl}/api/v1/users/`, authHeaders(token));
  },
  async updateUser(token: string, userId: string, data: IUserProfileUpdate) {
    return axios.put(`${apiUrl}/api/v1/users/${userId}`, data, authHeaders(token));
  },
  async createUser(token: string, data: IUserProfileCreate) {
    return axios.post(`${apiUrl}/api/v1/users/`, data, authHeaders(token));
  },
  async removeUser(token: string, userId: string) {
    return axios.delete(`${apiUrl}/api/v1/users/${userId}`, authHeaders(token));
  },
  async passwordRecovery(email: string) {
    return axios.post(`${apiUrl}/api/v1/password-recovery/${email}`);
  },
  async resetPassword(password: string, token: string) {
    return axios.post(`${apiUrl}/api/v1/reset-password/`, {
      new_password: password,
      token,
    });
  },
  async getCryptobots(token: string) {
    return axios.get<ICryptobot[]>(`${apiUrl}/api/v1/cryptobots/`, authHeaders(token));
  },
  async getCryptobot(token: string, cryptobotId: string) {
    return axios.get<ICryptobot>(`${apiUrl}/api/v1/cryptobots/${cryptobotId}`, authHeaders(token));
  },
  async createCryptobot(token: string, data: ICryptobot) {
    const userId = data.user_id;
    delete data.user_id;
    return axios.post(`${apiUrl}/api/v1/cryptobots/`,
      data, authHeaders(token));
  },
  async updateCryptobot(token: string, data: ICryptobot, cryptobotId: string) {
    return axios.put(`${apiUrl}/api/v1/cryptobots/${cryptobotId}`,
      data, authHeaders(token));
  },
  async removeCryptobot(token: string, cryptobotId: string) {
    return axios.delete(`${apiUrl}/api/v1/cryptobots/${cryptobotId}`, authHeaders(token));
  },
  async register(data) {
    return axios.post(`${apiUrl}/api/v1/users/open`, data);
  },
};
