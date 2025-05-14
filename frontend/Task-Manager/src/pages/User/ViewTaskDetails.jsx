import React, { useEffect, useState, useContext, useRef } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { UserContext } from '../../context/userContext';
import TruncatedText from '../../components/DashboardComponents/TruncatedText';


function ViewTaskDetails() {
  const [myTasks, setMyTasks] = useState([]);
  const [timers, setTimers] = useState({});
  const { user } = useContext(UserContext);
  const [taskStats, setTaskStats] = useState([]);
  const intervalRefs = useRef({});

  const registerTime = async (taskId) => {
    try {
      const res = await axiosInstance.get(`/api/timeLog/register/time/${taskId}`);
    } catch (err) {
      console.error("Couldn't register time.", err);
    }
  };

  const handleTimerToggle = (taskId) => {
    const isRunning = timers[taskId]?.isRunning;//check timer for the task is running//
    if (isRunning) {
      registerTime(taskId);
      clearInterval(intervalRefs.current[taskId]);
      intervalRefs.current[taskId] = null;

      setTimers((prev) => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          isRunning: false,
        },
      }));
    } else {
      // Start the timer
      registerTime(taskId);

      if (intervalRefs.current[taskId]) {
        clearInterval(intervalRefs.current[taskId]);
      }

      const intervalId = setInterval(() => {
        setTimers((prev) => ({
          ...prev,
          [taskId]: {
            ...prev[taskId],
            time: (prev[taskId]?.time || 0) + 1,
          },
        }));
      }, 1000);

      intervalRefs.current[taskId] = intervalId;

      setTimers((prev) => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          time: prev[taskId]?.time || 0,
          isRunning: true,
          intervalId
        },
      }));
    }
  };

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    Object.values(intervalRefs.current).forEach(interval => {
      if (interval) clearInterval(interval);
    });
    intervalRefs.current = {};

    const fetchMyTasks = async () => {
      try {
        const res = await axiosInstance.get(`/api/tasks/assigned`);
        setMyTasks(res.data);

        const initialTimers = {};

        res.data.forEach((task) => {

          initialTimers[task._id] = {
            time: Math.ceil(task.time / 1000) || 0,
            isRunning: task.isRunning || false,
          };

          if (task.isRunning) {

            if (intervalRefs.current[task._id]) {
              // console.log('clear interval', intervalRefs.current[task._id]);//
              clearInterval(intervalRefs.current[task._id]);
            }

            const intervalId = setInterval(() => {
              setTimers((prev) => ({
                ...prev,
                [task._id]: {//target specific task
                  ...prev[task._id],//copy the data from the task for modify as we wish//
                  time: (prev[task._id]?.time || 0) + 1,
                  isRunning: true
                },
              }));
            }, 1000);

            intervalRefs.current[task._id] = intervalId;
          }
        });

        setTimers(initialTimers);

      } catch (err) {
        console.error("Couldn't load tasks", err);
      }
    };

    fetchMyTasks();

    return () => {

      Object.values(intervalRefs.current).forEach(interval => {
        if (interval) clearInterval(interval);
      });

      intervalRefs.current = {};

    };
  }, [user?._id]);

  const handleStatusToggle = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'
    try {
      await axiosInstance.patch(`/api/tasks/${taskId}/status`, { status: newStatus })

      setMyTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id == taskId ? { ...task, status: newStatus } : task
        )
      )
    } catch (err) {
      console.error("failed to update task status", err)
    }
  }

  return (
    <div className='card mt-6'>
      <h3 className='text-lg font-semibold mb-4'>My Tasks</h3>
      {myTasks.length > 0 ? (
        <ul className="space-y-3 flex flex-wrap gap-1 justify-around gap-y-8">
          {myTasks.map(task => {
            const taskTimer = timers[task._id] || { time: 0, isRunning: false };
            return (
              <li key={task._id} className='p-4 bg-gray-100 rounded-lg flex justify-between items-center flex-col min-w-[250px] gap-4 m-0'>
                <div className='flex justify-between w-full gap-[10px]'>
                  <TruncatedText text={task.title} maxWidth="300px" />
                  <p className={`text-sm font-medium w-[80px] flex items-center justify-center ${task.status.toLowerCase() === 'completed' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </p>

                </div>
                <p className='text-2xl text-gray-600 w-[85px]'>{formatTime(taskTimer.time)}</p>
                <div className='flex justify-between w-full gap-1 items-center '>
                  <button
                    className={`task-start-btn px-4 py-1 rounded w-[60px] ${taskTimer.isRunning ? 'bg-red-500' : 'bg-green-500'
                      } text-white`}
                    onClick={() => handleTimerToggle(task._id)}
                  >
                    {taskTimer.isRunning ? 'Stop' : 'Start'}
                  </button>
                  <button
                    className={`task-start-btn text-white px-3 py-1 rounded transition duration-200 ease-in-out
                        ${task.status === 'Completed' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                    onClick={() => handleStatusToggle(task._id, task.status)}
                  >
                    {task.status === 'Completed' ? 'Uncomplete' : 'Complete'}
                  </button>

                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No tasks assigned.</p>
      )}
    </div>
  );
}

export default ViewTaskDetails;



/////