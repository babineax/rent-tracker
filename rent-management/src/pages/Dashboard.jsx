import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from '../components/Navigation';
import DashboardHome from '../pages/DashboardHome';

function Dashboard() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-airbnb-50 w-full">
      {/* Navigation Bar */}
      <Navigation />
      {/* Main Content */}
      <main className="min-h-screen">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {location.pathname === '/dashboard' ? <DashboardHome /> : <Outlet />}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;