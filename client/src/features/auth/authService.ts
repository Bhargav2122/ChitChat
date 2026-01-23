import api from "../../api/api";
import type { loginPayload, registerPayload } from "../../types/authType";


export const registerUser = async(formData: registerPayload) => {
    const res = await api.post('/api/auth/register', formData);
    console.log(res.data)
    return res.data;
}

export const loginUser = async(formData: loginPayload) => {
    const res = await api.post('/api/auth/login', formData);
    console.log(res)
    return res.data;
}

export const logoutUser = async() => {
    await api.post('/api/auth/logout');
}