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

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;
    if (!user) return;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      alert('Role not found!');
      return;
    }

    if (profile.role === 'landlord') {
      navigate('/dashboard');
    } else {
      alert('Tenant dashboard not yet implemented.');
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold text-center">Login</h2>
      <input type="email" placeholder="Email" className="w-full border p-2" onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" className="w-full border p-2" onChange={e => setPassword(e.target.value)} required />
      <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">Login</button>
    </form>
  );
}

export default Login;
