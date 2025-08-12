import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    await supabase.from("profiles").insert([
      { id: data.user.id, email, role },
    ]);

    setLoading(false);
    alert("Account created successfully!");
    navigate("/login");
  };

  return (
    <form
      onSubmit={handleSignup}
      className="max-w-sm mx-auto mt-20 p-6 bg-white shadow rounded space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-crimson">Sign Up</h2>

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

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full max-w-xs mx-auto block border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-crimson"
      >
        <option value="tenant">Tenant</option>
        <option value="landlord">Landlord</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full max-w-xs mx-auto block bg-crimson hover:bg-red-700 transition text-white py-2 rounded font-semibold shadow"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>

      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-crimson hover:underline font-medium">
          Log in here
        </a>
      </p>

      {/* Crimson color style */}
      <style>{`.text-crimson { color: #DC143C; } .bg-crimson { background-color: #DC143C; }`}</style>
    </form>
  );
}

export default Signup;

