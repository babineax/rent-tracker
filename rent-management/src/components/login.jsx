import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return alert(error.message);

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (!profile) return alert("Role not found!");

    if (profile.role === 'landlord') navigate('/dashboard/landlord');
    else if (profile.role === 'tenant') navigate('/dashboard/tenant');
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold text-center">Login</h2>
      <input type="email" placeholder="Email" className="w-full border p-2" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" className="w-full border p-2" onChange={e => setPassword(e.target.value)} />
      <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">Login</button>
    </form>
  );
}

export default Login;