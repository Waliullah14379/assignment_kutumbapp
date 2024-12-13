import React, { useState } from 'react';
import { sharedService } from '../services/commonService'

const Login = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!username.length || !otp.length) {
      setError('Both Username and OTP are required!');
      return;
    }
    let payload ={
        "username": username,
        "otp": otp
    }
    
    // {
    //     "username": "sandy",
    //     "otp": "1234"
    // }
    
    sharedService.loginService('/login',payload)
      };
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4" style={{ width: '400px' }}>
        <h3 className="text-center mb-4">Login</h3>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* OTP Field */}
          <div className="mb-3">
            <label htmlFor="otp" className="form-label">OTP</label>
            <input
              type="text"
              className="form-control"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          {/* Error Message */}
          {error && <div className="alert alert-danger p-1">{error}</div>}

          {/* Login Button */}
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
