import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    setLoading(false);

    if (profileError || !profile) {
      setErrorMsg('Could not retrieve role. Contact admin.');
      return;
    }

    // ✅ Role-based navigation
    if (profile.role === 'landlord') navigate('/dashboard-landlord');
    else if (profile.role === 'tenant') navigate('/dashboard-tenant');
    else setErrorMsg('Unknown role. Please check your account.');
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto mt-20 p-8 bg-white shadow-lg rounded space-y-5 border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-center text-red-500">Login to RentEase</h2>

      {errorMsg && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded text-sm">
          {errorMsg}
        </div>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600 transition ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Don’t have an account?{' '}
        <a href="/signup" className="text-red-500 hover:underline">
          Sign up here
        </a>
      </p>
    </form>
  );
}

export default Login;

