import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:2000'; 

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
  updatePassword: (data: updatePasswordData) =>
    api.post('/auth/update-password', data),
  updateUserById: (
    id: string,
    data: { email?: string; name?: string; username?: string }
  ) => api.put(`/user/${id}`, data),
  getUserById: (id: string) => api.get(`/user/${id}`),
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

  createReplyToComment: (
    commentId: string,
    data: { content: string; commentId: string }
  ) => api.post(`/events/comments/${commentId}/replies`, data),

  toggleCommentLike: (commentId: string) =>
    api.post(`/events/comments/${commentId}/like`),

  toggleReplyLike: (replyId: string) =>
    api.post(`/events/replies/${replyId}/like`),

  getBankDetailsByOrganizerId: (id: string, bankName?: string) =>
    api.get(`/bankDetails/organizer/${id}`, {
      params: bankName ? { bankName } : {},
    }),
};


export const eventsPayment = {
  uploadSingleImage: (formData: FormData) =>
    api.post('/image/upload/single', formData),

  createTicketsPayment: (data: {
    screenshotUrl: string;
    quantity: number;
    eventId: string;
    qrCodeUrl?: string;
  }) => api.post('/ticketsPayment', data),
};


export default api; 
