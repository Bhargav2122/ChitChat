import React from 'react'
import type { MessageType } from '../types/messageType'

interface MessageItemProps {
    message: MessageType,
    isOwnMessage: boolean;
}



const MessageItem: React.FC<MessageItemProps> = ({ message, isOwnMessage}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
  }


  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-2 max-w-xs md:max-w-md lg:max-w-lg ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar - only show for other users */}
        {!isOwnMessage && (
          <img
            src={message.sender?.profilePic || `https://ui-avatars.com/api/?name=${message.sender?.name || 'U'}&background=random`}
            alt={message.sender?.name || 'User'}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        )}

        {/* Message Bubble */}
        <div>
          {/* Sender name - only for other users */}
          {!isOwnMessage && message.sender?.name && (
            <p className="text-xs text-gray-600 mb-1 px-1">{message.sender.name}</p>
          )}
          
          <div
            className={`rounded-lg px-4 py-2 ${
              isOwnMessage
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
            }`}
          >
            <p className="wrap-break-word whitespace-pre-wrap">{message.text}</p>
            <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <span className={`text-xs ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                {formatTime(message.createdAt)}
              </span>
              {isOwnMessage && message.seenby && message.seenby.length > 1 && (
                <svg
                  className="w-4 h-4 text-blue-100"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageItem
