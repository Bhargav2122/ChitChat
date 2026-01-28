import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { MessageState } from "../../types/ChatTypes";
import api from "../../api/api";


const initialState: MessageState = {
    messages:[],
    loading: false,
    error: null,
    typing:{},
}

export const fetchMessages = createAsyncThunk('message/fetchmessage', async(chatId:string, thunkAPI) => {
    try{
        const { data } = await api.get(`/api/messages/${chatId}`);
        return data;
    }catch(err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || err.message);
  }
})

export const sendMessage = createAsyncThunk('message/sendmessage', async({chatId, text}: {chatId: string; text: string}, thunkAPI) => {
    try {
        const { data } = await api.post('/api/messages', {chatId, text});
        return data;
    }catch(err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || err.message);
  }
})

export const markMessagesSeen = createAsyncThunk('message/markseen', async(chatId: string, thunkAPI) => {
    try {
        await api.put('/messages/seen',{chatId});
        return chatId;
    }catch(err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || err.message);
  }
})

const messageSlice = createSlice({
    name:'message',
    initialState,
    reducers: {
        addMessage:(s,a) => {
            const exists = s.messages.find((m) => m._id === a.payload._id);
            if(!exists) {
                s.messages.push(a.payload);
            }
        },
        clearMessages:(s) => {
            s.messages = [];
        },
        setTyping:(s,a) => {
            const {chatId, userId} = a.payload;
            if(!s.typing[chatId]) {
                s.typing[chatId] = [];
            }
            if(!s.typing[chatId].includes(userId)) {
                s.typing[chatId].push(userId);
            }
        },
        removeTyping:(s,a) => {
            const { chatId, userId } = a.payload;
            if(s.typing[chatId]) {
                s.typing[chatId] = s.typing[chatId].filter((id) => id !== userId);
            }
        },
        updateMessageSeen: (s, a) => {
            const { userId } = a.payload;
            s.messages.forEach((message) => {
                if(!message.seenby.includes(userId)){
                    message.seenby.push(userId);
                }
            });
        },
        clearError: (s) => {
                s.error = null;
        }
    },

    extraReducers:(b) => {
    
        b.addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
        })
        .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
        })
        .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        })
        .addCase(sendMessage.fulfilled, (state, action) => {
      const exists = state.messages.find((m) => m._id === action.payload._id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    });
    }
})

export const { addMessage, clearMessages, setTyping, removeTyping, updateMessageSeen, clearError} = messageSlice.actions;

export default messageSlice.reducer;