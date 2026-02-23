import chatReducer from '../features/chat/chatSlice';
import authReducer from '../features/auth/authSlice';
import messageReducer from '../features/messages/messageSlice';
import { configureStore } from '@reduxjs/toolkit';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        message: messageReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;