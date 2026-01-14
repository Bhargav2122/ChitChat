export interface userType {
    fullname?: string,
    email: string,
    password?:string,
    avatar?:string,
    googleId?:string,
    authProviders: {
        local: boolean,
        google: boolean,
    },
    isOnline: boolean,
    lastSeen: Date,
}