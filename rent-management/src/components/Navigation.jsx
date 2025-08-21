import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  const isActive = (path) => {
    return location.pathname === path ? 'bg-airbnb-red-600 text-white' : 'text-white hover:bg-airbnb-red-500 hover:text-white';
  };

  return (
<<<<<<< HEAD
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
              to="/dashboard/finance" 
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors ${isActive('/dashboard/finance')}`}
            >
              Finance
            </Link>
=======
    <div className="w-full sticky top-0 z-50 left-0 right-0">
      {/* Major Navbar */}
      <nav className="bg-airbnb-red-500 text-white shadow-airbnb">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-airbnb-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <Link to="/dashboard" className="text-xl sm:text-2xl font-bold">RentEase</Link>
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              <Link to="/dashboard" className={`px-3 sm:px-4 py-2 rounded-airbnb-lg text-sm sm:text-base font-medium transition-all duration-200 ${isActive('/dashboard')}`}>
                Dashboard
              </Link>
              <Link to="/dashboard/rent-log" className={`px-3 sm:px-4 py-2 rounded-airbnb-lg text-sm sm:text-base font-medium transition-all duration-200 ${isActive('/dashboard/rent-log')}`}>
                Rent Log
              </Link>
              <Link to="/dashboard/maintenance" className={`px-3 sm:px-4 py-2 rounded-airbnb-lg text-sm sm:text-base font-medium transition-all duration-200 ${isActive('/dashboard/maintenance')}`}>
                Maintenance
              </Link>
            </div>
>>>>>>> origin/dev
          </div>
        </div>
      </nav>

      {/* Secondary Navbar */}
      <nav className="bg-airbnb-red-600 text-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-12">
            <div className="flex space-x-2 sm:space-x-4">
              <Link to="/dashboard/add-property" className={`px-3 sm:px-4 py-1 rounded-airbnb-lg text-xs sm:text-sm font-medium transition-all duration-200 ${isActive('/dashboard/add-property')}`}>
                Add Property
              </Link>
              <Link to="/dashboard/add-unit" className={`px-3 sm:px-4 py-1 rounded-airbnb-lg text-xs sm:text-sm font-medium transition-all duration-200 ${isActive('/dashboard/add-unit')}`}>
                Add Unit
              </Link>
              <Link to="/dashboard/add-tenant" className={`px-3 sm:px-4 py-1 rounded-airbnb-lg text-xs sm:text-sm font-medium transition-all duration-200 ${isActive('/dashboard/add-tenant')}`}>
                Add Tenant
              </Link>
              <Link to="/dashboard/add-lease" className={`px-3 sm:px-4 py-1 rounded-airbnb-lg text-xs sm:text-sm font-medium transition-all duration-200 ${isActive('/dashboard/add-lease')}`}>
                Add Lease
              </Link>
              <Link to="/dashboard/tenants" className={`px-3 sm:px-4 py-1 rounded-airbnb-lg text-xs sm:text-sm font-medium transition-all duration-200 ${isActive('/dashboard/tenants')}`}>
                View Tenants
              </Link>
              <Link to="/dashboard/leases" className={`px-3 sm:px-4 py-1 rounded-airbnb-lg text-xs sm:text-sm font-medium transition-all duration-200 ${isActive('/dashboard/leases')}`}>
                View Leases
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;