import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from '../utils/firebase';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="bg-white p-10 rounded-xl shadow-xl max-w-lg w-full transform transition-all hover:scale-105">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Welcome Back!</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
              placeholder="Enter your email"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 17.01l4.2-4.2a7.5 7.5 0 10-10.6 0L10 17.01m0 0a4.992 4.992 0 005 0m-5 0v3.49a2.5 2.5 0 005 0v-3.49"></path>
              </svg>
            </span>
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-10"
              required
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12h.01M19.07 4.93a10.038 10.038 0 011.414 1.414M19.07 19.07a10.038 10.038 0 01-1.414 1.414M4.93 19.07a10.038 10.038 0 01-1.414-1.414M4.93 4.93a10.038 10.038 0 011.414-1.414M12 9v6m-3 3h6"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12h.01M19.07 4.93a10.038 10.038 0 011.414 1.414M19.07 19.07a10.038 10.038 0 01-1.414 1.414M4.93 19.07a10.038 10.038 0 01-1.414-1.414M4.93 4.93a10.038 10.038 0 011.414-1.414M12 9v6m-3 3h6"></path>
                </svg>
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-150 transform hover:scale-105"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          <a href="#" className="text-indigo-600 hover:text-indigo-500 transition duration-150">
            Forgot your password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
