import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  // 1) Form state
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInvite] = useState('');
  const [error, setError]       = useState(null);

  // 2) Grab signup fn from context and a navigate helper
  const { signup } = useAuth();
  const navigate   = useNavigate();

  // 3) Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signup(email, password, inviteCode);
      // On success, redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      // Show any error message returned from the API
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl mb-4">Sign Up</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* 4) Bind the form inputs */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="At least 8 characters"
          />
        </div>

        <div>
          <label className="block mb-1">Invite Code</label>
          <input
            type="text"
            required
            value={inviteCode}
            onChange={(e) => setInvite(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your invite code"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}