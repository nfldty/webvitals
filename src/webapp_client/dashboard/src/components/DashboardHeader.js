import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../style.css';

export const DashboardHeader = () => {
    return (
        <header className="dashboard-header">
            <h1>Webvitals Dashboard</h1>
        </header>
    )
}

export default DashboardHeader;
