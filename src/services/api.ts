import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:2000/'; // Replace with your actual API URL

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
  // No static headers here; handled in interceptor
});

// Add token to requests if available
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    // Only set Content-Type for non-FormData requests
    if (!(config.data instanceof FormData)) {
      config.headers.set('Content-Type', 'application/json');
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
  createComment: (data: { content: string; eventId: string }) => api.post('/events/comments', data),
  getUpcomingEvents: () => api.get('/events/upcoming'),
  getOngoingEvents: () => api.get('/events/ongoing'),
  getAllEvents: () => api.get('/events'), // <-- Added for admin events page
  getEventById: (id: string) => api.get(`/events/${id}`), // <-- Added for event details page
};

export const imageApi = {
  uploadSingleImage: async (file: File | { uri: string; name: string; type: string }) => {
    const formData = new FormData();
    // Use a runtime check for File constructor existence and file type
    const isWebFile = typeof File !== 'undefined' && file instanceof File;
    if (isWebFile) {
      formData.append('image', file as File);
    } else {
      // React Native: append as object with uri, name, type
      formData.append('image', file as { uri: string; name: string; type: string });
    }
    return api.post('/image/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteSingleImage: (publicId: string) => api.delete(`/image/delete/single/${publicId}`),
};

export const categoryApi = {
  createCategory: (data: { name: string; desc?: string; attachment?: string }) =>
    api.post('/eventCategory', data),
  updateCategory: (id: string, data: { name: string; desc?: string; attachment?: string }) =>
    api.put(`/eventCategory/${id}`, data),
};

// User API methods
export const userApi = {
  getUserById: (id: string) => api.get(`/user/${id}`),
  updateUserById: (id: string, data: { email: string; name: string; username: string; profilePic?: string }) =>
    api.put(`/user/${id}`, data),
};

export default api;