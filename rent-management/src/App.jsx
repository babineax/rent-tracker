import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddProperty from './pages/AddProperty';
import AddUnit from './pages/AddUnit';
import AddTenant from './pages/AddTenant';
import AddLease from './pages/AddLease';
import TenantListPage from './pages/TenantListPage';
import LeaseListPage from './pages/LeaseListPage';
import FinanceDashboard from './pages/FinanceDashboard';
import PropertyDetail from './pages/PropertyDetail';
import UnitDetail from './pages/UnitDetail';
import StyleTest from './components/StyleTest';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<StyleTest />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-property" element={<AddProperty />} />
          <Route path="add-unit" element={<AddUnit />} />
                  <Route path="add-tenant" element={<AddTenant />} />
        <Route path="add-lease" element={<AddLease />} />
        <Route path="tenants" element={<TenantListPage />} />
        <Route path="leases" element={<LeaseListPage />} />
        <Route path="finance" element={<FinanceDashboard />} />
          <Route path="property/:propertyId" element={<PropertyDetail />} />
          <Route path="unit/:unitId" element={<UnitDetail />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
