import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const darkColors = [
  '#1B1F3B', '#3B1F2B', '#F94144', '#F3722C', '#F9C74F',
  '#43AA8B', '#277DA1', '#F9844A', '#4D908E', '#FF6B6B',
  '#6A4C93', '#FFD166', '#06D6A0'
];

function getRandomDarkColor() {
  const randomIndex = Math.floor(Math.random() * darkColors.length);
  return darkColors[randomIndex];
}

function generateUserColors(userCount) {
  return Array.from({ length: userCount }, getRandomDarkColor);
}

function TaskSummaryChart({ data, users }) {
  const COLORS = generateUserColors(users.length);

  return (
    <div className='bg-white mt-6 rounded-lg p-4 shadow-sm'>
      <h4 className='text-lg font-semibold mb-3 text-gray-700'>Tasks Completed Per Day</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis
            label={{ value: 'Tasks', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
            allowDecimals={false}
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

export default TaskSummaryChart;
