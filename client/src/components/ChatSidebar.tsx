import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { socket } from '../socket/socket';
import { setSelectedChat } from '../features/chat/chatSlice';
import type { User } from '../types/userType';
import type { ChatType } from '../types/chatType';
import SearchInput from './SearchInput';
import GroupModal from './GroupModal';

const ChatSidebar: React.FC = () => {
   const dispatch = useAppDispatch();
   const { chats, selectedChat } = useAppSelector((s) => s.chat);
   const currentUser = useAppSelector((s) => s.auth.user);

   const [showSearch, setShowSearch] = useState(false);
   const [showGroupModal, setShowGroupModal] = useState(false);
   const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());


   useEffect(() => {
     
   const handleUserOnline = ({userId}: {userId: string}) => {
    setOnlineUsers((prev) => new Set(prev).add(userId));
   }

    const handleUserOffline = ({ userId}: {userId: string}) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      })
    }

    socket.on('user-online', handleUserOnline);
    socket.on('user-offline', handleUserOffline);

    return () => {
      socket.off('user-online', handleUserOnline);
      socket.off('user-offline', handleUserOffline);
    }

   }, []);

   const handleChatSelect = (chat: ChatType)=> {
    console.log("1. Clicked chat: ", chat._id);
    dispatch(setSelectedChat(chat));
    console.log('2. Dispatch setselectec chat: ');
    
    
   }

   const getOtherUser = (chat: ChatType): User | null => {
    if(chat.isGroup) {
      return null;
    }
    const currentUserId = String(currentUser?._id);
    const otherUser = chat.users.find((user: User) => {
      const userId = String(user._id);
      return userId !== currentUserId;
    }) || null;
    return otherUser
   }
   const getChatName = (chat: ChatType) : string => {
    if(chat.isGroup) {
      return chat.chatName || 'Group chat';
    }

    const otherUser = getOtherUser(chat);
    return otherUser?.name || 'Unknown User';
   }

   const isUserOnline = (chat: ChatType): boolean => {
    if(chat.isGroup) return false;
    const otherUser = getOtherUser(chat);
    return otherUser ? onlineUsers.has(otherUser._id) : false;
   }

   const getLatestMessagePreview = (chat: ChatType): string => {
    if(!chat.latestMessage) return 'No messages yet';
    const msg = chat.latestMessage;
    const preview = msg.text?.substring(0, 40) || 'Sent a message';

    return msg.text.length > 40 ? preview + '....' : preview;
   }


  return  (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Chats</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowGroupModal(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              title="Create Group"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              title="Search Users"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Component */}
        {showSearch && (
          <SearchInput onClose={() => setShowSearch(false)} />
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <svg
              className="w-16 h-16 mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-center">No conversations yet</p>
            <p className="text-sm text-center mt-2">Search for users to start chatting</p>
          </div>
        ) : (
          <div>
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => handleChatSelect(chat)}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition ${
                  selectedChat?._id === chat._id ? 'bg-blue-50' : ''
                }`}
              >
                

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {getChatName(chat)}
                    </h3>
                    {chat.latestMessage?.createdAt && (
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(chat.latestMessage.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {getLatestMessagePreview(chat)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Group Modal */}
      {showGroupModal && (
        <GroupModal onClose={() => setShowGroupModal(false)} />
      )}
    </div>
  )
}

export default ChatSidebar
