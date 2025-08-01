'use client';

import { useLoginUserMutation } from '@/services/loginAPI';
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await loginUser({ email, password }).unwrap();

      // ✅ Redirect based on user role
      const role = result.user?.role;
      if (role === 'admin') {
        window.location.href = '/admin';
      } else if (role === 'employer') {
        window.location.href = '/employer';
      } else if (role === 'user') {
        window.location.href = '/user';
      } else {
        window.location.href = '/'; // fallback
      }

    } catch (error: any) {
      alert(error?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
