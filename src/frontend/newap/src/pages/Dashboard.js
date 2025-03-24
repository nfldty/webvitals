import React, { useState } from 'react';
import FilterSelector from '../components/FilterSelector';

export const Dashboard = () => {
  const [filters, setFilters] = useState({});
  const snippet = `<script type="module" data-webvitals-widget src="http://localhost/widget.js" data-user-id="1" defer></script>`;

  return (
    <div className="flex flex-col items-center px-4 py-8">
      <div className="rounded-xl border border-gray-300 p-4 w-full max-w-xl text-center bg-white shadow-sm">
        <p className="text-sm sm:text-base mb-2">
          Below is your webvitals widget; please insert into your web page.
        </p>
        <input
          type="text"
          readOnly
          value={snippet}
          className="w-full text-sm p-2 border border-gray-300 rounded bg-gray-100 mb-4 font-mono"
        />
      </div>

      <div className="w-full max-w-xl mt-6">
        <FilterSelector onApplyFilters={setFilters} />
      </div>

      <h1 className="text-center text-2xl sm:text-3xl font-semibold mt-10">
        THIS IS THE DASHBOARD
      </h1>
    </div>
  );
};

export default Dashboard;
