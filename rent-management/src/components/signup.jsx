import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tenant');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return alert(error.message);

    // insert role in `profiles` table
    await supabase.from('profiles').insert([
      { id: data.user.id, email, role },
    ]);

    alert('Account created!');
    navigate('/login');
  };

  return (
    <form onSubmit={handleSignup} className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold text-center">Sign Up</h2>
      <input type="email" placeholder="Email" className="w-full border p-2" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" className="w-full border p-2" onChange={e => setPassword(e.target.value)} />
      <select className="w-full border p-2" onChange={e => setRole(e.target.value)}>
        <option value="tenant">Tenant</option>
        <option value="landlord">Landlord</option>
      </select>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Sign Up</button>
    </form>
  );
}

export default Signup;
