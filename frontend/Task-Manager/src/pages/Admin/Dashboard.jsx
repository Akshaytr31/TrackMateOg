// import { addTousandsSeparator } from '../../utils/helper';
// import InfoCard from '../../components/Cards/InfoCard';
// import { LuArrowDown } from 'react-icons/lu';
// import TaskListTable from '../../components/Tables/TaskListTable';
// import CustomPieChart from '../../components/Charts/CustomPieChart';
// import TaskListTable from '../../components/Tables/TaskListTable';
// import ActiveUserList from '../../components/ActiveUserList/ActiveUserList';

import { UserContext } from '../../context/userContext';
import React, { useContext, useEffect, useState } from 'react';
import useUserAuth from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment';
import CselectedUsersustomBarChart from '../../components/Charts/CustomBarChartAdmin';
const COLORS=["#8D51FF","#00BBDB","#7BCE00"]
import { Trash2 } from 'lucide-react';


function Dashboard() {
    useUserAuth(); 

    const { user } = useContext(UserContext); 
    const navigate = useNavigate();

    const [barChartData, setBarChartData] = useState({ workedHoursPerDay: [], users: [] }); 
    
    const [users, setUser] = useState([]);
    const [searchQuery, setSearchQuery]=useState("")
    const [selectedUsers, setSelectedUsers]=useState([])
    const [showUserList, setShowUserList]=useState(false)

    const getAllUser=async ()=>{
        try{
            const res=await axiosInstance.get("/api/users")
            setUser(res.data)
        }catch (error){
            console.error('Failed to fetch users:',error)
        }
    }

    const filteredUsers=users.filter((u)=>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // const taskDistributionData = () => {
    //     const taskDistribution = data?.taskDistribution || null;
    //     const taskPriorityLevels = data?.taskPriorityLevels || null;

    //     const takeDistributionData = [
    //         { status: "Pending", count: taskDistribution?.Pending }
    //     ]
    // }


    //for selection

    const toggleUserSelection = (user) => {
        const exist = selectedUsers.find(u => u._id === user._id);
        if (exist) {
            // REMOVE the user
            setSelectedUsers(prev => prev.filter(u => u._id !== user._id));
        } else {
            // ADD the user
            setSelectedUsers(prev => [...prev, user]);
        }
    };

    //clear all selected users
    const clearAllSelectedUsers=()=>{
        setSelectedUsers([])
    }
    
    // //prepare Chart data
    // const prepareChartData = (data) => {
    //     setBarChartData(data);
    // }

    const getDashboardData = async (selectedUserIds) => {
        try {
            const response = await axiosInstance.post(API_PATHS.TIMELOG.GET_SUMMARY, selectedUserIds);
            if (response?.data) {
                setBarChartData(response?.data)
            }

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    useEffect(() => {
        getAllUser();
        const selectedUserIds = selectedUsers.map(user => user._id)
        getDashboardData(selectedUserIds);
    }, [selectedUsers]);

    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className="card my-5">
                <div>
                    <div className="col-span-3">
                        <h2 className="text-xl md:text-2xl">
                            Welcome {user?.name || "Guest"}
                        </h2>
                        <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
                            {moment().format("dddd Do MMMM YYYY")}
                        </p>
                    </div>
                </div>
            </div>
            <div className='flex flex-wrap gap-y-6 gap-x-6 my-4 md:my-6'>

                <div className='flex-1 min-w-[300px]'>
                    <div className='card '>
                        <div className='flex items-center justify-between'>
                            <h5 className='font-medium'>Work Flow Level</h5>
                        </div>
                        <CustomBarChart data={barChartData?.workedHoursPerDay} users={barChartData?.users}/>
                    </div>
                </div>
                <div className='card w-full sm:w-auto'>
                    <div className='flex justify-between items-center'>
                        <h1>Selcted user</h1>
                    </div>

                    <div className='flex justify-between gap-10 mt-4'>
                        <button className='card-btn w-[95.5px]' onClick={()=>setShowUserList(prev=>!prev)}>{showUserList?'Hide Users':'Add Users'}</button>
                        <button className='card-btn' onClick={(clearAllSelectedUsers)}>Clear All</button>

                    </div>
                    <div className='mt-4 space-y-2 max-h-[250px] overflow-hidden'>
                        {selectedUsers.length > 0 ? (
                        selectedUsers.map(user => (
                            <div key={user._id} className='flex justify-between items-center card-btn px-3 py-2 rounded-md hover:scale-101'>
                            <span className='text-sm'>{user.name}</span>
                            <button
                                onClick={() => toggleUserSelection(user)}
                                className="text-gray-500 hover:text-red-600 cursor-pointer hover:scale-101"
                                title="Remove"
                                >
                                <Trash2 size={16} />
                                </button>                            
                                </div>
                        ))
                        ) : (
                        <p className="text-sm text-gray-400">No users selected.</p>
                        )}
                    </div>
                </div>
                {showUserList &&(

                    <div className='md:col-span-2 absolute '>
                        <div className='userList pr-0'>
                            <div className='flex items justify-between'>
                            <input
                                type="text"
                                placeholder='🔍 Search users by name...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="p-2 pl-4 border border-blue-100 rounded-3xl w-full max-w-xs focus:outline-none text-sm h-[40px]"
                            />
                            <div className='card-btn' onClick={()=>setShowUserList(false)}>
                                close
                            </div>
                            </div>

                            <div className='overflow-auto position:relative'>
                            <div className="w-full mt-4 text-sm text-left border border-gray-200 rounded-md overflow-hidden">
                                 {/* Header */}
                                <table className="w-full">
                                    <thead className="form-card bg-gray-100 text-sm font-semibold text-gray-700">
                                    <tr className='bg-gray-200'>
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Email</th>
                                        <th className="p-3">Role</th>
                                    </tr>
                                    </thead>
                                </table>

                                {/* Scrollable Body */}
                                <div className="max-h-[200px] overflow-y-auto overflow-x-hidden">
                                    <table className="w-full">
                                    <tbody>
                                        {filteredUsers.length > 0 ? (
                                        filteredUsers.map((u, index) => {
                                            const COLORS = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFD93D', '#A66DD4'];
                                            const color = COLORS[index % COLORS.length];

                                            return (
                                            <tr
                                                key={u._id}
                                                onClick={() => toggleUserSelection(u)}
                                                className="bg-gray-50 hover:scale-101 hover:text-sky-400 border-b border-gray-100"
                                            >
                                                <td className="p-3 flex items-center">
                                                <div className="round" style={{ backgroundColor: color }}></div>
                                                <span className="ml-2">{u.name}</span>
                                                </td>
                                                <td className="p-3">{u.email}</td>
                                                <td className="p-3 capitalize">{u.role || "User"}</td>
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

                            </div>
                        </div>
                    </div>
                )}
                </div>
        </DashboardLayout>
    );
}

export default Dashboard;








