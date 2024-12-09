import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Async function for login
export const login = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        email: userData.email,
        password: userData.password,
      });
      const user = response.data.user;
      const msg = response.data.msg;
      return { user, msg };  // Ensure to return the user and msg
    } catch (error) {
      // If an error occurs, return the error message with rejectWithValue
      return rejectWithValue(error.response?.data?.msg || 'Login failed');
    }
  }
);

// Async function for registering a user
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/registerUser`, {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });
      return {
        user: response.data.user,
        msg: response.data.msg,
      };
    } catch (error) {
      console.error("Error during user registration:", error);
      return rejectWithValue(error.response?.data?.msg || 'Registration failed');
    }
  }
);

// Async function for logout a user
export const logout = createAsyncThunk(
  "users/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/logout`);
      const msg = response.data.msg;
      return { msg };  // Return the msg to handle it in the reducer
    } catch (error) {
      return rejectWithValue('Logout failed');
    }
  }
);

// Initial state for the user slice
const initialState = {
  user: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  msg: null,
  isLogin: false,
};

// Create the user slice
export const userSlice = createSlice({
  name: "users", // Name of the slice
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.msg = action.payload.msg;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.msg = action.payload; // Set the error message
      })
      
      // Login User
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.msg = action.payload.msg;
        state.isLogin = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.msg = action.payload; // Set the error message
      })
      
      // Logout User
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLogin = false;
        state.user = null;
        state.msg = action.payload.msg; // Clear user and set logout msg
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.msg = action.payload; // Set the error message
      });
  },
});

// Export the reducer
export default userSlice.reducer;
