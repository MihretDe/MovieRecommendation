import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "./feauters/movie/movieSlice";
import moodReducer from "./feauters/mood/moodSlice";
export const store = configureStore({
  reducer: {
    movies: movieReducer,
    moods: moodReducer,
  },
});

// Infer types for usage in app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
