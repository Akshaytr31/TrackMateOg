import { UserContext } from '../../context/userContext';
import React, { useContext, useEffect, useState } from 'react';
import useUserAuth from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { redirect, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment';
import CustomBarChart from '../../components/Charts/CustomBarChartAdmin';
import { Trash2 } from 'lucide-react';
import UserListModal from '../../components/DashboardComponents/UserListModal';
import useUserSelection from '../../hooks/useUserSelction';
import TruncatedText from '../../components/DashboardComponents/TruncatedText';
import GraphToggleCard from '../../components/DashboardComponents/GraphToggleCard';


const COLORS = ["#8D51FF", "#00BBDB", "#7BCE00"];

function Dashboard() {
    useUserAuth();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [barChartData, setBarChartData] = useState({ workedHoursPerDay: [], users: [] });
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    // const [selectedUsers, setSelectedUsers] = useState([]);
    const [showDashboardUserList, setShowDashboardUserList] = useState(false);
    const [showTaskUserList, setShowTaskUserList] = useState(false);

    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [tasks, setTasks] = useState([]);
    const [currentTaskId, setCurrentTaskId] = useState(null);

   

    
    const getAllUsers = async () => {
        try {
            const res = await axiosInstance.get("/api/users");
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };
    
    const fetchAllTasks = async () => {
        try {
            const res = await axiosInstance.get("/api/tasks");
            setTasks(res.data);
        } catch (err) {
            console.error("Error loading tasks", err);
        }
    };
    
    const getDashboardData = async (selectedUserIds) => {
        try {
            const response = await axiosInstance.post(API_PATHS.TIMELOG.GET_SUMMARY, selectedUserIds);
            if (response?.data) {
                setBarChartData(response?.data);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };
    
    const {
      selectedUsers,
      toggleUserSelection,
      clearSelectedUsers,
      assignUserToTask
    } = useUserSelection([], tasks, currentTaskId, fetchAllTasks);
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateTasks = async () => {
        if (!taskTitle) return alert("Task title required");

        const payload = {
            title: taskTitle,
            description: taskDesc,
            assignedTo: selectedUsers.map(u => u._id)
        };

        try {
            await axiosInstance.post('/api/tasks', payload);
            alert("Task Created");
            setTaskTitle('');
            setTaskDesc('');
            fetchAllTasks();
        } catch (error) {
            console.log("Failed to create task", error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axiosInstance.delete(`/api/tasks/${taskId}`)
            alert('task deleted')
            fetchAllTasks()
        } catch (error) {
            console.log("Failed to delete task:", error)
            alert("failed to delete task")
        }
    }


    useEffect(() => {
        getAllUsers();
        fetchAllTasks();
    }, []);

    useEffect(() => {
        const selectedUserIds = selectedUsers.map(user => user._id);
        getDashboardData(selectedUserIds);
    }, [selectedUsers]);

    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className="task my-5 bg-[#6b707a]">
                <h2 className="text-xl md:text-2xl text-white font-medium">
                    Welcome {user?.name || "Guest"}
                </h2>
                <p className="text-xs text-gray-300 mt-1.5">{moment().format("dddd Do MMMM YYYY")}</p>
            </div>

            <div className='flex flex-wrap gap-6 relative'>
                <GraphToggleCard barChartData={barChartData} />


                <div className='card w-full sm:w-auto  '>
                    <h1>Selected Users</h1>
                    <div className=''>
                        <div className='flex justify-between gap-4 mt-3'>
                            <button onClick={() => setShowDashboardUserList(prev => !prev)} className='card-btn'>
                                {showDashboardUserList ? 'Hide Users' : 'Add Users'}
                            </button>
                            <button onClick={clearSelectedUsers} className='card-btn'>Clear All</button>
                        </div>
                            {showDashboardUserList && (
                                <UserListModal
                                    context="dashboard"
                                    users={users}
                                    searchQuery={searchQuery}
                                    onSearchChange={setSearchQuery}
                                    onClose={() => setShowDashboardUserList(false)}
                                    onUserToggle={toggleUserSelection}
                                    selectedUsers={selectedUsers}
                                    tasks={tasks}
                                    currentTaskId={currentTaskId}
                                />
                            )}

                        <div className='mt-4 space-y-2 max-h-[250px] overflow-y-auto '>
                            {selectedUsers.length > 0 ? selectedUsers.map(user => (
                                <div key={user._id} className='flex justify-between items-center card-btn-user-list px-3 py-2 rounded-md'>
                                    <span className='text-sm'>{user.name}</span>
                                    <button
                                        onClick={() => toggleUserSelection(user)}
                                        className="text-gray-500 hover:text-red-600"
                                        title="Remove"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-400">No users selected.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className='task mt-6 mb-6 relative'>
                <div className='bg-[#6b707a] p-6 rounded-2xl flex flex-col gap-4'>
                    <h3 className='text-white text-xl font-semibold'>Create Task</h3>
                    <div className='flex flex-wrap gap-4'>
                        <input
                            type="text"
                            placeholder='Task title'
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            className='bg-gray-50 p-2 rounded-2xl focus:outline-none pl-4 w-full sm:w-auto flex-1'
                        />
                        <button className='card-btn-create-task' onClick={handleCreateTasks}>Create task</button>
                    </div>
                </div>

                <div className='mt-6'>
                    <h3 className='text-lg mb-2'>All Tasks</h3>
                    {tasks.length === 0 ? (
                        <p className='text-sm text-gray-500'>No tasks found.</p>
                    ) : (
                        <ul className="list-disc pl-6 flex gap-4 flex-wrap max-h-[200px] overflow-auto overflow-x-hidden">
                            {tasks.map(task => (
                                <li key={task._id} className='w-full taskLi flex flex-col gap-2'>
                                    <div className='flex justify-between'>
                                        <strong>{task.title}</strong>
                                        <button
                                            className='card-btn'
                                            onClick={() => {
                                                setCurrentTaskId(task._id);
                                                setShowTaskUserList(true);
                                            }}
                                        >
                                            Assign User
                                        </button>
                                    </div>
                                    <div className='flex justify-between'>
                                        <div className='mt-1 text-sm text-gray-500'>
                                            Assigned to {task.assignedTo.length} user(s)
                                        </div>
                                        <button className='card-btn-task' onClick={() => handleDeleteTask(task._id)}>Delete task</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            {showTaskUserList && (
                <UserListModal
                    context="task"
                    users={users}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onClose={() => setShowTaskUserList(false)}
                    onUserToggle={toggleUserSelection}
                    selectedUsers={selectedUsers}
                    tasks={tasks}
                    currentTaskId={currentTaskId}
                />
            )}
            </div>

        </DashboardLayout>
    );
}

export default Dashboard;



