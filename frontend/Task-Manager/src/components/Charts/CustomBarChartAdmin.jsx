import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

function getRandomDarkColor() {
  let color = '#';
  for (let i = 0; i < 3; i++) {
    // Generate darker color channels (0-150 instead of 0-255)
    const value = Math.floor(Math.random() * 150); 
    color += value.toString(16).padStart(2, '0');
  }
  return color;
}


function generateUserColors(userCount) {
  return Array.from({ length: userCount }, getRandomDarkColor);
}

function TimeSummaryChart({ data, users }) {
  const COLORS = generateUserColors(users.length);

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
              dataKey={user.name}
              stroke={COLORS[index]}
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
