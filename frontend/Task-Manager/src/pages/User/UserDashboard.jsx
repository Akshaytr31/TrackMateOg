// import { addTousandsSeparator } from '../../utils/helper';
// import InfoCard from '../../components/Cards/InfoCard';
// import { LuArrowDown } from 'react-icons/lu';
// import TaskListTable from '../../components/Tables/TaskListTable';
// import CustomPieChart from '../../components/Charts/CustomPieChart';
// import TaskListTable from '../../components/Tables/TaskListTable';


import { UserContext } from '../../context/userContext';
import React, { useContext, useEffect, useState } from 'react';
import useUserAuth from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import CustomBarChart from '../../components/Charts/CustomBarChart';
import ViewTaskDetails from '../User/ViewTaskDetails'
import moment from 'moment';
import TaskChart from '../../components/Charts/CustomChartUserTasks'

const COLORS = ["#8D51FF", "#00BBDB", "#7BCE00"]


function UserDashboard() {
    useUserAuth();

    const { user } = useContext(UserContext);
    const [barChartData, setBarChartData] = useState([]);

    const [activeGraph, setActiveGraph] = useState("time");
    const [taskStats, setTaskStats] = useState([]);


    const getDashboardData = async () => {
        try {
            const response = await axiosInstance.post(API_PATHS.TIMELOG.GET_SUMMARY);
            if (response.data) {
                setBarChartData(response.data.workedHoursPerDay);
            }

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    useEffect(() => {
        getDashboardData();
    }, [user?._id]);
    
    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className="card my-5">
                <div>
                    <div className="task my-5 bg-[#6b707a]">
                        <h2 className="text-xl md:text-2xl text-white font-medium">
                            Welcome {user?.name || "Guest"}
                        </h2>
                        <p className="text-xs text-gray-300 mt-1.5">{moment().format("dddd Do MMMM YYYY")}</p>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-1 gap-6 my-4 md:my-6'>

                <div>
                    <div className='card'>
                        <div className='flex items-center justify-between'>
                            <h5 className='font-medium'>Work Flow Level</h5>
                            <div className='flex gap-[30px]'>
                                <button
                                    className={`truncated-btn  ${activeGraph === "time" ? "bg-blue-500 text-white" : ""}`}
                                    onClick={() => setActiveGraph("time")}
                                >
                                    Time Graph
                                </button>
                                <button
                                    className={`truncated-btn  ${activeGraph === "task" ? "bg-blue-500 text-white" : ""}`}
                                    onClick={() => setActiveGraph("task")}
                                >
                                    Task Graph
                                </button>
                            </div>

                        </div>
                        {activeGraph === "time" ? (
                            <CustomBarChart data={barChartData} />
                        ) : (
                            <TaskChart data={taskStats} />
                        )}
                    </div>
                </div>
            </div>
            <ViewTaskDetails />

        </DashboardLayout>
    );
}

export default UserDashboard;


/////