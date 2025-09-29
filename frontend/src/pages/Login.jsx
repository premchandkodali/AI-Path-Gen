import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5002/api/auth/login', formData);
      
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      console.log('Login successful:', res.data);
      
      // Force page reload to ensure authentication state is recognized
      window.location.href = '/';

    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      console.error('Login error:', errorMessage, err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          .login-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: #f3f4f6;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          .login-card {
            width: 100%;
            max-width: 28rem;
            padding: 2rem;
            background-color: white;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }

          .login-title {
            font-size: 1.5rem;
            font-weight: 700;
            text-align: center;
            color: #111827;
            margin-bottom: 1.5rem;
          }

          .error-message {
            font-size: 0.875rem;
            text-align: center;
            color: #dc2626;
            background-color: #fee2e2;
            padding: 0.5rem;
            border-radius: 0.375rem;
            margin-bottom: 1.5rem;
          }

          .form-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }

          .form-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
            margin-bottom: 0.25rem;
          }

          .form-input {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            font-size: 0.875rem;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
          }

          .form-input:focus {
            border-color: #4f46e5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
          }

          .remember-forgot-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .remember-me {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .remember-checkbox {
            width: 1rem;
            height: 1rem;
            color: #4f46e5;
            border: 1px solid #d1d5db;
            border-radius: 0.25rem;
          }

          .remember-label {
            font-size: 0.875rem;
            color: #111827;
          }

          .forgot-password {
            font-size: 0.875rem;
            font-weight: 500;
            color: #4f46e5;
            text-decoration: none;
            transition: color 0.2s;
          }

          .forgot-password:hover {
            color: #4338ca;
          }

          .login-button {
            width: 100%;
            padding: 0.5rem 1rem;
            font-weight: 500;
            color: white;
            background-color: #4f46e5;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            outline: none;
            transition: background-color 0.2s;
          }

          .login-button:hover:not(:disabled) {
            background-color: #4338ca;
          }

          .login-button:disabled {
            background-color: #a5b4fc;
            cursor: not-allowed;
          }

          .login-button:focus {
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
          }

          .signup-link-container {
            font-size: 0.875rem;
            text-align: center;
            color: #6b7280;
            margin-top: 1.5rem;
          }

          .signup-link {
            font-weight: 500;
            color: #4f46e5;
            text-decoration: none;
            transition: color 0.2s;
          }

          .signup-link:hover {
            color: #4338ca;
          }

          /* Additional custom styles */
          .login-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .login-card {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.95);
          }

          @media (max-width: 640px) {
            .login-card {
              margin: 1rem;
              padding: 1.5rem;
            }
          }
        `}
      </style>

      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Log in to your account</h2>
          
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <label htmlFor="login" className="form-label">
                Username or Email
              </label>
              <input
                id="login"
                name="login"
                type="text"
                required
                value={formData.login}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="remember-forgot-container">
              <div className="remember-me">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="remember-checkbox"
                />
                <label htmlFor="remember-me" className="remember-label">
                  Remember me
                </label>
              </div>

              <div>
                <a href="#" className="forgot-password">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="login-button"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </div>
          </form>

          <p className="signup-link-container">
            Don't have an account?{' '}
            <Link to="/register" className="signup-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;