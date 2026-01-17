import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log("SENT TO API 👉", userData);

      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.log("API ERROR 👉", error.response?.data);
      return rejectWithValue(error.response?.data || { message: 'Registration failed' });
    }
  }
);


// Verify OTP
export const verifyOTP = createAsyncThunk(
  'auth/verify',
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/verify', otpData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Verification failed' });
    }
  }
);

// WhatsApp Login
export const loginWhatsApp = createAsyncThunk(
  'auth/loginWhatsApp',
  async (phoneData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login_whatsapp', phoneData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Login failed' });
    }
  }
);

// Verify WhatsApp OTP
export const verifyWhatsAppOTP = createAsyncThunk(
  'auth/verifyWhatsApp',
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/verify_whatsapp', otpData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Verification failed' });
    }
  }
);

// Get user info
export const getUserInfo = createAsyncThunk(
  'auth/getUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/auth/get_info');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to get user info' });
    }
  }
);

const initialState = {
  user: null,
  userId: null,
  phone: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setPhone: (state, action) => {
      state.phone = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.userId = null;
      state.phone = null;
      state.isAuthenticated = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload.user_id;
      })
     .addCase(registerUser.rejected, (state, action) => {
  state.loading = false;
  state.error =
    action.payload?.errors?.[0] ||
    action.payload?.message ||
    'Registration failed';
   })

      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        localStorage.setItem('access_token', action.payload.access_token);
        localStorage.setItem('refresh_token', action.payload.refresh_token);
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Verification failed';
      })
      // WhatsApp Login
      .addCase(loginWhatsApp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWhatsApp.fulfilled, (state, action) => {
        state.loading = false;
        state.phone = action.meta.arg.phone;
      })
      .addCase(loginWhatsApp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      // Verify WhatsApp OTP
    .addCase(verifyWhatsAppOTP.fulfilled, (state, action) => {
  state.loading = false;

  // خزّن tokens الصح من payload.tokens
  if (action.payload.tokens?.access_token && action.payload.tokens?.refresh_token) {
    localStorage.setItem('access_token', action.payload.tokens.access_token);
    localStorage.setItem('refresh_token', action.payload.tokens.refresh_token);
    state.isAuthenticated = true;
  } else {
    state.error = 'Failed to get auth tokens';
  }

  // ممكن كمان تحفظ بيانات المستخدم لو عايز
  state.userId = action.payload.user_id;
  state.user = {
    first_name: action.payload.first_name,
    last_name: action.payload.last_name,
    email: action.payload.email
  };
})


      .addCase(verifyWhatsAppOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Verification failed';
      })
      // Get User Info
      .addCase(getUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to get user info';
      });
  },
});

export const { setUserId, setPhone, logout, clearError } = authSlice.actions;
export default authSlice.reducer;