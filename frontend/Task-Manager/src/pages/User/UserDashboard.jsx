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
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import CustomBarChart from '../../components/Charts/CustomBarChart';
import ViewTaskDetails from '../User/ViewTaskDetails'
import moment from 'moment';
import TaskChart from '../../components/Charts/CustomChartUserTasks'

const COLORS=["#8D51FF","#00BBDB","#7BCE00"]


function UserDashboard() {
    useUserAuth(); 

    const { user } = useContext(UserContext); 
    const navigate = useNavigate();
    const [barChartData, setBarChartData] = useState([]);  
    const [isStarted, setIsStarted] = useState(false);
    const [myTasks, setMyTasks] = useState([]);

    const [activeGraph, setActiveGraph] = useState("time");
    const [taskStats, setTaskStats] = useState([]);



    const getDashboardData = async () => {
        try {
            const response = await axiosInstance.post(API_PATHS.TIMELOG.GET_SUMMARY);
            if (response.data) {
                if (response.data?.isPunchedOut===false){
                    setIsStarted(true);
                }
                setBarChartData(response.data.workedHoursPerDay);
            }
            
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };
    
    useEffect(() => {
        getDashboardData();
    }, [user]);

    const handleStart = async () => {
      if (!user) {
        window.location.href = "/login";
        return;
      }
    
      try {
        const response = await axiosInstance.get("/api/timelog/punch");

        if(response.data?.punch.outTime===null){
            setIsStarted(true);
        }else{
            setIsStarted(false);
        }
      } catch (err) {
        console.error("Check-in failed", err);
      }
    };




const fetchMyTasks = async () => {
    try {
        const res = await axiosInstance.get(`/api/tasks/assigned/${user._id}`);
 
        setMyTasks(res.data);
       
        // Group completed tasks by date
        const completedTasks = res.data.filter(task => task.status.toLowerCase() === 'completed');
        const grouped = completedTasks.reduce((acc, task) => {
        const date = new Date(task.updatedAt).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
    
        const taskChartData = Object.entries(grouped).map(([date, count]) => ({
            date,
            count,
        }));
        setTaskStats(taskChartData);
    } catch (err) {
        console.error("Couldn't load tasks", err);
    }
};
    
      
    useEffect(() => {
    if (user?._id) fetchMyTasks();
    }, [user]);
    
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
                <div className='flex gap-10 mt-4'>
                <button 
                    className={`btn w-[117.3px] transition-all duration-150 active:scale-99 active:opacity-80 ${isStarted ? 'bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`} 
                    onClick={handleStart}
                    >
                    {isStarted ? "Punch Out" : "Punch In"}
                </button>

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
            <ViewTaskDetails/>

        </DashboardLayout>
    );
}

export default UserDashboard;

