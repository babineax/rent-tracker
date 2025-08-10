<<<<<<< HEAD
<<<<<<< Updated upstream
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
=======
=======
>>>>>>> c62b25f34b00eea51181f03ec2abf78db143ae6b
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddProperty from './pages/AddProperty';
import AddUnit from './pages/AddUnit';
import AddTenant from './pages/AddTenant';
import AddLease from './pages/AddLease';
import TenantListPage from './pages/TenantListPage';
import LeaseListPage from './pages/LeaseListPage';
<<<<<<< HEAD
import MaintenanceListPage from './pages/MaintenanceListPage';
import PropertyDetail from './pages/PropertyDetail';
import UnitDetail from './pages/UnitDetail';
import StyleTest from './components/StyleTest';
import './App.css';
>>>>>>> Stashed changes
=======
import PropertyDetail from './pages/PropertyDetail';
import UnitDetail from './pages/UnitDetail';
import StyleTest from './components/StyleTest';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import './App.css';
>>>>>>> c62b25f34b00eea51181f03ec2abf78db143ae6b

function App() {
  return (
<<<<<<< HEAD
<<<<<<< Updated upstream
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
=======
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
=======
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
>>>>>>> c62b25f34b00eea51181f03ec2abf78db143ae6b
        <Route path="/test" element={<StyleTest />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-property" element={<AddProperty />} />
          <Route path="add-unit" element={<AddUnit />} />
<<<<<<< HEAD
          <Route path="add-tenant" element={<AddTenant />} />
          <Route path="add-lease" element={<AddLease />} />
          <Route path="tenants" element={<TenantListPage />} />
          <Route path="leases" element={<LeaseListPage />} />
          <Route path="maintenance" element={<MaintenanceListPage />} />
=======
                  <Route path="add-tenant" element={<AddTenant />} />
        <Route path="add-lease" element={<AddLease />} />
        <Route path="tenants" element={<TenantListPage />} />
        <Route path="leases" element={<LeaseListPage />} />
>>>>>>> c62b25f34b00eea51181f03ec2abf78db143ae6b
          <Route path="property/:propertyId" element={<PropertyDetail />} />
          <Route path="unit/:unitId" element={<UnitDetail />} />
        </Route>
      </Routes>
    </div>
  );
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> c62b25f34b00eea51181f03ec2abf78db143ae6b
}

export default App;
