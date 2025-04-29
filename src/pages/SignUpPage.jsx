// src/pages/SignUpPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth }           from '../context/AuthContext';
import { AuthLayout }        from '../components/AuthLayout';
import { Input }             from '../components/Input';
import { Button }            from '../components/button';

export default function SignUpPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInvite] = useState('');
  const [error, setError]       = useState(null);
  const { signup }              = useAuth();
  const navigate                = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signup(email, password, inviteCode);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Sign up failed');
    }
  };

  return (
    <AuthLayout>
      {/* Page heading inside AuthLayout */}
      <h2 className="text-3xl font-heading text-center mb-3 font-semibold">
        Create your account
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Track your spending and savings—always stay on top of your budget.
      </p>

      {error && (
        <div className="text-red-600 mb-4 text-center">{error}</div>
      )}

      <form onSubmit={handleSignUp} className="space-y-4">
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <Input
          label="Invite Code"
          type="text"
          required
          value={inviteCode}
          onChange={(e) => setInvite(e.target.value)}
          placeholder="Enter your invite code"
        />

        <Button type="submit">Sign up</Button>
      </form>

      {/* Footer link */}
      <p className="mt-4 text-center text-sm text-[#27272a]">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-[#27272a] hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}