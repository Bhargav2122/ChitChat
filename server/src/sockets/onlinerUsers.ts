const onlineUsers = new Map<string, Set<string>>();
//userId -> Set(socketId);

export const addOnlineUsers = (userId: string, socketId: string) => {
    if(!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId)!.add(socketId);
}

export const removeOnlineUser = (userId: string, socketId: string) => {
    const sockets = onlineUsers.get(userId);
    if(!sockets) return;
    sockets.delete(socketId);
    if(sockets.size === 0) {
        onlineUsers.delete(userId);
    }
};

export const isUserOnline = (userId: string) => {
    return onlineUsers.has(userId);
}

export const getOnlineUsers = () => {
    return Array.from(onlineUsers.keys());
}

