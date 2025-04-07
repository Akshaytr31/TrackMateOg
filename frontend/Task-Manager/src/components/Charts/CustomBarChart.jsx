import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function TimeSummaryChart({ data }) {
  return (
    <div className='bg-white mt-6 rounded-lg p-4 shadow-sm'>
      <h4 className='text-lg font-semibold mb-3 text-gray-700'>Time Spent in Office</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis
            dataKey="hours"
            label={{ value: 'hours', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
            
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="hours"
            stroke="#00BBDB"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TimeSummaryChart;





///]