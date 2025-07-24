import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Favorite {
  _id: string;
  userId: string;
  movieId: string;
  movieTitle: string;
  moviePosterPath: string;
  createdAt: string;
}

export interface FavouritesState {
  favourites: Favorite[];
  loading: boolean;
  error: string | null;
}

const initialState: FavouritesState = {
  favourites: [],
  loading: false,
  error: null,
};

// Fetch all favorites for the current user
export const fetchFavourites = createAsyncThunk(
  "favourites/fetchFavourites",
  async (_, thunkAPI) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      if (!token) throw new Error("No auth token found");
      const res = await axios.get(`${API_URL}/favourite`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data as Favorite[];
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.error || "Failed to fetch favorites"
        );
      }
      return thunkAPI.rejectWithValue("Failed to fetch favorites");
    }
  }
);

// Add a favorite
export const addFavourite = createAsyncThunk(
  "favourites/addFavourite",
  async (
    {
      movieId,
      movieTitle,
      moviePosterPath,
    }: { movieId: string; movieTitle: string; moviePosterPath: string },
    thunkAPI
  ) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      if (!token) throw new Error("No auth token found");
      const res = await axios.post(
        `${API_URL}/favourite`,
        { movieId, movieTitle, moviePosterPath },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.data as Favorite;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.error || "Failed to add favorite"
        );
      }
      return thunkAPI.rejectWithValue("Failed to add favorite");
    }
  }
);

// Remove a favorite
export const removeFavourite = createAsyncThunk(
  "favourites/removeFavourite",
  async (movieId: string, thunkAPI) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      if (!token) throw new Error("No auth token found");
      await axios.delete(`${API_URL}/favourite/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return movieId;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.error || "Failed to remove favorite"
        );
      }
      return thunkAPI.rejectWithValue("Failed to remove favorite");
    }
  }
);

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.favourites = action.payload;
        state.loading = false;
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Add
      .addCase(addFavourite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavourite.fulfilled, (state, action) => {
        state.favourites.push(action.payload);
        state.loading = false;
      })
      .addCase(addFavourite.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Remove
      .addCase(removeFavourite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavourite.fulfilled, (state, action) => {
        state.favourites = state.favourites.filter(
          (fav) => fav.movieId !== action.payload
        );
        state.loading = false;
      })
      .addCase(removeFavourite.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default favouritesSlice.reducer;
