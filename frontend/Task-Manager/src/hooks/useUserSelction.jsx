import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useUserSelection = (initialUsers = [], tasks = [], currentTaskId = null, refreshTasks = () => {}) => {
  const [selectedUsers, setSelectedUsers] = useState(initialUsers);

  const assignUserToTask = async (user, taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      const alreadyAssigned = task?.assignedTo.map(u => u._id || u);

      const updatedAssignedTo = alreadyAssigned.includes(user._id)
        ? alreadyAssigned.filter(id => id !== user._id)
        : [...alreadyAssigned, user._id];

      await axiosInstance.put(`/api/tasks/${taskId}/assign`, {
        assignedTo: updatedAssignedTo,
      });

      refreshTasks();
    } catch (err) {
      console.error("Failed assigning user to task:", err);
    }
  };

  const toggleUserSelection = (user, context = 'dashboard') => {
    if (context === 'dashboard') {
      const exist = selectedUsers.find(u => u._id === user._id);
      if (exist) {
        setSelectedUsers(prev => prev.filter(u => u._id !== user._id));
      } else {
        setSelectedUsers(prev => [...prev, user]);
      }
    } else if (context === 'task' && currentTaskId) {
      assignUserToTask(user, currentTaskId);
    }
  };

  const clearSelectedUsers = () => setSelectedUsers([]);

  return {
    selectedUsers,
    toggleUserSelection,
    clearSelectedUsers,
    setSelectedUsers,
    assignUserToTask, // exported if needed separately
  };
};

export default useUserSelection;
