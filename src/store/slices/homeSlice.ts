import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { homeApi } from '@/src/services/api';

interface Event {
  id: string;
  title: string;
  description: string;
  attachment: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  location: string;
  price: number;
  ageLimit: number;
  highlights: string[];
  organizerId: string;
  approvedByAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  eventCategoryId: string;
  comments: {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string;
      profilePic: string;
    };
    eventId: string;
    replies: {
      id: string;
      content: string;
      createdAt: string;
      updatedAt: string;
      user: {
        id: string;
        name: string;
        profilePic: string;
      };
      commentId: string;
    }[];
  }[];
  favorites: {
    id: string;
    createdAt: string;
    userId: string;
    eventId: string;
  }[];
  _count: {
    comments: number;
    favorites: number;
    TicketsPayment: number;
  };
  organizer: {
    name: string;
    profilePic: string;
  };
  EventCategory: {
    name: string;
    attachment: string;
  };
  popularityScore: number;
}

interface EventCategory {
  id: string;
  name: string;
  attachment: string;
  createdAt: string;
  updatedAt: string;
  events: Event[];
}

interface CategoriesResponse {
  success: boolean;
  data: EventCategory[];
  message: string;
}

interface HomeState {
  categories: CategoriesResponse | null;
  loading: boolean;
  error: string | null;
  featuredEvents: Event[] | null;
  featuredEventsLoading: boolean;
  featuredEventsError: string | null;
}

const initialState: HomeState = {
  categories: null,
  loading: false,
  error: null,
  featuredEvents: null,
  featuredEventsLoading: false,
  featuredEventsError: null,
};

export const fetchEventCategories = createAsyncThunk(
  'home/fetchEventCategories',
  async () => {
    const response = await homeApi.getEventCategories();
    return response.data;
  }
);

export const fetchFeaturedEvents = createAsyncThunk(
  'home/fetchFeaturedEvents',
  async () => {
    const response = await homeApi.getFeaturedEvents();
    return response.data;
  }
);

export const createComment = createAsyncThunk(
  'home/createComment',
  async (data: { content: string; eventId: string }) => {
    const response = await homeApi.createComment(data);
    return response.data;
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchEventCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(fetchFeaturedEvents.pending, (state) => {
        state.featuredEventsLoading = true;
        state.featuredEventsError = null;
      })
      .addCase(fetchFeaturedEvents.fulfilled, (state, action) => {
        state.featuredEventsLoading = false;
        state.featuredEvents = action.payload.data;
      })
      .addCase(fetchFeaturedEvents.rejected, (state, action) => {
        state.featuredEventsLoading = false;
        state.featuredEventsError = action.error.message || 'Failed to fetch featured events';
      })
      .addCase(createComment.fulfilled, (state, action) => {
        if (state.featuredEvents) {
          const eventIndex = state.featuredEvents.findIndex(
            event => event.id === action.payload.eventId
          );
          if (eventIndex !== -1) {
            state.featuredEvents[eventIndex].comments.unshift(action.payload);
            state.featuredEvents[eventIndex]._count.comments += 1;
          }
        }
      });
  },
});

export default homeSlice.reducer; 