import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { addMessage, clearMessage, fetchMessages, removeTyping, setTyping, updateMessageSeen } from '../features/messages/messageSlice';
import { socket } from '../socket/socket';
import { setSelectedChat, updateLatestMessage } from '../features/chat/chatSlice';
import type { User } from '../types/userType';
import   TypingIndicator  from './TypingIndicator';
import MessageItem from './MessageItem';

const ChatWindow = () => {
   const dispatch = useAppDispatch();
   const {selectedChat} = useAppSelector((s) => s.chat);
   const { messages, typing } = useAppSelector((s) => s.message);
   const currentUser = useAppSelector((s) => s.auth.user);
   const [messageText, setMessageText] = useState('');
   const [isSending, setIsSending] = useState(false);
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const typingTimeOutRef = useRef(null);
   

   console.log("4. Chatwindow selected: ", selectedChat?._id ?? "NULL");
   
   useEffect(() => {
    if(!selectedChat) return;
    dispatch(fetchMessages(selectedChat?._id));

    socket.emit('join-chat', selectedChat._id);
    socket.emit('message-seen', selectedChat._id);

    const handleNewMessage = (message: any) => {
      if(message.chatId._id === selectedChat._id || message.chatId === selectedChat._id) {
        dispatch(addMessage(message));
        const chatId = typeof message.chatId === 'string' ? message.chatId: message.chatId._id;
        dispatch(updateLatestMessage({chatId, message}));

        scrollToBottom();

        socket.emit('message-seen', selectedChat._id);
      }
    }

    const handleTyping = ({ chatId, userId}: { chatId: string; userId: string}) => {
      if(chatId === selectedChat._id && userId !== currentUser?._id) {
        dispatch(setTyping({ chatId, userId}))
      }
    }

    const handleStopTyping = ({ chatId, userId}: {chatId:string; userId: string}) => {
      if(chatId === selectedChat._id) {
        dispatch(removeTyping({chatId, userId}));
      }
    }


    const handleMessageSeen = ({chatId, userId}: {chatId: string; userId: string}) => {
      if(chatId === selectedChat._id) {
        dispatch(updateMessageSeen({userId}));
      }
    }

    socket.on('new-message', handleNewMessage);
    socket.on('typing', handleTyping);
    socket.on('stop-typing', handleStopTyping);
    socket.on('message-seen', handleMessageSeen);


    return () => {
      socket.emit('chat-leave', selectedChat._id);
      socket.off('new-message', handleNewMessage);
      socket.off('typing', handleTyping);
      socket.off('stop-typing', handleStopTyping);
      socket.off('message-seen', handleMessageSeen);
      dispatch(clearMessage());
    }
   }, [selectedChat, dispatch, currentUser?._id]);

   useEffect(() => {
    scrollToBottom();
   },[messages]);

   const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth'});
   };

   const handleTyping = () => {
    if(!selectedChat) return;

    socket.emit('typing', selectedChat._id);
    if(typingTimeOutRef.current) {
      clearTimeout(typingTimeOutRef.current);
    }

   }

   const handleSendMessage = async(e: any) => {
    e.preventDefault();

    if(!messageText.trim() || !selectedChat || isSending) return;
    const text = messageText.trim();
    setMessageText('');
    setIsSending(true);

    if(typingTimeOutRef.current) {
      clearTimeout(typingTimeOutRef.current);
    }
    socket.emit('stop-typing', selectedChat._id);

    try {
      socket.emit('send-message', {chatId: selectedChat._id, text}, (response:any) => {
        if(response.success) {
          dispatch(addMessage(response.message));
          dispatch(updateLatestMessage({
            chatId: selectedChat._id,
            message: response.message
          }));
        } else {
          console.error('Failed to send message: ', response.error);
          setMessageText(text);
        }
        setIsSending(false);
      })
    } catch(err: any) {
      console.error('Error sending in messges: ', err);
      setMessageText(text);
      setIsSending(false);
    }
   }

   const getOtherUser = () => {
    if(!selectedChat || selectedChat.isGroup) return null;
    return selectedChat.users?.find((user:User) => user._id !== currentUser?._id);
   }

   const getChatName = () => {
    if(!selectedChat) return ;
    if(selectedChat.isGroup) {
      return selectedChat.chatName || 'Group Chat';
    }
    const otherUser = getOtherUser();
    return otherUser?.name || 'Unknown User';
   }

  const getTypingUsers = () => {
    if (!selectedChat) return [];
    const typingUserIds = typing[selectedChat._id] || [];
    
    if (selectedChat.isGroup) {
      return selectedChat.users
        ?.filter((user: any) => typingUserIds.includes(user._id) && user._id !== currentUser?._id)
        .map((user: any) => user.name) || [];
    }
    
    return typingUserIds.length > 0 ? [getChatName()] : [];
  };

  if (!selectedChat) {
    return <div>NO chat Selected</div>
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-white shadow-sm shrink-0">
        <button
  onClick={() => dispatch(setSelectedChat(null))}
  className="mr-2 md:hidden"
>
  ←
</button>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{getChatName()}</h3>
          {getTypingUsers().length > 0 ? (
            <p className="text-sm text-green-600">typing...</p>
          ) : selectedChat.isGroup ? (
            <p className="text-sm text-gray-500">
              {selectedChat.users?.length || 0} members
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              {getOtherUser()?.isOnline ? 'Online' : 'Offline'}
            </p>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-2"
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
              <p>No messages yet</p>
              <p className="text-sm mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message: any) => (
              <MessageItem
                key={message._id}
                message={message}
                isOwnMessage={message.sender._id === currentUser?._id}
              />
            ))}
            {getTypingUsers().length > 0 && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <textarea
          name='message'
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
            rows={1}
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!messageText.trim() || isSending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {isSending ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </>
            ) : (
              <>
                <span>Send</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatWindow
