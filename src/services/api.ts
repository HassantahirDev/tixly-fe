import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://52.21.157.46:3000'; 

// Types
export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: 'USER' | 'ORGANIZER';
}

export   function hasUserId(like: unknown): like is { userId: string } {
    return (
      typeof like === 'object' &&
      like !== null &&
      'userId' in like &&
      typeof (like as { userId: unknown }).userId === 'string'
    );
  }

  export   const getCurrentUserId = (): string | null => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return null;
  
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        console.log('firstN32321', decodedPayload.sub);
        return decodedPayload.sub;
      } catch (error) {
        console.error('Failed to parse token:', error);
        return null;
      }
    };

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

  createComment: (data: { content: string; eventId: string }) =>
    api.post('/events/comments', data),

  getTopEventsByLocation: (location: string, limit: number = 10) =>
    api.post(
      `/events/top-by-location`,
      {},
      {
        params: {
          location,
          limit,
        },
      }
    ),
  getEventById: (id: string) => api.get(`/events/${id}`),

  getCommentsByEventId: (eventId: string) =>
    api.get(`/events/${eventId}/comments`),

  // New API to create a reply to a comment
  createReplyToComment: (
    commentId: string,
    data: { content: string; commentId: string }
  ) => api.post(`/events/comments/${commentId}/replies`, data),

  // New API to toggle like on a comment
  toggleCommentLike: (commentId: string) =>
    api.post(`/events/comments/${commentId}/like`),

  // New API to toggle like on a reply
  toggleReplyLike: (replyId: string) =>
    api.post(`/events/replies/${replyId}/like`),
};



export default api; 