import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Save a new post
export const savePost = createAsyncThunk("posts/savePost", async (postData) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/savePost`, {
      postMsg: postData.postMsg,
      email: postData.email,
    });
    const post = response.data.post;
    return post; // Return the new post to Redux
  } catch (error) {
    console.error("Error saving post:", error);
    throw error; // Re-throw the error so it can be handled in the rejected case
  }
});

// Get all posts
export const getPosts = createAsyncThunk("posts/getPosts", async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/getPosts`);
    // Check if response is valid and contains an array of posts
    return Array.isArray(response.data.posts) ? response.data.posts : [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error; // Re-throw the error so it can be handled in the rejected case
  }
});

const initialState = {
  status: "idle", // Could be "idle", "loading", "succeeded", "failed"
  posts: [], // Initialize posts as an empty array
  comments: [],
  likes: [],
  error: null, // To store any error messages
};

const postSlice = createSlice({
  name: "posts",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle savePost actions
      .addCase(savePost.pending, (state) => {
        state.status = "loading";
      })
      .addCase(savePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts.unshift(action.payload); // Add new post to the beginning of the array
      })
      .addCase(savePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Handle getPosts actions
      .addCase(getPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Ensure we update posts only if action.payload is an array
        state.posts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default postSlice.reducer;
