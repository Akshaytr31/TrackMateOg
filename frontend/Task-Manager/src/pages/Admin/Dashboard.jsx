import { UserContext } from '../../context/userContext';
import React, { useContext, useEffect, useState } from 'react';
import useUserAuth from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment';
import { addTousandsSeparator } from '../../utils/helper';
import InfoCard from '../../components/Cards/InfoCard';
import { LuArrowDown } from 'react-icons/lu';
import TaskListTable from '../../components/Tables/TaskListTable';
import CustomPieChart from '../../components/Charts/CustomPieChart';
import CustomBarChart from '../../components/Charts/CustomBarChart';
// import TaskListTable from '../../components/Tables/TaskListTable';
import ActiveUserList from '../../components/ActiveUserList/ActiveUserList';
const COLORS=["#8D51FF","#00BBDB","#7BCE00"]


function Dashboard() {
    useUserAuth(); 

    const { user } = useContext(UserContext); 
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);  
    const [barChartData, setBarChartData] = useState([]); 
    
    const [users, setUser] = useState([]);
    const [searchQuery,setSearchQuery]=useState("")

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

    //prepare Chart data
    const prepareChartData = (data) => {
        const taskDistribution = data?.taskDistribution || null
        const taskPriorityLevels = data?.taskPriorityLevels || null

        const taskDistributionData = [
            { status: "Pending", count: taskDistribution?.Pending || 0 },
            { status: "In Progress", count: taskDistribution?.InProgress || 0 },
            { status: "Completed", count: taskDistribution?.Completed || 0 }
        ]

        setPieChartData(taskDistributionData);

        const PriorityLevelData = [
            { priority: "Low", count: taskPriorityLevels?.Low || 1 },
            { priority: "Medium", count: taskPriorityLevels?.Medium || 2 },
            { priority: "High", count: taskPriorityLevels?.High || 3 }
        ]

        // console.log(taskDistributionData, PriorityLevelData);

        setBarChartData(taskDistributionData);
    }

    const getDashboardData = async () => {
        try {
            // console.log("Fetching dashboard data...");
            // const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
            // if (response.data) {
            //     console.log("Dashboard Data:", response.data);
            //     setDashboardData(response.data);
            //     prepareChartData(response.data?.charts||null)
            // }
            const sampleData = {
                taskDistribution: {
                    Pending: 5,
                    InProgress: 8,
                    Completed: 12
                },
                taskPriorityLevels: {
                    Low: 7,
                    Medium: 10,
                    High: 3
                }
            };
            
            // Call the function with the sample data
            prepareChartData(sampleData);
            

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    const onSeeMore=()=>{
        navigate('/admin/tasks')
    }
    
    useEffect(() => {
        getDashboardData();
        getAllUser()
    }, []);

    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className="card my-5">
                <div>
                    <div className="col-span-3">
                        <h2 className="text-xl md:text-2xl">
                            Good Morning! {user?.name || "Guest"}
                        </h2>
                        <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
                            {moment().format("dddd Do MMMM YYYY")}
                        </p>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-1 gap-y-6 my-4 md:my-6'>

                <div>
                    <div className='card'>
                        <div className='flex items-center justify-between'>
                            <h5 className='font-medium'>Work Flow Level</h5>
                        </div>
                        <CustomBarChart
                            data={barChartData}
                        />
                    </div>
                </div>

                <div className='md:col-span-2'>
                    <div className='card pr-0'>
                        <div className='flex items justify-between'>
                        <input
                            type="text"
                            placeholder='🔍 Search users by name...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="p-2 pl-4 border border-blue-100 rounded-3xl w-full max-w-xs focus:outline-none text-sm h-[40px]"
                        />
                        </div>

                        <div className='overflow-auto position:relative'>
                        <table className="w-full mt-4 text-sm text-left ">
                            <thead className="form-card bg-gray-100 text-sm font-semibold text-gray-700 w-full h-[40px]">
                            <tr className=''>
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                            </tr>
                            </thead>
                            {/* <div className='h-[100px]'> */}

                            <tbody className=''>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((u, index) => {
                                const COLORS = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFD93D', '#A66DD4'];
                                const color = COLORS[index % COLORS.length];

                                return (
                                    <tr key={u._id} className="form-card hover:scale-101 w-[100%] hover:text-sky-400">
                                    <td className="p-3 flex items-center">
                                        <div className="round" style={{ backgroundColor: color }}></div>
                                        <span className="ml-2">{u.name}</span>
                                    </td>
                                    <td className="p-3 ">{u.email}</td>
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
                            {/* </div> */}
                        </table>
                        </div>
                    </div>
                </div>

                </div>
        </DashboardLayout>
    );
}

export default Dashboard;

