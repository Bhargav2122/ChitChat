import React from 'react'

const TypingIndicator:React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="flex gap-2 items-center">
        <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none px-4 py-3">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default TypingIndicator
