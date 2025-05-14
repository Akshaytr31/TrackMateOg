import React from 'react';
import { COLORS } from '../constants/colors'; 

const UserListModal = ({
    context = 'dashboard',
    users = [],
    searchQuery = '',
    onSearchChange = () => {},
    onClose = () => {},
    onUserToggle = () => {},
    selectedUsers = [],
    currentTaskId = null,
    tasks = []
}) => {

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='absolute top-0 left-0 z-50 bg-white p-4 shadow-md rounded-xl mt-4 w-full max-w-lg'>
            <div className='flex justify-between mb-2'>
                <input
                    type="text"
                    placeholder='🔍 Search users by name...'
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="p-2 pl-4 border border-blue-100 rounded-3xl w-full max-w-xs text-sm"
                />
                <div className='card-btn ml-4' onClick={onClose}>
                    Close
                </div>
            </div>
            <div className='max-h-[250px] overflow-y-auto border rounded-md'>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100 font-semibold">
                            <th className="p-2">Name</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((u, index) => {
                                const color = COLORS[index % COLORS.length];
                                const isSelected = context === 'dashboard'
                                    ? selectedUsers.some(sel => sel._id === u._id)
                                    : tasks.find(t => t._id === currentTaskId)?.assignedTo?.some(
                                        id => id === u._id || id?._id === u._id
                                    );

                                return (
                                    <tr
                                        key={u._id}
                                        onClick={() => onUserToggle(u, context)}
                                        className={`cursor-pointer hover:scale-101 ${isSelected ? 'bg-green-100' : ''}`}
                                    >
                                        <td className="p-2 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            {u.name}
                                        </td>
                                        <td className="p-2">{u.email}</td>
                                        <td className="p-2 capitalize">{u.role || "User"}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="3" className="p-4 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserListModal;

//////