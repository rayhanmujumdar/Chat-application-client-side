import { configureStore } from "@reduxjs/toolkit";
// import logger from "redux-logger";
import { apiSlice } from "../feature/api/apiSlice";
import authReducer from "../feature/auth/authSlice";
import conversationReducer from "../feature/conversation/conversationSlice";
import messageReducer from "../feature/messages/messageSlice";

// configure a new redux store
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    conversations: conversationReducer,
    messages: messageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: import.meta.env.MODE !== "production",
});

export default store;
