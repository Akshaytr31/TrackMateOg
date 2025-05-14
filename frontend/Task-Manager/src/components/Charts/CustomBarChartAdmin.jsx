import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const darkColors = [
  '#1B1F3B', // dark navy
  '#3B1F2B', // dark maroon
  '#F94144', // red
  '#F3722C', // orange
  '#F9C74F', // yellow
  '#43AA8B', // teal
  '#277DA1', // bright blue
  '#F9844A', // coral
  '#4D908E', // turquoise
  '#FF6B6B', // rose
  '#6A4C93', // purple
  '#FFD166', // golden yellow
  '#06D6A0'  // mint green
];


function getColorForUser(userId) {
  const hash = [...userId].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return darkColors[hash % darkColors.length];
}

function TimeSummaryChart({ data, users }) {
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
          {users.map((user) => (
            <Line
              key={user._id}
              type="monotone"
              dataKey={user.name}
              stroke={getColorForUser(user._id)}
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




//////]