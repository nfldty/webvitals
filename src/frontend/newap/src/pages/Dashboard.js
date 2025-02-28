import React, { useState } from 'react'
import FilterSelector from "../components/FilterSelector";

export const Dashboard = () => {
  const [filters, setFilters] = useState({});
  const snippet = `<script type="module" data-webvitals-widget src="http://localhost/widget.js" data-user-id="1" defer></script>`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
      <div style={{ borderRadius: '10px', border: '1px solid #ccc', padding: '1rem', maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        <p>Below is your webvitals widget; please insert into your web page.</p>
        <input type="text" readOnly value={snippet} style={{ width: '100%', margin: '1rem 0' }} />
      </div>
      <FilterSelector onApplyFilters={setFilters} />
      <h1 style={{ textAlign: 'center', marginTop: '2rem' }}>THIS IS THE DASHBOARD</h1>
    </div>
  )
}

export default Dashboard