import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpeg'; 
function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <img src={logo} alt="Logo" className="w-32 h-32 mb-6" />
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome to RentEase</h1>
      <p className="mb-8 text-gray-600 text-center">Track and manage your properties with ease.</p>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/signup')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
        <button
          onClick={() => navigate('/login')}
          className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
