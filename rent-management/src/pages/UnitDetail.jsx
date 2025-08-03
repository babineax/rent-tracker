import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getUnitById, deleteUnit } from '../services/propertyManagementService.js';

function UnitDetail() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUnitDetails();
  }, [unitId]);

  const loadUnitDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await getUnitById(unitId);

      if (error) {
        throw new Error(error);
      }

      setUnit(data);
    } catch (err) {
      console.error('Error loading unit details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUnit = async () => {
    if (!window.confirm(`Are you sure you want to delete unit "${unit?.unit_number}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const result = await deleteUnit(unitId);
      if (result.error) {
        throw new Error(result.error);
      }

      alert('Unit deleted successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting unit:', err);
      alert(`Error deleting unit: ${err.message}`);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading unit</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Unit not found</h1>
          <p className="mt-2 text-gray-600">The unit you're looking for doesn't exist.</p>
          <Link
            to="/dashboard"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Unit {unit.unit_number}</h1>
            <p className="mt-2 text-gray-600">
              {unit.properties?.name} • {unit.properties?.city}, {unit.properties?.county}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/dashboard/property/${unit.property_id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              View Property
            </Link>
            <button
              onClick={handleDeleteUnit}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Delete Unit
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Unit Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Unit Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Unit Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Unit Number:</span>
                    <p className="text-sm font-medium text-gray-900">{unit.unit_number}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Unit Type:</span>
                    <p className="text-sm font-medium text-gray-900 capitalize">{unit.unit_type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      unit.is_available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {unit.is_available ? 'Available' : 'Occupied'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Bedrooms:</span>
                    <p className="text-sm font-medium text-gray-900">{unit.bedrooms}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Bathrooms:</span>
                    <p className="text-sm font-medium text-gray-900">{unit.bathrooms}</p>
                  </div>
                  {unit.square_feet && (
                    <div>
                      <span className="text-sm text-gray-500">Square Feet:</span>
                      <p className="text-sm font-medium text-gray-900">{unit.square_feet} sq ft</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Financial Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Monthly Rent:</span>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(unit.rent_amount)}</p>
                  </div>
                  {unit.deposit_amount && (
                    <div>
                      <span className="text-sm text-gray-500">Deposit Amount:</span>
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(unit.deposit_amount)}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-500">Currency:</span>
                    <p className="text-sm font-medium text-gray-900">{unit.rent_currency}</p>
                  </div>
                </div>
              </div>
            </div>

            {unit.description && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-sm text-gray-900">{unit.description}</p>
              </div>
            )}
          </div>

          {/* Amenities Card */}
          {unit.amenities && unit.amenities.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {unit.amenities.map((amenity, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Property Information Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Property Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Property Name:</span>
                    <p className="text-sm font-medium text-gray-900">{unit.properties?.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Address:</span>
                    <p className="text-sm text-gray-900">{unit.properties?.address}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">City:</span>
                    <p className="text-sm font-medium text-gray-900">{unit.properties?.city}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">County:</span>
                    <p className="text-sm font-medium text-gray-900">{unit.properties?.county}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
                <div className="space-y-3">
                  {unit.properties?.phone_number && (
                    <div>
                      <span className="text-sm text-gray-500">Phone:</span>
                      <p className="text-sm font-medium text-gray-900">📞 {unit.properties.phone_number}</p>
                    </div>
                  )}
                  {unit.properties?.postal_code && (
                    <div>
                      <span className="text-sm text-gray-500">Postal Code:</span>
                      <p className="text-sm font-medium text-gray-900">{unit.properties.postal_code}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to={`/dashboard/add-unit?propertyId=${unit.property_id}`}
                className="w-full bg-green-600 text-white text-center py-2 px-4 rounded-md hover:bg-green-700 transition-colors block"
              >
                Add Another Unit
              </Link>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Edit Unit
              </button>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
                View Leases
              </button>
              <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors">
                Maintenance Requests
              </button>
            </div>
          </div>

          {/* Unit Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Unit Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Created:</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(unit.created_at)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Last Updated:</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(unit.updated_at)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Unit ID:</span>
                <span className="text-sm font-medium text-gray-900 font-mono">{unit.id.slice(0, 8)}...</span>
              </div>
            </div>
          </div>

          {/* Back to Dashboard */}
          <div className="bg-gray-50 rounded-lg p-4">
            <Link
              to="/dashboard"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnitDetail; 