import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/rentease-logo.jpg";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Logo */}
      <img
        src={logo}
        alt="RentEase Logo"
        className="w-40 h-40 mb-4 rounded-full shadow"
      />

      {/* Brand Name */}
      <h1 className="text-3xl font-bold text-center mb-2">RentEase</h1>

      {/* Headline */}
      <h2 className="text-2xl font-extrabold text-center mb-4">
        Simplify Renting
      </h2>

      {/* Subtext */}
      <p className="mb-8 text-gray-600 text-center max-w-md">
        A seamless property rental experience for landlords and tenants.
        Manage, track, and connect — all in one place.
      </p>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/signup")}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Get Started
        </button>
        <button
          onClick={() => navigate("/login")}
          className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400"
        >
          Login
        </button>
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-500 mt-8">
        © {new Date().getFullYear()} RentEase. All rights reserved.
      </p>
    </div>
  );
}

export default Landing;



