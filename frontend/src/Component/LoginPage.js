import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [uniqueId, setUniqueId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://localhost/5000/api/users/login`, {
        uniqueId,
        patientName,
        password,
      });
      console.log('Login successful:', response.data);
      // Handle successful login (e.g., save token or redirect)
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      setErrorMessage('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="login-container">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Unique ID Field */}
        <div>
          <label htmlFor="uniqueId" className="block text-sm font-medium text-gray-700">Unique ID</label>
          <input
            type="text"
            id="uniqueId"
            name="uniqueId"
            value={uniqueId}
            onChange={(e) => setUniqueId(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Patient Name Field */}
        <div>
          <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Patient Name</label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Login
        </button>
      </form>

      {/* Optional buttons for other login methods */}
      <div className="mt-6">
        <button className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
          Login with Google
        </button>
        <button className="w-full mt-2 bg-green-500 text-white py=2 px=4 rounded-md hover:bg-green=600 focus:outline-none focus:ring=2 focus:ring-green=500 focus:ring-offset=2">
          Login with Phone Number
        </button>
      </div>
    </div>
  );
};

export default LoginPage;