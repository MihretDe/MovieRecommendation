import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "./feauters/movie/movieSlice";
import moodReducer from "./feauters/mood/moodSlice";
import userReducer from "./feauters/user/userSlice";
import favouritesReducer from "./feauters/favourites/favouritesSlice";
export const store = configureStore({
  reducer: {
    movies: movieReducer,
    moods: moodReducer,
    user: userReducer,
    favourites: favouritesReducer,
  },
});

// Infer types for usage in app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
