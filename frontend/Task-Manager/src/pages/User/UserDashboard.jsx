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
    const [pieChartData, setPieChartData] = useState([]);  
    const [barChartData, setBarChartData] = useState([]);  

    const [isStarted,setIsStarted]=useState(false)



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

        // setBarChartData(taskDistributionData);
        setBarChartData(data);
    }

    const getDashboardData = async () => {
        try {
            console.log("Fetching dashboard data...");
            const response = await axiosInstance.get(API_PATHS.TIMELOG.GET_SUMMARY);
            if (response.data) {
                console.log('response.data.isPunchedOut', response.data.isPunchedOut)
                if (response.data?.isPunchedOut===false){
                    setIsStarted(true);
                }
                setDashboardData(response.data.workedHoursPerDay);
                prepareChartData(response.data.workedHoursPerDay);
            }
            
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    const onSeeMore=()=>{
        navigate('/admin/tasks')
    }
    
    useEffect(() => {
      console.log("User from context",user)
        getDashboardData();
    }, [user]);

    const handleStart = async () => {
      if (!user) {
        console.warn("User not loaded yet");
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
        console.log("Check-in failed", err);
      }
    };
    
    const handleStop = async () => {
      if (!user) {
        console.warn("User not loaded yet");
        return;
      }
    
      try {
        await axiosInstance.post("/api/TimeLog/stop", { userId: user._id });
        alert("Check-out recorded.");
      } catch (err) {
        console.log("Check-out failed", err);
      }
    };
    

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
                <div className='flex gap-10 mt-4'>
                  <button 
                    className={`btn ${isStarted ? 'bg-green-600':'bg-blue-500 hover:bg-blue-600'}`} 
                    onClick={handleStart}
                    > {isStarted ? "Punch Out" : "Punch In"}
                  </button>
                  {/* <button className='btn c' onClick={handleStop}>Stop</button> */}
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-1 gap-6 my-4 md:my-6'>

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


////