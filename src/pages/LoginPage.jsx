import React, { useState } from 'react';
import { useNavigate }             from 'react-router-dom';
import { useAuth }                 from '../context/AuthContext';
import { AuthLayout }              from '../components/AuthLayout';
import { Input }                   from '../components/Input';
import { Button }                  from '../components/button';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-heading text-center mb-2">
        Sign in with email
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Track your spending and savings—always stay on top of your budget.
      </p>
      {error && (
        <div className="text-red-600 mb-4 text-center">{error}</div>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <Input label="Email" type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com" />
        <Input label="Password" type="password" required value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••" />
        <Button type="submit">Continue</Button>
      </form>
    </AuthLayout>
  );
}