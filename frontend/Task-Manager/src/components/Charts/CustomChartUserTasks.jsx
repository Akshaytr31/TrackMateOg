import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const TaskChart = ({ data }) => {

  return (
    <div className="mt-10 w-full max-w-[600px] mx-auto">
      <h4 className="text-md font-semibold mb-3">Tasks Completed Per Day</h4>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>No task data available.</p>
      )}
    </div>
  );
};

export default TaskChart;
