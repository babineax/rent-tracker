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

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;
    if (user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        { id: user.id, email, role },
      ]);

      if (profileError) {
        alert('Error saving profile: ' + profileError.message);
        return;
      }

      alert('Account created! Please log in.');
      navigate('/login');
    }
  };

  return (
    <form onSubmit={handleSignup} className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded space-y-4">
      <h2 className="text-xl font-bold text-center">Sign Up</h2>
      <input type="email" placeholder="Email" className="w-full border p-2" onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" className="w-full border p-2" onChange={e => setPassword(e.target.value)} required />
      <select className="w-full border p-2" onChange={e => setRole(e.target.value)}>
        <option value="tenant">Tenant</option>
        <option value="landlord">Landlord</option>
      </select>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Sign Up</button>
    </form>
  );
}

export default Signup;
