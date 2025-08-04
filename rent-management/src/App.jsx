import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddProperty from './pages/AddProperty';
import AddUnit from './pages/AddUnit';
import AddTenant from './pages/AddTenant';
import PropertyDetail from './pages/PropertyDetail';
import UnitDetail from './pages/UnitDetail';
import StyleTest from './components/StyleTest';
import './App.css';

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/test" element={<StyleTest />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-property" element={<AddProperty />} />
          <Route path="add-unit" element={<AddUnit />} />
          <Route path="add-tenant" element={<AddTenant />} />
          <Route path="property/:propertyId" element={<PropertyDetail />} />
          <Route path="unit/:unitId" element={<UnitDetail />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
