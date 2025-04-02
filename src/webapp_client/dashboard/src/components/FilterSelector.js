// src/components/FilterSelector.js
import { useState } from "react";

export default function FilterSelector({ oncli, onApplyFilters }) {
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [pageUrl, setPageUrl] = useState("");
    const [elapsedTime, setElapsedTime] = useState("");

    const handleApplyFilters = () => {
        // Send the filters to the parent component
        onApplyFilters({
            start_time: startTime,
            end_time: endTime,
            page_url: pageUrl,
            elapsed_time: elapsedTime
        });
        // Trigger the API call in the parent
        oncli();
    };

    return (
        <div className="filter-container">
            <h2>Filter Logs</h2>
            <div className="filter-group">
                <label>Start Time</label>
                <input 
                  type="datetime-local" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)} 
                />
            </div>
            <div className="filter-group">
                <label>End Time</label>
                <input 
                  type="datetime-local" 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)} 
                />
            </div>
            <div className="filter-group">
                <label>Page URL</label>
                <input 
                  type="text" 
                  value={pageUrl} 
                  onChange={(e) => setPageUrl(e.target.value)} 
                  placeholder="e.g. example" 
                />
            </div>
            <div className="filter-group">
                <label>Time Spent (seconds): </label>
                <input 
                  type="text" 
                  value={elapsedTime} 
                  onChange={(e) => setElapsedTime(e.target.value)} 
                  placeholder="e.g. >=100" 
                />
            </div>
            <button onClick={handleApplyFilters} className="apply-button">
              Apply Filters
            </button>
        </div>
    );
}
