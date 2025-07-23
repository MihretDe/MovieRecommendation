
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


// Async thunk to fetch moods
export const fetchMoods = createAsyncThunk(
  "moods/fetchMoods",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/moods`);
      return response.data.moods;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "Failed to fetch moods"
        );
      }
      return thunkAPI.rejectWithValue("Failed to fetch moods");
    }
  }
);

// Mood slice state
interface MoodState {
  moods: string[];
  loading: boolean;
  error: string | null;
}

const initialState: MoodState = {
  moods: [],
  loading: false,
  error: null,
};

const moodSlice = createSlice({
  name: "moods",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoods.fulfilled, (state, action) => {
        state.moods = action.payload;
        state.loading = false;
      })
      .addCase(fetchMoods.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default moodSlice.reducer;
