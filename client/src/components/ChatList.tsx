import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { fetchChats, setSelectedChat } from "../features/chat/chatSlice";
import type { Chat } from "../types/ChatTypes";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Search, Plus, LogOut, User as UserIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import SearchModal from "./SearchModal";
import ProfileModal from "./ProfileModal";


const ChatList = () => {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const { chats, selectedChat } = useAppSelector((s) => s.chat);
  const [showSearch, setShowSearch ] = useState(false);  
  const [showProfile, setShowProfile ] = useState(false);  
  const nav = useNavigate();



  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);
  
  const handleSelectedChat = (chat: Chat) => {
    dispatch(setSelectedChat(chat));
  }

  const handleLogout = async () => {
   await dispatch(logout());
   nav('/login');
  }

  const getChatName = (chat: Chat) => {
    if(chat.isGroup) {
      return chat.chatName || 'Group Chat';
    }

    const otherUser = chat.users.find((u) => u.id !== user?.id);
    return otherUser?.name || 'Unknow';
  }

  const getChatAvatar = (chat: Chat) => {
    if(chat.isGroup) {
      return '👥';
    }

    const otherUser = chat.users.find((u) => u.id !== user?.id);
    return otherUser?.profilePic || '';
  }

  const getLatestMessage = (chat: Chat) => {
    if(!chat.latestMessage){
      return 'No Messages yet';
    }
    return chat.latestMessage.text.length > 50
    ? chat.latestMessage.text.substring(0,50) + '...'
    : chat.latestMessage.text;
  }

  return (
    <aside>
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-user">
            <img src={user?.profilePic} alt={user?.name} className="sidebar-avatar"
             onClick={() => setShowProfile(true)}
            />

            <div className="siderbar-user-info">
              <h3>{user?.name}</h3>
               <p>
                <span className="status-dot online"></span>
                Online
               </p>
            </div>
          </div>

          <div className="sidebar-actions">
            <button onClick={() => setShowProfile(true)}>
              <UserIcon size={20} />
            </button>
            <button onClick={handleLogout}>
              <LogOut size={20} />
            </button>
           </div>
          </div>

          <div className="sidebar-search">
            <button onClick={() => setShowProfile(true)}>
              <Search size={20} />
              <span>Search user...</span>
            </button>
          </div>

          <div className="sidebar-chats">
            <div className="chats-header">
              <h4>Messages</h4>
              <button onClick={() => setShowSearch(true)}>
                <Plus size={18} />
              </button>
            </div>

            <div className="chat-lists">
              {chats.length === 0 ? (
                <div>
                  <p>No chats yet</p>
                  <button onClick={() => setShowSearch(true)}>
                    Start a conversation
                  </button>
                </div>
              ): (
                chats.map((chat) => (
                  <div key={chat._id} onClick={() => handleSelectedChat(chat)}  className={`${selectedChat?._id === chat._id ? 'active': ''}`}>
                    <div className="chat-avatar">
                      {chat.isGroup ? (
                        <div>👥</div>
                      ): (
                        <img src={getChatAvatar(chat)} alt={getChatAvatar(chat)} />
                      )}
                    </div>

                    <div className="chat-info">
                      <div className="chat-header-row">
                        <h4>{getChatName(chat)}</h4>
                        {chat.latestMessage && (
                          <span>
                            {formatDistanceToNow(new Date(chat.latestMessage.createdAt), { addSuffix: false})}
                          </span>
                        )}
                      </div>
                      <p>{getLatestMessage(chat)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {showSearch && <SearchModal onClose={() => setShowSearch(false)} /> }
        {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </aside>
  )
}

export default ChatList
