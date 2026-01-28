import { configureStore } from "@reduxjs/toolkit";
import authSlice from '../features/auth/authSlice';
import chatReducer from '../features/chat/chatSlice';
import messageReducer from '../features/messages/messageSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        chat: chatReducer,
        message: messageReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;