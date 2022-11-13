import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./slices/post";
import userReducer from "./slices/user";
import reportReducer from "./slices/report";
import hashtagReducer from "./slices/hashtag";
import positionReducer from "./slices/position"

export const store = configureStore({ 
  reducer: {
    users: userReducer,
    posts: postReducer,
    reports: reportReducer,
    hashtags: hashtagReducer,
    positions: positionReducer
  },
}); // TODO

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;