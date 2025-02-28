import React, { useState } from 'react'
import FilterSelector from "../components/FilterSelector";

export const Dashboard = () => {
  const [filters, setFilters] = useState({});
  const snippet = `<script type="module" data-webvitals-widget src="http://localhost:3000/widget.js" data-user-id="1" defer></script>`;

  return (
    
    <div className='home'>
      <div style={{ borderRadius: '10px', border: '1px solid #ccc', padding: '1rem' }}>
        <input type="text" readOnly value={snippet} />
      </div>
      <FilterSelector onApplyFilters={setFilters} />
      <h1>THIS IS THE DASHBOARD</h1>
    </div>
    
  )
}

export default Dashboard