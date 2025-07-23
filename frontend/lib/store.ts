import { configureStore } from "@reduxjs/toolkit";
export const store = configureStore({
  reducer: {
  },
});

// Infer types for usage in app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
