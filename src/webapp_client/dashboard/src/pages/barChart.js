import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SimpleBarChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis dataKey="visitors" />
        <Tooltip formatter={(value) => `${value} Visitors`} />
        <Legend />
        <Bar dataKey="visitors" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SimpleBarChart;