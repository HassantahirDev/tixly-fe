import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import homeReducer from './slices/homeSlice';
import eventPaymentReducer from './slices/eventPaymentSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    home: homeReducer,
    eventPayment: eventPaymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
