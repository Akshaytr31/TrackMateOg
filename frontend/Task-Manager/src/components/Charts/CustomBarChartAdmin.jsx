import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// function getRandomDarkColor() {
//   let color = '#';
//   for (let i = 0; i < 3; i++) {
  
//     const value = Math.floor(Math.random() * 200); 
//     color += value.toString(16).padStart(2, '0');
//   }
//   return color;
// }


const darkColors = [
  '#1B1F3B', // dark navy (1)
  '#3B1F2B', // dark maroon (2)
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


function getRandomDarkColor() {
  const randomIndex = Math.floor(Math.random() * darkColors.length);
  return darkColors[randomIndex];
}



function generateUserColors(userCount) {
  return Array.from({ length: userCount }, getRandomDarkColor);
}

function TimeSummaryChart({ data, users }) {
  const COLORS = generateUserColors(users);

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



































































