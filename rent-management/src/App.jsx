<<<<<<< Updated upstream
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
=======
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddProperty from './pages/AddProperty';
import AddUnit from './pages/AddUnit';
import AddTenant from './pages/AddTenant';
import AddLease from './pages/AddLease';
import TenantListPage from './pages/TenantListPage';
import LeaseListPage from './pages/LeaseListPage';
import MaintenanceListPage from './pages/MaintenanceListPage';
import PropertyDetail from './pages/PropertyDetail';
import UnitDetail from './pages/UnitDetail';
import StyleTest from './components/StyleTest';
import './App.css';
>>>>>>> Stashed changes

function App() {
  const [count, setCount] = useState(0)

  return (
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
        <Route path="/test" element={<StyleTest />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-property" element={<AddProperty />} />
          <Route path="add-unit" element={<AddUnit />} />
          <Route path="add-tenant" element={<AddTenant />} />
          <Route path="add-lease" element={<AddLease />} />
          <Route path="tenants" element={<TenantListPage />} />
          <Route path="leases" element={<LeaseListPage />} />
          <Route path="maintenance" element={<MaintenanceListPage />} />
          <Route path="property/:propertyId" element={<PropertyDetail />} />
          <Route path="unit/:unitId" element={<UnitDetail />} />
        </Route>
      </Routes>
    </div>
  );
>>>>>>> Stashed changes
}

export default App
