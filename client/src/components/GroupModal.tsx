import React, { useState } from 'react'
import type { User } from '../types/userType'
import { useAppDispatch } from '../app/hooks';
import api from '../api/api';
import { createGroupChat } from '../features/chat/chatSlice';

const GroupModal = ({onClose}: {onClose: () => void}) => {
    const [users, setUsers] = useState<User[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [name, setName] = useState('');

    const dispatch = useAppDispatch();

    const search = async(q: string) => {
        if(!q) return setUsers([]);

        const res = await api.get(`/users/search?search=${q}`);
        setUsers(res.data);
    }

    const toggleUser = (id: string) => {
        setSelected((prev) => prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id])
    }

    const create = () => {
        if(!name || selected.length < 2) return;

        dispatch(createGroupChat({
            users: selected,
            chatName: name,
        }));
        onClose();
    }
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-4 rounded w-96 space-y-3">

        <h2 className="font-semibold text-lg">Create Group</h2>

        <input
          placeholder="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          placeholder="Search users"
          onChange={(e) => search(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <div className="max-h-40 overflow-y-auto">
          {users.map((u) => (
            <div
              key={u._id}
              onClick={() => toggleUser(u._id)}
              className={`p-2 cursor-pointer ${
                selected.includes(u._id) && "bg-green-200"
              }`}
            >
              {u.name}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={create}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Create
          </button>
        </div>

      </div>
    </div>
  )
}

export default GroupModal
