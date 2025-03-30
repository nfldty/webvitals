import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SimpleBarChart = () => {
  const data = [
    { name: 'Item A', visitors: 100 },
    { name: 'Item B', visitors: 200 },
    { name: 'Item C', visitors: 150 },
    { name: 'Item D', visitors: 150 },
    { name: 'Item E', visitors: 150 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => `${value} Visitors`} />
        <Legend />
        <Bar dataKey="visitors" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SimpleBarChart;
