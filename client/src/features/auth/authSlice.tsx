import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { registerPayload, loginPayload, User } from "../../types/authType";
import { loginUser, logoutUser, registerUser } from "./authService";

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
    } catch (err) {
        localStorage.removeItem('user')
        return null;
    }
}

const initialState: AuthState = {
    user: getUserToken(),
    loading: false,
    error: null,
}


export const signup = createAsyncThunk<User, registerPayload>('auth/register', async(formData, thunkAPI) => {
   try {
    return await registerUser(formData);
    
   } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.msg || err.message)
   } 
})

export const signin = createAsyncThunk<User, loginPayload>('auth/login', async(formData, thunkAPI) => {
    try {
        const user =  await loginUser(formData);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    } catch (err: any) {
     return thunkAPI.rejectWithValue(err.response?.data?.msg || err.message)
    }
})

export const logout = createAsyncThunk('auth/logout', async() => {
    await logoutUser();
})

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{},
    extraReducers: (b) => {
        b
         .addCase(signup.pending, (s) => {
            s.loading = true;
            s.error = null;
         })
         .addCase(signup.fulfilled, (s, a) => {
            s.loading = false;
            s.user = a.payload;
         })
         .addCase(signup.rejected, (s, a) => {
            s.loading = true;
            s.error = a.payload as string;
         })
         .addCase(signin.pending, (s) => {
            s.loading = true;
            s.error = null;
         })
         .addCase(signin.fulfilled, (s, a) => {
            s.loading = false;
            s.user = a.payload;
         })
         .addCase(signin.rejected, (s,a) => {
            s.loading = true;
            s.error  = a.payload as string;
         })
         .addCase(logout.fulfilled, (s) => {
            s.user = null;
         })
    },
})

export default authSlice.reducer;