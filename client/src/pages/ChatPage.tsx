import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { getMyChats } from '../features/chat/chatSlice';
import { socket } from '../socket/socket';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';

const ChatPage = () => {
  const dispatch = useAppDispatch();
  const { selectedChat } = useAppSelector((s) => s.chat);
  console.log('3. Chat page selected: ', selectedChat?._id ?? "NULL");
  
  useEffect(() => {
    dispatch(getMyChats());

    socket.connect();
    console.log("Selected chat: ",selectedChat)
    return () => {
      socket.disconnect();
    }
  }, [dispatch]);

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar */}
      <div
      className={`
        ${selectedChat ? "hidden md:block" : "block"}
        w-full md:w-96 border-r border-gray-300 bg-white
      `}
    >
        <ChatSidebar />
      </div>

      {/* Chat Window */}
     <div
      className={`
        ${selectedChat ? "flex" : "hidden md:flex"}
        flex-1 flex-col overflow-hidden
      `}
    >
        {selectedChat ? (
          <ChatWindow />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-24 w-24 text-gray-400"
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
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Welcome to Chat
              </h3>
              <p className="text-gray-500">
                Select a conversation or search for users to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage
