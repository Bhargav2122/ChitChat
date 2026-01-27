import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ChatState } from "../../types/ChatTypes";
import api from "../../api/api";

const initialState: ChatState = {
  chats: [],
  selectedChat: null,
  loading: false,
  error: null,
};

export const fetchChats = createAsyncThunk('chats/fetchChats', async(_,thunkAPI) => {
  try {
    const { data } = await api.get('/api/chats');
    return data;
  } catch(err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || err.message);
  }
});

export const accessChat = createAsyncThunk('chat/accessChat', async(userId: string, thunkAPI) => {
  try {
    const { data } = await api.post('/api/chats', { userId });
    return data;
  }catch(err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || err.message);
  }
});

export const createGroupChat = createAsyncThunk('chat/createGroupChat', async({users, chatName}: {users: string[]; chatName: string}, thunkAPI) => {
  try {
    const { data } = await api.post('/api/chats/group', { users, chatName});
    return data;
  }catch(err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || err.message);
  }
});
export const fetchFriends = createAsyncThunk('chat/fetchFriends', async(_, thunkAPI) => {
  try {
    const { data } = await api.get('/api/chats/friends');
    return data;
  }catch(err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || err.message);
  }
});

const chatSlice = createSlice({
  name:'chat',
  initialState,
  reducers: {
    setSelectedChat: (s, a) => {
     s.selectedChat = a.payload;
    },
    updateLatestMessage:(s,a) => {
      const chat = s.chats.find((c) => c._id === a.payload.chatId);
      if(chat) {
        chat.latestMessage = a.payload.message;
      }
    }
  },
  extraReducers:(b) => {
    b
    .addCase(fetchChats.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
    .addCase(fetchChats.fulfilled, (s, a) => {
      s.loading = false;
      s.chats = a.payload;
    })
    .addCase(fetchChats.rejected, (s, a) => {
      s.loading = false,
      s.error = a.payload as string;
    })
    .addCase(accessChat.fulfilled, (s, a) => {
      const existingChat = s.chats.find((c) => c._id === a.payload._id);
      if(!existingChat){
        s.chats.unshift(a.payload);
      }
      s.selectedChat = a.payload;
    })
    .addCase(createGroupChat.fulfilled, (s, a) => {
      s.chats.unshift(a.payload);
      s.selectedChat = a.payload;
    })
  }
});

export const { setSelectedChat, updateLatestMessage } = chatSlice.actions;
export default chatSlice.reducer;