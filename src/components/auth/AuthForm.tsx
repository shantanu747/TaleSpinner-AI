'use client';

import { useState } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const supabase = createSupabaseClient();

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    console.log(data, error);
  };

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log(data, error);
  };

  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
      },
    });
    console.log(data, error);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-surface rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-on-primary-text">
          Authentication
        </h2>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-on-secondary-text"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-on-primary-text bg-surface border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-on-secondary-text"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-on-primary-text bg-surface border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-300"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleSignIn}
              className="w-full px-5 py-2.5 font-bold text-white rounded-md bg-primary hover:bg-opacity-90 shadow-lg transition-all duration-300"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              className="w-full px-4 py-2 font-bold text-white bg-gray-600 rounded-md hover:bg-gray-500 transition-colors duration-300"
            >
              Sign Up
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-on-primary-text bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6.02C43.97 37.63 46.98 31.45 46.98 24.55z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.73-6.02c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
