import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: string;
  email: string;
  name: string;
  // add more fields as needed
}

export interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token:
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  loading: false,
  error: null,
};

// Login thunk
export const loginUser = createAsyncThunk<
  { token: string },
  { email: string; password: string },
  { rejectValue: string }
>("user/login", async ({ email, password }, thunkAPI) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    const token = res.data.access_token;
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
      // Set cookie for SSR middleware
      document.cookie = `access_token=${token}; path=/; max-age=604800; SameSite=Lax`;
    }
    return { token };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Login failed"
      );
    }
    return thunkAPI.rejectWithValue("Login failed");
  }
});

// Signup thunk
export interface SignupResponse {
  message?: string;
  // add more fields if your backend returns them
}

export const signupUser = createAsyncThunk<
  SignupResponse,
  { email: string; password: string; name: string },
  { rejectValue: string }
>("user/signup", async ({ email, password, name }, thunkAPI) => {
  try {
    const res = await axios.post(`${API_URL}/auth/signup`, {
      email,
      password,
      name,
    });
    return res.data as SignupResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.error?.message ||
          "Signup failed"
      );
    }
    return thunkAPI.rejectWithValue("Signup failed");
  }
});

// Fetch user profile (example: /auth/me endpoint)
export const fetchUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  "user/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as { user: UserState };
      const token =
        state.user?.token ||
        (typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null);
      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.data as User;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch user");
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
    },
    setToken(state, action) {
      state.token = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.user = null;
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { setUser, clearUser, setToken } = userSlice.actions;
export const selectUserToken = (state: { user: UserState }) => state.user.token;
export default userSlice.reducer;
