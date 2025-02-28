import React, { useState } from 'react'
import FilterSelector from "../components/FilterSelector";

export const Dashboard = () => {
  const [filters, setFilters] = useState({});
  return (
    <div className='home'>
        <FilterSelector onApplyFilters={setFilters} />
        <h1>THIS IS THE DASHBOARD</h1>
    </div>
  )
}

export default Dashboard