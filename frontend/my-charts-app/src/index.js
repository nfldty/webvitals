import React, { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sampleData = [
  { name: "Jan", value: 30 },
  { name: "Feb", value: 50 },
  { name: "Mar", value: 80 },
  { name: "Apr", value: 40 },
  { name: "May", value: 100 }
];

export default function InteractiveCharts() {
  const [zoom, setZoom] = useState(1);
  
  const handleClick = (data) => {
    alert(`Clicked on: ${data.name}, Value: ${data.value}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-2">Bar Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" onClick={(data) => handleClick(data)} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-2">Pie Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={sampleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label onClick={(data) => handleClick(data)} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-2">Line Chart</h2>
          <Button onClick={() => setZoom(zoom + 0.2)} className="mb-2">Zoom In</Button>
          <Button onClick={() => setZoom(Math.max(1, zoom - 0.2))} className="mb-2 ml-2">Zoom Out</Button>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100 * zoom]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#ff7300" onClick={(data) => handleClick(data)} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
