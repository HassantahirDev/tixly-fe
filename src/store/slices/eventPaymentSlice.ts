import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { eventsPayment } from '@/src/services/api';

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

const eventPayment = createSlice({
  name: 'home',
  initialState: {
    uploadedImageUrl: '',
    uploadImageLoading: false,
    uploadImageError: null as string | null,

    createPaymentLoading: false,
    createPaymentSuccess: false,
    createPaymentError: null as string | null,
  },
  reducers: {},
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
      });

    // Add new ticket payment cases
    builder
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
      });
  },
});


export default eventPayment.reducer; 