import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi, LoginData, SignUpData, VerifyOtpData, SendOtpData, updatePasswordData } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  email: string;
  name?: string;
  username?: string;
  role: 'USER' | 'ORGANIZER';
  profilePic?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userRole: 'USER' | 'ORGANIZER' | null;
  isVerified: boolean;
  deletingUser: boolean;
  deleteUserError: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  userRole: null,
  isVerified: false,
  deletingUser: false,
deleteUserError: null,

};

// Async Thunks
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (data: SignUpData, { rejectWithValue }) => {
    try {
      const response = await authApi.signUp(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Sign up failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await authApi.login(data);
      console.log("response.data", response.data);
      await AsyncStorage.setItem('token', response.data.data.access_token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (data: VerifyOtpData, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyOtp(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
    }
  }
);

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (data: SendOtpData, { rejectWithValue }) => {
    try {
      const response = await authApi.sendOtp(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (data: updatePasswordData, { rejectWithValue }) => {
    try {
      const response = await authApi.updatePassword(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update password');
    }
  }
);

export const updateUserById = createAsyncThunk(
  'auth/updateUserById',
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: { email?: string; name?: string; username?: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authApi.updateUserById(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update user'
      );
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'auth/fetchUserById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await authApi.getUserById(id);
      return response.data;
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        return rejectWithValue(
          err.response?.data?.message || 'Failed to fetch user'
        );
      }
      return rejectWithValue('Failed to fetch user');
    }
  }
);

export const deleteUserById = createAsyncThunk(
  'home/deleteUserById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await authApi.deleteUserById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete user'
      );
    }
  }
);



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserRole: (state, action: PayloadAction<'USER' | 'ORGANIZER'>) => {
      state.userRole = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.userRole = null;
      state.isVerified = false;
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('userRole');
    },
  },
  extraReducers: (builder) => {
    // Sign Up
    builder.addCase(signUp.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signUp.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      console.log('action.payload.token', action.payload);
      state.token = action.payload.data.access_token;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Verify OTP
    builder.addCase(verifyOtp.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(verifyOtp.fulfilled, (state) => {
      state.isLoading = false;
      state.isVerified = true;
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Send OTP
    builder.addCase(sendOtp.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(sendOtp.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(sendOtp.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update Password
    builder.addCase(updatePassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updatePassword.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(updatePassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update User by ID
    builder.addCase(updateUserById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUserById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = { ...state.user, ...action.payload }; // merge updated fields
    });
    builder.addCase(updateUserById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    })

    builder.addCase(fetchUserById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.data;
    });
    builder.addCase(fetchUserById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    })

    builder.addCase(deleteUserById.pending, (state) => {
      state.deletingUser = true;
      state.deleteUserError = null;
    })
    builder.addCase(deleteUserById.fulfilled, (state) => {
      state.deletingUser = false;
    })
    builder.addCase(deleteUserById.rejected, (state, action) => {
      state.deletingUser = false;
      state.deleteUserError = action.payload as string;
    })
    
    
  },
});

export const { setUserRole, logout } = authSlice.actions;
export default authSlice.reducer; 