import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/dashboard" className="text-xl font-bold">
            Rent Tracker
          </Link>
          
          <div className="flex space-x-4">
            <Link 
              to="/dashboard" 
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActive('/dashboard')}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/dashboard/maintenance" 
              className={`px-3 sm:px-4 py-2 rounded-airbnb-lg text-sm sm:text-base font-medium transition-all duration-200 ${isActive('/dashboard/maintenance')}`}
            >
              Maintenance
            </Link>
            <Link 
              to="/dashboard/add-property" 
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActive('/dashboard/add-property')}`}
            >
              Add Property
            </Link>
            <Link 
              to="/dashboard/add-tenant" 
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActive('/dashboard/add-tenant')}`}
            >
              Add Tenant
            </Link>
            <Link 
              to="/dashboard/expense-tracker" 
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActive('/dashboard/expense-tracker')}`}
            >
              Expense Tracker
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 