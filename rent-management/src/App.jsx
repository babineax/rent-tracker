import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./components/landing";
import Signup from "./components/signup";
import Login from "./components/login";
import DashboardTenant from "./components/Dashboard/DashboardTenant";
import { supabase } from "./supabaseClient";

// Protected route component
function ProtectedRoute({ children, allowedRole }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUser(user);

      // Get role from profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setRole(profile?.role || null);
      setLoading(false);
    }
    fetchUser();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" replace />;

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected dashboards */}
        <Route
          path="/dashboard-tenant"
          element={
            <ProtectedRoute allowedRole="tenant">
              <DashboardTenant />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

