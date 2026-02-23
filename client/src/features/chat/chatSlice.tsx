import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ChatType } from "../../types/chatType";
import api from "../../api/api";

export interface ChatState {
  chats: ChatType[],
  selectedChat: ChatType | null,
  loading: boolean,
  error: string | null,
}

export const accessChat = createAsyncThunk('chat/access', async(userId: string, thunkAPI) => {
    try {
        const res = await api.post('/chats', { userId });
        console.log(res.data);
        return res.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.msg || err.message);
    }
})

export const getMyChats = createAsyncThunk('chat/mychats', async(_,thunkAPI) => {
   try {
       const res = await api.get('/chats');
       console.log(res.data);
       return res.data;
   } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.msg || err.message);
   }
})

export const createGroupChat = createAsyncThunk('chat/groupchat', async({users, chatName}: { users: string[]; chatName: string}, thunkAPI) => {
    try {
        const res  = await api.post('/chats/group', {users, chatName});
        console.log(res.data);
        return res.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.msg || err.message);
    }
})

export const fetchFriends = createAsyncThunk('chats/fetchfriends', async(_, thunkAPI) => {
    try {
        const res = await api.get('/chats/friends');
        console.log(res.data);
        return res.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.msg || err.message);
    }
})

const initialState: ChatState = {
    chats:[],
    selectedChat: null,
    loading: false,
    error: null
}
const chatSlice = createSlice({
    name:'chat',
    initialState,
    reducers:{
        setSelectedChat: (s,a) => {
            s.selectedChat = a.payload;
        },
        updateLatestMessage: (s,a) => {
            const chat = s.chats.find((c) => c._id === a.payload.chatId);
            if(chat) {
                chat.latestMessage = a.payload.message;
            }
        }
    },
    extraReducers:(b) => {
        b
        .addCase(accessChat.pending, (s) => {
            s.loading = true;
            s.error = null;
        })
        .addCase(accessChat.fulfilled, (s,a) => {
            const existingChat = s.chats.find((c) => c._id === a.payload._id);
            if(!existingChat) {
                s.chats.unshift(a.payload);
            }
            s.selectedChat = a.payload;
        })
        .addCase(accessChat.rejected, (s,a) => {
            s.loading = false;
            s.error = a.payload as string;
        })
        .addCase(getMyChats.pending, (s) => {
            s.loading = true;
            s.error = null;
        })
        .addCase(getMyChats.fulfilled, (s,a) => {
            s.loading = false;
            s.chats = a.payload;
        })
        .addCase(getMyChats.rejected, (s, a) => {
            s.loading = false;
            s.error = a.payload as string;
        })
        .addCase(createGroupChat.fulfilled, (s,a) => {
            s.chats.unshift(a.payload);
            s.selectedChat = a.payload;
        })
        .addCase(fetchFriends.fulfilled, (s,a) => {
            s.chats = a.payload;
        })
    }
})

export const { setSelectedChat, updateLatestMessage } = chatSlice.actions;
export default chatSlice.reducer;