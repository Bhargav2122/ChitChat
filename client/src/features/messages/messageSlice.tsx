import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { MessageType } from "../../types/messageType";
import api from "../../api/api";

export interface MessageState {
    messages: MessageType[],
    loading: boolean,
    error: string | null,
    typing: {
        [chatId: string]: string[];
    };
}

export const fetchMessages = createAsyncThunk('message/fetchmessages', async(chatId: string, thunkAPI) => {
   try {
     const res = await api.get(`/message/${chatId}`);
     console.log(res.data);
     return res.data;
   } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || err.message);
   }
})

export const sendMessage = createAsyncThunk('message/sendmessage', async({chatId, text} : {chatId: string; text: string}, thunkAPI) => {
    try {
        const res = await api.post('/message', {chatId, text});
        console.log(res.data);
        return res.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.msg || err.message);
    }
})

export const markMessageSeen = createAsyncThunk('message/markseen', async(chatId:string, thunkAPI) => {
    try {
        await api.put('/message/seen', { chatId });
        return chatId;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.msg || err.message);
    }
})

const initialState : MessageState = {
    messages: [],
    loading: false,
    error: null,
    typing: {},
}

const messageSlice = createSlice({
    name: 'message',
    initialState, 
    reducers: {
        addMessage:(s,a) => {
           const exists = s.messages.find((m) => m._id === a.payload._id);
           if(!exists) {
            s.messages.push(a.payload);
           }
        },
        clearMessage: (s) => {
            s.messages = [];
        },
        setTyping: (s,a) => {
            const {chatId, userId} = a.payload;
            if(!s.typing[chatId]) {
                s.typing[chatId] = [];
            }
            if(!s.typing[chatId].includes(userId)) {
                s.typing[chatId].push(userId);
            }
        },
        removeTyping: (s,a) => {
            const { chatId, userId } = a.payload;
            if(s.typing[chatId]) {
                s.typing[chatId] = s.typing[chatId].filter((id) => id !== userId);
            }
        },
        updateMessageSeen : (s, a) => {
            const { userId } = a.payload;
            s.messages.forEach((message) => {
                if(!message.seenby.includes(userId)) {
                    message.seenby.push(userId);
                }
            })
        },
    },
    extraReducers: (b) => {
        b
         .addCase(fetchMessages.pending, (s) => {
            s.loading = true;
            s.error = null;
         })
         .addCase(fetchMessages.fulfilled, (s,a) => {
            s.loading = false;
            s.messages = a.payload;
         })
         .addCase(fetchMessages.rejected, (s, a) => {
            s.loading = false;
            s.error = a.payload as string;
         })
         .addCase(sendMessage.fulfilled, (s,a) => {
            const exists = s.messages.find((m) => m._id === a.payload._id);
            if(!exists) {
                s.messages.push(a.payload);
            }
         })
    }
})

export const { addMessage, clearMessage, setTyping, removeTyping, updateMessageSeen} = messageSlice.actions;
export default messageSlice.reducer;