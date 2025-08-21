import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { usePropertyManagement } from '../hooks/usePropertyManagement';
import DashboardStats from '../components/DashboardStats';
import LeaseStats from '../components/LeaseStats';
import PropertyFilters from '../components/PropertyFilters';
import PropertyCard from '../components/PropertyCard';

// Dashboard Home Component
function DashboardHome() {
  const [expandedProperties, setExpandedProperties] = useState(new Set());
  
  const {
    // State
    propertiesWithUnits,
    dashboardStats,
    filters,
    counties,
    cities,
    
    // Loading states
    loadingProperties,
    loadingStats,
    loadingOptions,
    
    // Error states
    propertiesError,
    statsError,
    
    // Operations
    loadPropertiesWithUnits,
    loadDashboardStats,
    loadFilterOptions,
    removeProperty,
    updateFilters
  } = usePropertyManagement();

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load filter options
  useEffect(() => {
    loadFilterOptions();
  }, []);

  // Load properties when filters change
  useEffect(() => {
    loadPropertiesWithUnits();
  }, [filters]);

  const loadDashboardData = async () => {
    await Promise.all([
      loadDashboardStats(),
      loadPropertiesWithUnits()
    ]);
  };

  const handleDeleteProperty = async (propertyId, propertyName) => {
    if (!window.confirm(`Are you sure you want to delete "${propertyName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const result = await removeProperty(propertyId);
      if (result.success) {
        // Data will be automatically refreshed by the hook
        console.log('Property deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting property:', err);
    }
  };

  const togglePropertyExpansion = (propertyId) => {
    setExpandedProperties(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  if (loadingProperties || loadingStats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-airbnb-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-airbnb-red-200 border-t-airbnb-red-500 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-airbnb-blue-400 rounded-full animate-spin mx-auto" style={{animationDelay: '0.5s'}}></div>
          </div>
          <h3 className="text-xl font-semibold text-airbnb-800 mb-2">Loading your dashboard</h3>
          <p className="text-airbnb-600">Preparing your property insights...</p>
        </div>
      </div>
    );
  }

  if (propertiesError || statsError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-airbnb p-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-airbnb-red-100 rounded-full flex items-center justify-center">
                <svg className="h-7 w-7 text-airbnb-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-airbnb-900">Error loading the dashboard</h3>
              <div className="mt-2 text-airbnb-600">{propertiesError || statsError}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-airbnb-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-airbnb-red-500 to-airbnb-red-600 rounded-airbnb-lg flex items-center justify-center mr-8 shadow-airbnb">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-6xl font-bold text-airbnb-900 mb-4">Landlord Dashboard</h1>
              <p className="text-2xl text-airbnb-600 font-medium">Manage your Kenyan property portfolio</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mb-12">
          <DashboardStats stats={dashboardStats} />
        </div>

        {/* Lease & Tenant Statistics */}
        <div className="mb-12">
          <LeaseStats stats={dashboardStats} />
        </div>

        {/* Filters */}
        <div className="mb-12">
          <PropertyFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            counties={counties}
            cities={cities}
          />
        </div>

        {/* Properties Grid */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-airbnb-900 mb-3">Your Properties</h2>
              <p className="text-airbnb-600 text-xl">
                {propertiesWithUnits?.length || 0} properties • {propertiesWithUnits?.reduce((total, p) => total + (p.units?.length || 0), 0) || 0} total units
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/dashboard/add-unit"
                className="bg-airbnb-green-500 hover:bg-airbnb-green-600 text-white font-semibold py-4 px-8 rounded-airbnb-lg transition-all duration-300 shadow-airbnb hover:shadow-airbnb-lg transform hover:-translate-y-1 flex items-center space-x-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Unit</span>
              </Link>
              
              <Link
                to="/dashboard/add-property"
                className="bg-airbnb-red-500 hover:bg-airbnb-red-600 text-white font-semibold py-4 px-8 rounded-airbnb-lg transition-all duration-300 shadow-airbnb hover:shadow-airbnb-glow transform hover:-translate-y-1 flex items-center space-x-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Add Property</span>
              </Link>
            </div>
          </div>

          {!propertiesWithUnits || propertiesWithUnits.length === 0 ? (
            <div className="card-airbnb p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-airbnb-100 to-airbnb-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-airbnb-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-airbnb-900 mb-3">No properties yet</h3>
              <p className="text-airbnb-600 text-lg mb-8 max-w-md mx-auto">Start building your property portfolio by adding your first property.</p>
              <Link
                to="/dashboard/add-property"
                className="bg-airbnb-red-500 hover:bg-airbnb-red-600 text-white font-semibold py-4 px-8 rounded-airbnb-lg transition-all duration-300 shadow-airbnb hover:shadow-airbnb-glow transform hover:-translate-y-1 inline-flex items-center space-x-3 text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Your First Property</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              {(propertiesWithUnits || []).map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onDelete={handleDeleteProperty}
                  onToggleExpansion={togglePropertyExpansion}
                  isExpanded={expandedProperties.has(property.id)}
                  showUnits={true}
                  units={property.units || []}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
function Dashboard() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-airbnb-red-600 text-white' : 'text-airbnb-100 hover:bg-airbnb-red-500 hover:text-white';
  };

  return (
    <div className="min-h-screen bg-airbnb-50 w-full">
      {/* Navigation Bar */}
      <nav className="bg-airbnb-red-500 text-white shadow-airbnb w-full sticky top-0 z-50 left-0 right-0">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-airbnb-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">Rent Tracker</h1>
            </div>
            
            <div className="flex space-x-2 sm:space-x-4">
              <Link 
                to="/dashboard" 
                className={`px-3 sm:px-4 py-2 rounded-airbnb-lg text-sm sm:text-base font-medium transition-all duration-200 ${isActive('/dashboard')}`}
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
                className={`px-3 sm:px-4 py-2 rounded-airbnb-lg text-sm sm:text-base font-medium transition-all duration-200 ${isActive('/dashboard/add-property')}`}
              >
                Add Property
              </Link>
              <Link 
                to="/dashboard/add-unit" 
                className={`px-3 sm:px-4 py-2 rounded-airbnb-lg text-sm sm:text-base font-medium transition-all duration-200 ${isActive('/dashboard/add-unit')}`}
              >
                Add Unit
              </Link>
              <Link 
                to="/dashboard/add-tenant" 
                className={`px-3 sm:px-4 py-2 rounded-airbnb-lg text-sm sm:text-base font-medium transition-all duration-200 ${isActive('/dashboard/add-tenant')}`}
              >
                Add Tenant
              </Link>
                    <Link
        to="/dashboard/add-lease"
        className={`px-3 sm:px-4 py-2 rounded-airbnb-lg text-sm sm:text-base font-medium transition-all duration-200 ${isActive('/dashboard/add-lease')}`}
      >
        Add Lease
      </Link>
      <Link
        to="/dashboard/tenants"
        className={`px-3 sm:px-4 py-2 rounded-airbnb-lg text-sm sm:text-base font-medium transition-all duration-200 ${isActive('/dashboard/tenants')}`}
      >
        View Tenants
      </Link>
      <Link
        to="/dashboard/leases"
        className={`px-3 sm:px-4 py-2 rounded-airbnb-lg text-sm sm:text-base font-medium transition-all duration-200 ${isActive('/dashboard/leases')}`}
      >
        View Leases
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="min-h-screen">
        {location.pathname === '/dashboard' ? <DashboardHome /> : <Outlet />}
      </main>
    </div>
  );
}

export default Dashboard; 