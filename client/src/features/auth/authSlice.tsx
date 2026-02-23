import api from "../../api/api";
import type { loginPayload, registerPayload, User } from "../../types/userType";
import { createAsyncThunk, createSlice  } from '@reduxjs/toolkit';

export interface AuthState {
    user: User | null,
    loading: boolean,
    error: string | null,
}

const getUserToken = ():User | null => {
  const stored = localStorage.getItem('user');
  if(!stored) {
    return null;
  }
  try {
    return JSON.parse(stored) as User
  } catch(err: any) {
    localStorage.removeItem('user')
    return null;
  }
}

const initialState: AuthState = {
    user: getUserToken(),
    loading: false,
    error: null,
}

export const registerUser = createAsyncThunk<User, registerPayload>('auth/register', async(formData, thunkAPI) => {
    try {
        const res = await api.post('/auth/register', formData);
        console.log(res.data);
        return res.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.msg || err.message)
    }
})

export const login = createAsyncThunk<User, loginPayload>('auth/login', async(formData, thunkAPI) => {
    try {
        const res = await api.post('/auth/login', formData);
        console.log(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        return res.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(err.response?.data?.msg || err.message)
    }
})
export const logout = createAsyncThunk('auth/logout', async() => {
    await api.post('/auth/api/logout')
})

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{},
    extraReducers:(b) => {
        b
        .addCase(registerUser.pending, (s) => {
            s.loading = true;
            s.error = null;
        })
        .addCase(registerUser.fulfilled, (s,a) => {
            s.loading = false;
            s.user = a.payload;
        })
        .addCase(registerUser.rejected, (s, a) => {
            s.loading = true;
            s.error = a.payload as string;
        })
        .addCase(login.pending, (s) => {
            s.loading = true;
            s.error = null;
        })
        .addCase(login.fulfilled, (s, a) => {
            s.loading = false;
            s.user = a.payload;
        })
        .addCase(login.rejected, (s, a) => {
            s.loading = true;
            s.error = a.payload as string;
        })
        .addCase(logout.fulfilled, (s) => {
            s.user = null;
        })
        
    }
})

export default authSlice.reducer;