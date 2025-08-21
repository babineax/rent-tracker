import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation'; // Adjust path as needed
import DashboardHome from '../pages/DashboardHome'; // Adjust path as needed

function Dashboard() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-airbnb-50 w-full">
      {/* Navigation Bar */}
      <Navigation />
      {/* Main Content */}
      <main className="min-h-screen">
        {location.pathname === '/dashboard' ? <DashboardHome /> : <Outlet />}
      </main>
    </div>
  );
}

export default Dashboard;