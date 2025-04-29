import React, { useState } from 'react';

import CustomTimeChart from '../Charts/CustomBarChartAdmin'
import CustomTaskChart from '../Charts/CustomTaskSummeryCharts'

const GraphToggleCard = ({ barChartData }) => {
  const [activeGraph, setActiveGraph] = useState('time');


  return (
    <div className='flex-1 min-w-[300px] card'>
      <div className='flex justify-between gap-[30px]'>
        <div>
          <h5 className='font-medium mb-4'>Work Flow Level</h5>
        </div>
        <div className='flex gap-[30px]'>
          <button
            className={`truncated-btn ${activeGraph === 'time' ? 'bg-blue-100' : ''}`}
            onClick={() => setActiveGraph('time')}
          >
            Time Graph
          </button>
          <button
            className={`truncated-btn ${activeGraph === 'task' ? 'bg-blue-100' : ''}`}
            onClick={() => setActiveGraph('task')}
          >
            Task Graph
          </button>
        </div>
      </div>

      {activeGraph === 'time' ? (
        <CustomTimeChart data={barChartData?.workedHoursPerDay} users={barChartData?.users} />
      ) : (
        <CustomTaskChart data={barChartData?.taskCountPerDay} users={barChartData?.users} />
      )}
    </div>
  );
};

export default GraphToggleCard;


