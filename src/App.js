// client/src/App.js

import React, { useState } from 'react';
import jwt_decode from 'jwt-decode';
import SuperadminDashboard from './components/dashboard/SuperadminDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import MemberDashboard from './components/dashboard/MemberDashboard';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role: 'member' }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        const decodedToken = jwt_decode(data.token);
        setRole(decodedToken.role);
        setMessage('Login successful');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => {
    setRole('');
    setMessage('Logout successful');
    localStorage.removeItem('token');
  };

  const renderDashboard = () => {
    if (!role) {
      return null;
    }

    switch (role) {
      case 'superadmin':
        return (
          <>
            <h2>Superadmin Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
          </>
        );
      case 'admin':
        return (
          <>
            <h2>Admin Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
          </>
        );
      case 'member':
        return (
          <>
            <h2>Member Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
          </>
        );
      default:
        return null;
    }
  };

  const renderLoginRegister = () => {
    if (!role) {
      return (
        <>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleRegister}>Register</button>
          <button onClick={handleLogin}>Login</button>
        </>
      );
    }
  };

  return (
    <div>
      <h1>Login and Register</h1>
      {renderLoginRegister()}
      {message && <p>{message}</p>}
      {role && renderDashboard()}
    </div>
  );
}

export default App;
