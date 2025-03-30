import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SimpleBarChart = (name1, name2, name3, name4, name5, visitor1, visitor2, visitor3, visitor4, visitor5) => {
  const data = [
    { name: {name1}, visitors: {visitor1} },
    { name: {name2}, visitors: {visitor2}},
    { name: {name3}, visitors: {visitor3}},
    { name: {name4}, visitors: {visitor4}},
    { name: {name5}, visitors: {visitor5}},
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
