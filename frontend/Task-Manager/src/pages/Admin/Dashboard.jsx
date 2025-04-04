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
const COLORS=["#8D51FF","#00BBDB","#7BCE00"]


function UserDashboard() {
    useUserAuth(); 

    const { user } = useContext(UserContext); 
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);  // ✅ Fixed typo
    const [barChartData, setBarChartData] = useState([]);  // ✅ Fixed typo

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
                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5'>
                    <InfoCard
                        label="Total Task"
                        value={addTousandsSeparator(
                            dashboardData?.charts?.taskDistribution?.All || 0
                        )}
                        color="bg-blue-500"
                    />
                    <InfoCard
                        label="pendeing Task"
                        value={addTousandsSeparator(
                            dashboardData?.charts?.taskDistribution?.Pending || 0
                        )}
                        color="bg-violet-500"
                    />
                    <InfoCard
                        label="In Progress Task"
                        value={addTousandsSeparator(
                            dashboardData?.charts?.taskDistribution?.InProgress || 0
                        )}
                        color="bg-cyan-500"
                    />
                    <InfoCard
                        label="Completed Task"
                        value={addTousandsSeparator(
                            dashboardData?.charts?.taskDistribution?.Completed || 0
                        )}
                        color="bg-lime-500"
                    />
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6'>

                <div>
                    <div className='card'>
                        <div className='flex items-center justify-between'>
                            <h5 className='font-medium'>Task Distribution</h5>
                        </div>
                        <CustomPieChart
                            data={pieChartData}
                            colors={COLORS}
                        />
                    </div>
                </div>

                <div>
                    <div className='card'>
                        <div className='flex items-center justify-between'>
                            <h5 className='font-medium'>Task Priority Level</h5>
                        </div>
                        <CustomBarChart
                            data={barChartData}
                        />
                    </div>
                </div>

                <div className='md:col-span-2'>
                    <div className='card'>
                        <div className='flex items justify-between'>
                            <h5 className='card-btn'>Recent Tasks</h5>
                            <button className='card-btn' onClick={onSeeMore}>
                                See All <LuArrowDown className='text-base'/> 
                            </button>
                        </div>
                        <TaskListTable tableData={dashboardData?.recentTasks || []}/>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default UserDashboard;




/////]]]]]]