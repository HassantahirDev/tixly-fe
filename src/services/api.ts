import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = '/api/'; // Use relative path for proxying via Vercel

// Types
export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: 'USER' | 'ORGANIZER';
}

export interface LoginData {
  email: string;
  password: string;
  role: 'USER' | 'ORGANIZER';
}

export interface VerifyOtpData {
  email: string;
  code: string;
  role: 'USER' | 'ORGANIZER';
}

export interface SendOtpData {
  email: string;
  role: 'USER' | 'ORGANIZER';
}

export interface updatePasswordData {
    email: string;
    password: string;
    role: 'USER' | 'ORGANIZER';
  }

// API instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Auth API methods
export const authApi = {
  signUp: (data: SignUpData) => api.post('/auth/signup', data),
  login: (data: LoginData) => api.post('/auth/login', data),
  verifyOtp: (data: VerifyOtpData) => api.post('/auth/verify', data),
  sendOtp: (data: SendOtpData) => api.post('/auth/send-otp', data),
  updatePassword: (data: updatePasswordData) => api.post('/auth/update-password', data),
};

export const homeApi = {
  getEventCategories: () => api.get('/eventCategory'),
  getFeaturedEvents: () => api.post('/events/top/featured'),
  createComment: (data: { content: string; eventId: string }) => api.post('/events/comments', data)
};

export default api;