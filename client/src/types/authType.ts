export interface registerPayload {
    name: string,
    email: string,
    password: string,
}

export interface loginPayload {
    email: string,
    password: string,
}

export interface User{
    id: string,
    name: string,
    email:string,
    profilePic: string,
    isOnline:boolean,
    lastSeen: string,
    bio:string,
}