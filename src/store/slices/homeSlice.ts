import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { homeApi } from '@/src/services/api';
import { hasUserId } from '@/src/services/api';
import { getCurrentUserId } from '@/src/services/api';

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
    likes?: { userId: string }[];
    isLiked?: boolean;
    likeCount?: number;
    user: {
      id: string;
      name: string;
      profilePic: string;
    };
    eventId: string;
    replies: {
      id: string;
      content: string;
      likes?: { userId: string }[];
      createdAt: string;
      updatedAt: string;
      isLiked?: boolean;
      likeCount?: number;
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

interface BankDetails {
  id: string;
  organizerId: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

interface BankDetailsResponse {
  success: boolean;
  data: BankDetails[];
  message: string;
}

interface HomeState {
  categories: CategoriesResponse | null;
  loading: boolean;
  error: string | null;
  featuredEvents: Event[] | null;
  featuredEventsLoading: boolean;
  featuredEventsError: string | null;
  topEventsByLocation: Event[] | null;
  topEventsByLocationLoading: boolean;
  topEventsByLocationError: string | null;

  selectedEvent: Event | null;
  selectedEventLoading: boolean;
  selectedEventError: string | null;

  eventComments: Event['comments'] | null;
  eventCommentsLoading: boolean;
  eventCommentsError: string | null;

  creatingReply: boolean;
  createReplyError: string | null;

  togglingCommentLike: boolean;
  toggleCommentLikeError: string | null;

  togglingReplyLike: boolean;
  toggleReplyLikeError: string | null;

  bankDetails: BankDetailsResponse | null;
  bankDetailsLoading: boolean;
  bankDetailsError: string | null;
}

const initialState: HomeState = {
  categories: null,
  loading: false,
  error: null,
  featuredEvents: null,
  featuredEventsLoading: false,
  featuredEventsError: null,
  topEventsByLocation: null,
  topEventsByLocationLoading: false,
  topEventsByLocationError: null,

  selectedEvent: null,
  selectedEventLoading: false,
  selectedEventError: null,

  eventComments: null,
  eventCommentsLoading: false,
  eventCommentsError: null,

  creatingReply: false,
  createReplyError: null,

  togglingCommentLike: false,
  toggleCommentLikeError: null,

  togglingReplyLike: false,
  toggleReplyLikeError: null,

  bankDetails: null,
  bankDetailsLoading: false,
  bankDetailsError: null,
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

export const fetchTopEventsByLocation = createAsyncThunk(
  'home/fetchTopEventsByLocation',
  async ({ location, limit }: { location: string; limit?: number }) => {
    const response = await homeApi.getTopEventsByLocation(
      location,
      limit || 10
    );
    return response.data;
  }
);

export const fetchEventById = createAsyncThunk(
  'home/fetchEventById',
  async (id: string, thunkAPI) => {
    try {
      const response = await homeApi.getEventById(id);
      console.log('first1323231', response.data);
      return response.data.data;
      
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch event'
      );
    }
  }
);

export const fetchCommentsByEventId = createAsyncThunk(
  'home/fetchCommentsByEventId',
  async (eventId: string, { rejectWithValue }) => {
    try {
      const response = await homeApi.getCommentsByEventId(eventId);
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch comments'
      );
    }
  }
);

export const createReplyToComment = createAsyncThunk(
  'home/createReplyToComment',
  async (
    { commentId, content }: { commentId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await homeApi.createReplyToComment(commentId, {
        content,
        commentId,
      });
      return { ...response.data, commentId };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create reply'
      );
    }
  }
);

export const toggleCommentLike = createAsyncThunk(
  'home/toggleCommentLike',
  async (commentId: string, { rejectWithValue }) => {
    try {
      const response = await homeApi.toggleCommentLike(commentId);
      return { commentId, isLiked: response.data.liked };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to like comment'
      );
    }
  }
);

export const toggleReplyLike = createAsyncThunk(
  'home/toggleReplyLike',
  async (replyId: string, { rejectWithValue }) => {
    try {
      const response = await homeApi.toggleReplyLike(replyId);
      return { replyId, isLiked: response.data.liked };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to like reply'
      );
    }
  }
);

export const fetchBankDetailsByOrganizerId = createAsyncThunk(
  'home/fetchBankDetailsByOrganizerId',
  async (
    { id, bankName }: { id: string; bankName?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await homeApi.getBankDetailsByOrganizerId(id, bankName);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bank details'
      );
    }
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
        state.featuredEventsError =
          action.error.message || 'Failed to fetch featured events';
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.eventCommentsLoading = false;
        const newComment = action.payload;
        if (state.eventComments) {
          state.eventComments.unshift(newComment);
        } else {
          state.eventComments = [newComment];
        }
        if (
          state.selectedEvent &&
          state.selectedEvent.id === newComment.eventId
        ) {
          if (state.selectedEvent.comments) {
            state.selectedEvent.comments.unshift(newComment);
          } else {
            state.selectedEvent.comments = [newComment];
          }
          // Initialize _count if undefined and increment comments
          state.selectedEvent._count = state.selectedEvent._count || {
            comments: 0,
            favorites: 0,
            TicketsPayment: 0,
          };
          state.selectedEvent._count.comments += 1;
        }
      })

      .addCase(fetchTopEventsByLocation.pending, (state) => {
        state.topEventsByLocationLoading = true;
        state.topEventsByLocationError = null;
      })
      .addCase(fetchTopEventsByLocation.fulfilled, (state, action) => {
        state.topEventsByLocationLoading = false;
        state.topEventsByLocation = action.payload.data;
      })
      .addCase(fetchTopEventsByLocation.rejected, (state, action) => {
        state.topEventsByLocationLoading = false;
        state.topEventsByLocationError =
          action.error.message || 'Failed to fetch top events by location';
      })

      .addCase(fetchEventById.pending, (state) => {
        state.selectedEventLoading = true;
        state.selectedEventError = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.selectedEventLoading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.selectedEventLoading = false;
        state.selectedEventError = action.payload as string;
      })

      .addCase(fetchCommentsByEventId.pending, (state) => {
        state.eventCommentsLoading = true;
        state.eventCommentsError = null;
        state.eventComments = null;
      })
      .addCase(fetchCommentsByEventId.fulfilled, (state, action) => {
        state.eventCommentsLoading = false;
        state.eventComments = action.payload;
      })
      .addCase(fetchCommentsByEventId.rejected, (state, action) => {
        state.eventCommentsLoading = false;
        state.eventCommentsError = action.payload as string;
      })

      .addCase(createReplyToComment.pending, (state) => {
        state.creatingReply = true;
        state.createReplyError = null;
      })
      .addCase(createReplyToComment.fulfilled, (state, action) => {
        state.creatingReply = false;
        const { commentId, ...newReply } = action.payload;

        // Add reply to eventComments
        if (state.eventComments) {
          const comment = state.eventComments.find((c) => c.id === commentId);
          if (comment) {
            comment.replies = comment.replies || [];
            comment.replies.unshift(newReply);
          }
        }

        // Add reply to selectedEvent.comments if selectedEvent exists
        if (state.selectedEvent && state.selectedEvent.comments) {
          const comment = state.selectedEvent.comments.find(
            (c) => c.id === commentId
          );
          if (comment) {
            comment.replies = comment.replies || [];
            comment.replies.unshift(newReply);
          }
        }
      })
      .addCase(createReplyToComment.rejected, (state, action) => {
        state.creatingReply = false;
        state.createReplyError = action.payload as string;
      })

      // Toggle Comment Like
      .addCase(toggleCommentLike.pending, (state) => {
        state.togglingCommentLike = true;
        state.toggleCommentLikeError = null;
      })
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        state.togglingCommentLike = false;
        const { commentId, isLiked } = action.payload;
        const currentUserId = getCurrentUserId();

        if (currentUserId) {
          // Update eventComments
          if (state.eventComments) {
            const comment = state.eventComments.find((c) => c.id === commentId);
            if (comment) {
              comment.isLiked = isLiked;
              comment.likeCount = comment.likeCount || 0;
              comment.likeCount += isLiked ? 1 : -1;
              comment.likes = comment.likes || [];
              if (isLiked) {
                if (
                  !comment.likes.some(
                    (like) => hasUserId(like) && like.userId === currentUserId
                  )
                ) {
                  comment.likes.push({ userId: currentUserId });
                }
              } else {
                comment.likes = comment.likes.filter(
                  (like) => !hasUserId(like) || like.userId !== currentUserId
                );
              }
            }
          }
          // Update selectedEvent.comments
          if (state.selectedEvent?.comments) {
            const comment = state.selectedEvent.comments.find(
              (c) => c.id === commentId
            );
            if (comment) {
              comment.isLiked = isLiked;
              comment.likeCount = comment.likeCount || 0;
              comment.likeCount += isLiked ? 1 : -1;
              comment.likes = comment.likes || [];
              if (isLiked) {
                if (
                  !comment.likes.some(
                    (like) => hasUserId(like) && like.userId === currentUserId
                  )
                ) {
                  comment.likes.push({ userId: currentUserId });
                }
              } else {
                comment.likes = comment.likes.filter(
                  (like) => !hasUserId(like) || like.userId !== currentUserId
                );
              }
            }
          }
        }
      })
      .addCase(toggleCommentLike.rejected, (state, action) => {
        state.togglingCommentLike = false;
        state.toggleCommentLikeError = action.payload as string;
      })

      // Toggle Reply Like
      .addCase(toggleReplyLike.pending, (state) => {
        state.togglingReplyLike = true;
        state.toggleReplyLikeError = null;
      })
      .addCase(toggleReplyLike.fulfilled, (state, action) => {
        state.togglingReplyLike = false;
        const { replyId, isLiked } = action.payload;
        const currentUserId = getCurrentUserId();

        if (currentUserId) {
          // Update eventComments
          if (state.eventComments) {
            state.eventComments.forEach((comment) => {
              if (comment.replies) {
                const reply = comment.replies.find((r) => r.id === replyId);
                if (reply) {
                  reply.isLiked = isLiked;
                  reply.likeCount = reply.likeCount || 0;
                  reply.likeCount += isLiked ? 1 : -1;
                  reply.likes = reply.likes || [];
                  if (isLiked) {
                    if (
                      !reply.likes.some(
                        (like) =>
                          hasUserId(like) && like.userId === currentUserId
                      )
                    ) {
                      reply.likes.push({ userId: currentUserId });
                    }
                  } else {
                    reply.likes = reply.likes.filter(
                      (like) =>
                        !hasUserId(like) || like.userId !== currentUserId
                    );
                  }
                }
              }
            });
          }
          // Update selectedEvent.comments
          if (state.selectedEvent?.comments) {
            state.selectedEvent.comments.forEach((comment) => {
              if (comment.replies) {
                const reply = comment.replies.find((r) => r.id === replyId);
                if (reply) {
                  reply.isLiked = isLiked;
                  reply.likeCount = reply.likeCount || 0;
                  reply.likeCount += isLiked ? 1 : -1;
                  reply.likes = reply.likes || [];
                  if (isLiked) {
                    if (
                      !reply.likes.some(
                        (like) =>
                          hasUserId(like) && like.userId === currentUserId
                      )
                    ) {
                      reply.likes.push({ userId: currentUserId });
                    }
                  } else {
                    reply.likes = reply.likes.filter(
                      (like) =>
                        !hasUserId(like) || like.userId !== currentUserId
                    );
                  }
                }
              }
            });
          }
        }
      })
      .addCase(toggleReplyLike.rejected, (state, action) => {
        state.togglingReplyLike = false;
        state.toggleReplyLikeError = action.payload as string;
      })


      .addCase(fetchBankDetailsByOrganizerId.pending, (state) => {
        state.bankDetailsLoading = true;
        state.bankDetailsError = null;
      })
      .addCase(fetchBankDetailsByOrganizerId.fulfilled, (state, action) => {
        state.bankDetailsLoading = false;
        state.bankDetails = action.payload;
      })
      .addCase(fetchBankDetailsByOrganizerId.rejected, (state, action) => {
        state.bankDetailsLoading = false;
        state.bankDetailsError = action.payload as string;
      });
  },
});

export default homeSlice.reducer; 