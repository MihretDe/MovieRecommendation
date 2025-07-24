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
export const loginUser = createAsyncThunk(
  "user/login",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
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
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Login failed"
        );
      }
      return thunkAPI.rejectWithValue("Login failed");
    }
  }
);

// Signup thunk
export const signupUser = createAsyncThunk(
  "user/signup",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
      });
      return res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            error.response?.data?.error?.message ||
            "Signup failed"
        );
      }
      return thunkAPI.rejectWithValue("Signup failed");
    }
  }
);

// // Fetch user profile (example: /auth/me endpoint)
// export const fetchUserProfile = createAsyncThunk(
//   "user/fetchProfile",
//   async (_, thunkAPI) => {
//     try {
//       const state: any = thunkAPI.getState();
//       const token =
//         state.user?.token ||
//         (typeof window !== "undefined"
//           ? localStorage.getItem("access_token")
//           : null);
//       const res = await axios.get(`${API_URL}/auth/me`, {
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//       });
//       return res.data;
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         return thunkAPI.rejectWithValue(error.response?.data?.message);
//       }
//       return thunkAPI.rejectWithValue("An unknown error occurred");
//     }
//   }
// );

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
      });
  },
});

export const { setUser, clearUser, setToken } = userSlice.actions;
export const selectUserToken = (state: { user: UserState }) => state.user.token;
export default userSlice.reducer;
