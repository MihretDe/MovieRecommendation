import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "./feauters/movie/movieSlice";
export const store = configureStore({
  reducer: {
    movies: movieReducer,
  },
});

// Infer types for usage in app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
