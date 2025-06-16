import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { eventsPayment } from '@/src/services/api';

export interface TicketPayment {
  id: string;
  amount: number;
  screenshotUrl: string;
  qrCodeUrl: string;
  quantity: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  userId: string;
  eventId: string;
  Event: {
    id: string;
    title: string;
    description: string;
    attachment: string;
    date: string;
    location: string;
    price: number;
  };
  User: {
    id: string;
    email: string;
    username: string;
    profilePic: string;
    name: string;
  };
}

export const uploadSingleImage = createAsyncThunk(
  'home/uploadSingleImage',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await eventsPayment.uploadSingleImage(formData);
      return response.data;
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response?.data?.message === 'string'
      ) {
        return rejectWithValue((error as any).response.data.message);
      }
      return rejectWithValue('Failed to upload image');
    }
  }
);

export const fetchUserTicketsPayments = createAsyncThunk(
  'tickets/fetchUserTicketsPayments',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await eventsPayment.getUserTicketsPayments(userId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tickets'
      );
    }
  }
);

export const createTicketsPayment = createAsyncThunk(
  'home/createTicketsPayment',
  async (
    data: {
      screenshotUrl: string;
      quantity: number;
      eventId: string;
      qrCodeUrl?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await eventsPayment.createTicketsPayment(data);
      return response.data;
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response?.data?.message === 'string'
      ) {
        return rejectWithValue((error as any).response.data.message);
      }
      return rejectWithValue('Failed to create tickets payment');
    }
  }
);

interface EventPaymentState {
  uploadedImageUrl: string;
  uploadImageLoading: boolean;
  uploadImageError: string | null;
  createPaymentLoading: boolean;
  createPaymentSuccess: boolean;
  createPaymentError: string | null;
  userTickets: TicketPayment[];
  userTicketsLoading: boolean;
  userTicketsError: string | null;
}

const initialState: EventPaymentState = {
  uploadedImageUrl: '',
  uploadImageLoading: false,
  uploadImageError: null,
  createPaymentLoading: false,
  createPaymentSuccess: false,
  createPaymentError: null,
  userTickets: [],
  userTicketsLoading: false,
  userTicketsError: null,
};

const eventPayment = createSlice({
  name: 'home',
  initialState,
  reducers: {
    resetErrors: (state) => {
      state.uploadImageError = null;
      state.createPaymentError = null;
      state.createPaymentSuccess = false;
      state.userTicketsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadSingleImage.pending, (state) => {
        state.uploadImageLoading = true;
        state.uploadImageError = null;
      })
      .addCase(uploadSingleImage.fulfilled, (state, action) => {
        state.uploadImageLoading = false;
        state.uploadedImageUrl = action.payload.url || '';
      })
      .addCase(uploadSingleImage.rejected, (state, action) => {
        state.uploadImageLoading = false;
        state.uploadImageError = action.payload as string;
      })
      .addCase(createTicketsPayment.pending, (state) => {
        state.createPaymentLoading = true;
        state.createPaymentSuccess = false;
        state.createPaymentError = null;
      })
      .addCase(createTicketsPayment.fulfilled, (state) => {
        state.createPaymentLoading = false;
        state.createPaymentSuccess = true;
      })
      .addCase(createTicketsPayment.rejected, (state, action) => {
        state.createPaymentLoading = false;
        state.createPaymentError = action.payload as string;
      })
      .addCase(fetchUserTicketsPayments.pending, (state) => {
        state.userTicketsLoading = true;
        state.userTicketsError = null;
      })
      .addCase(fetchUserTicketsPayments.fulfilled, (state, action) => {
        state.userTicketsLoading = false;
        state.userTickets = action.payload as TicketPayment[];
      })
      .addCase(fetchUserTicketsPayments.rejected, (state, action) => {
        state.userTicketsLoading = false;
        state.userTicketsError = action.payload as string;
      });
  },
});

export const { resetErrors } = eventPayment.actions;
export default eventPayment.reducer;
