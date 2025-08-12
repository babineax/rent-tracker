import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setLoading(false);

    if (profileError || !profile) {
      setErrorMsg("Could not retrieve role. Contact admin.");
      return;
    }

    if (profile.role === "landlord") navigate("/dashboard-landlord");
    else if (profile.role === "tenant") navigate("/dashboard-tenant");
    else setErrorMsg("Unknown role.");
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-sm mx-auto mt-20 p-6 bg-white shadow rounded space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-crimson">Login</h2>

      {errorMsg && (
        <div className="text-sm text-red-600 text-center font-medium">{errorMsg}</div>
      )}

      <input
        type="email"
        placeholder="Email"
        className="w-full max-w-xs mx-auto block border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-crimson"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full max-w-xs mx-auto block border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-crimson"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full max-w-xs mx-auto block bg-crimson hover:bg-red-700 transition text-white py-2 rounded font-semibold shadow"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="text-sm text-center mt-4">
        Don’t have an account?{" "}
        <a href="/signup" className="text-crimson hover:underline font-medium">
          Sign up here
        </a>
      </p>

      {/* Add this style so Tailwind knows about crimson */}
      <style>{`.text-crimson { color: #DC143C; } .bg-crimson { background-color: #DC143C; }`}</style>
    </form>
  );
}

export default Login;




