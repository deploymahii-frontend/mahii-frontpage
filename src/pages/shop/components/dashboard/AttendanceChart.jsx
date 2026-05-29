import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const AttendanceChart = ({ data }) => {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-white">Attendance Trend</h3>
        <Activity size={18} className="text-gray-400" />
      </div>
      {hasData ? (
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} />
            <YAxis stroke="#9CA3AF" fontSize={10} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="breakfast" stackId="1" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.6} />
            <Area type="monotone" dataKey="lunch" stackId="1" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.6} />
            <Area type="monotone" dataKey="dinner" stackId="1" stroke="#2196F3" fill="#2196F3" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[250px] flex items-center justify-center text-gray-500">No attendance data available</div>
      )}
    </div>
  );
};

export default AttendanceChart;