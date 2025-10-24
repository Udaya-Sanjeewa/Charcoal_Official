'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, User } from 'lucide-react';

export default function UserLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/user-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('user_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));

      window.location.href = '/dashboard';
    } catch (error: any) {
      setError(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="w-full max-w-md">
        <div > className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow"Title className="text-2xl text-center">Welcome back</h2>
          <div className="bg-white rounded-lg shadow"Description className="text-center">
            Sign in to your account to continue shopping
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div > className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="email">Email</label>
              <input className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="password">Password</label>
              <input className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div > className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="text-sm text-center text-slate-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-slate-900 font-medium hover:underline">
                Create one
              </Link>
            </div>

            <div className="text-xs text-center text-slate-500 mt-4 p-3 bg-slate-50 rounded-md border border-slate-200">
              <strong>Demo Account:</strong><br />
              Email: user@example.com<br />
              Password: user123
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
