import React, { useState } from 'react'
import { useAppDispatch } from '../app/hooks';
import type { User } from '../types/userType';
import api from '../api/api';
import { accessChat } from '../features/chat/chatSlice';


interface SearchUserProps {
  onClose: () => void;
}
const SearchInput: React.FC<SearchUserProps> = ({onClose }) => {
  const dispatch = useAppDispatch();
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async(query: string) => {
    setSearchQuery(query);
    if(!query.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    setLoading(true);


    try {
      const res = await api.get(`/users?search=${query}`);
      setSearchResults(res.data);
    } catch(err: any) {
      console.error('Search error: ', err);
      setSearchResults([]);
    } finally {
      setLoading(false)
    }
  }

  const handleUserClick = async (userId: string) => {
    try {
      await dispatch(accessChat(userId)).unwrap();

      setSearchQuery('');
      setSearchResults([]);
      onClose();
    } catch(err: any) {
      console.error('Error accessing chat: ', err);
    }
  }
  
  
  
  return (
    <div className="mb-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
      </div>

      {/* Search Results */}
      {searching && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-blue-500"
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
                Searching...
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No users found
            </div>
          ) : (
            <div>
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition"
                >
                  <img
                    src={user.profilePic || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {user.name}
                    </h4>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchInput
