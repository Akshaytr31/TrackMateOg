import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

function TimeSummaryChart({ data, users }) {
  const COLORS = ['#00BBDB', '#FF6B6B', '#6BCB77', '#4D96FF', '#FFD93D', '#A66DD4'];

  return (
    <div className='bg-white mt-6 rounded-lg p-4 shadow-sm'>
      <h4 className='text-lg font-semibold mb-3 text-gray-700'>Time Spent in Office</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis
            label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Legend />
          {users.map((user, index) => (
            <Line
              key={user._id}
              type="monotone"
              dataKey={user.name} // each user's data should be keyed by their name
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TimeSummaryChart;
