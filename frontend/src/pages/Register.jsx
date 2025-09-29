import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // All form data in one state
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Education & Skills
    pursuing: '',
    customPursuing: '',
    currentSkills: '',
    
    // Step 3: Job Preferences
    jobField: '',
    managingPeople: '',
    
    // Step 4: Occupation
    occupation: '',
    
    // Step 5: Skills to Learn
    skillsToLearn: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setError('');
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5002/api/auth/register', {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        pursuing: formData.pursuing === 'Other' ? formData.customPursuing : formData.pursuing,
        currentSkills: formData.currentSkills,
        jobField: formData.jobField,
        managingPeople: formData.managingPeople,
        occupation: formData.occupation,
        skillsToLearn: formData.skillsToLearn
      });

      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

      console.log('Registration successful:', res.data);
      navigate('/');

    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      console.error('Registration error:', errorMessage, err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3 className="step-title">Personal Details</h3>
            
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                minLength="6"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Confirm your password"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3 className="step-title">Education & Skills</h3>
            
            <div className="form-group">
              <label className="form-label">What are you pursuing now?</label>
              <select
                name="pursuing"
                value={formData.pursuing}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select</option>
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="Diploma">Diploma</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {formData.pursuing === 'Other' && (
              <div className="form-group">
                <label className="form-label">Please specify</label>
                <input
                  type="text"
                  name="customPursuing"
                  value={formData.customPursuing}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your course/field"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">What skills do you currently know?</label>
              <input
                type="text"
                name="currentSkills"
                value={formData.currentSkills}
                onChange={handleChange}
                className="form-input"
                placeholder="Example: Python, HTML, CSS"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3 className="step-title">Job Preferences</h3>
            
            <div className="form-group">
              <label className="form-label">What job field do you prefer?</label>
              <select
                name="jobField"
                value={formData.jobField}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Job Field</option>
                <option value="Software Development">Software Development</option>
                <option value="Design">Design</option>
                <option value="Management">Management</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Are you currently managing people?</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="managingPeople"
                    value="Yes"
                    checked={formData.managingPeople === 'Yes'}
                    onChange={handleChange}
                    className="radio-input"
                  />
                  <span>Yes</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="managingPeople"
                    value="No"
                    checked={formData.managingPeople === 'No'}
                    onChange={handleChange}
                    className="radio-input"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h3 className="step-title">Select Occupation</h3>
            
            <div className="form-group">
              <label className="form-label">Choose your occupation</label>
              <select
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Occupation</option>
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
                <option value="Manager">Manager</option>
                <option value="Student">Student</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {formData.occupation === 'Other' && (
              <div className="other-occupation-note">
                <em>Please contact support if you can't find your occupation</em>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h3 className="step-title">Skills You Want to Learn</h3>
            
            <div className="form-group">
              <label className="form-label">Select skills you want to learn</label>
              <select
                name="skillsToLearn"
                value={formData.skillsToLearn}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Skills</option>
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
                <option value="React">React</option>
                <option value="Node.js">Node.js</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Data Science">Data Science</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
              </select>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="step-content">
            <h3 className="step-title">Review Your Information</h3>
            
            <div className="review-container">
              <div className="review-item"><strong>Name:</strong> {formData.name}</div>
              <div className="review-item"><strong>Email:</strong> {formData.email}</div>
              <div className="review-item"><strong>Education:</strong> {formData.pursuing === 'Other' ? formData.customPursuing : formData.pursuing}</div>
              <div className="review-item"><strong>Current Skills:</strong> {formData.currentSkills || 'None specified'}</div>
              <div className="review-item"><strong>Job Field:</strong> {formData.jobField}</div>
              <div className="review-item"><strong>Managing People:</strong> {formData.managingPeople}</div>
              <div className="review-item"><strong>Occupation:</strong> {formData.occupation}</div>
              <div className="review-item"><strong>Skills to Learn:</strong> {formData.skillsToLearn}</div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <style>
        {`
          .register-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 1rem;
          }

          .register-card {
            width: 100%;
            max-width: 28rem;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }

          .register-header {
            text-align: center;
            margin-bottom: 2rem;
          }

          .register-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 0.5rem;
          }

          .step-indicator {
            font-size: 0.875rem;
            color: #6b7280;
            margin-bottom: 1rem;
          }

          .progress-bar-container {
            width: 100%;
            background-color: #e5e7eb;
            border-radius: 9999px;
            height: 0.5rem;
            margin-top: 1rem;
          }

          .progress-bar {
            background-color: #4f46e5;
            height: 0.5rem;
            border-radius: 9999px;
            transition: width 0.3s ease;
          }

          .error-message {
            background-color: #fee2e2;
            border: 1px solid #fca5a5;
            color: #dc2626;
            padding: 0.75rem 1rem;
            border-radius: 0.375rem;
            margin-bottom: 1.5rem;
          }

          .step-container {
            min-height: 20rem;
          }

          .step-content {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .step-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: #111827;
            margin-bottom: 1rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }

          .form-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
            margin-bottom: 0.5rem;
          }

          .form-input, .form-select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            font-size: 0.875rem;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
          }

          .form-input:focus, .form-select:focus {
            border-color: #4f46e5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
          }

          .radio-group {
            display: flex;
            gap: 1.5rem;
            margin-top: 0.5rem;
          }

          .radio-option {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
          }

          .radio-input {
            width: 1rem;
            height: 1rem;
            color: #4f46e5;
            border: 1px solid #d1d5db;
            cursor: pointer;
          }

          .other-occupation-note {
            font-size: 0.875rem;
            color: #6b7280;
            margin-top: 0.5rem;
          }

          .review-container {
            background-color: #f9fafb;
            padding: 1rem;
            border-radius: 0.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .review-item {
            font-size: 0.875rem;
            padding: 0.25rem 0;
          }

          .navigation-buttons {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            margin-top: 2rem;
          }

          .btn-secondary {
            padding: 0.5rem 1rem;
            font-weight: 500;
            color: #374151;
            background-color: #e5e7eb;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            transition: background-color 0.2s;
          }

          .btn-secondary:hover {
            background-color: #d1d5db;
          }

          .btn-primary {
            padding: 0.5rem 1rem;
            font-weight: 500;
            color: white;
            background-color: #4f46e5;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            transition: background-color 0.2s;
            margin-left: auto;
          }

          .btn-primary:hover:not(:disabled) {
            background-color: #4338ca;
          }

          .btn-primary:disabled {
            background-color: #a5b4fc;
            cursor: not-allowed;
          }

          .btn-success {
            padding: 0.5rem 1rem;
            font-weight: 500;
            color: white;
            background-color: #059669;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            transition: background-color 0.2s;
            margin-left: auto;
          }

          .btn-success:hover:not(:disabled) {
            background-color: #047857;
          }

          .btn-success:disabled {
            background-color: #86efac;
            cursor: not-allowed;
          }

          .login-link-container {
            font-size: 0.875rem;
            text-align: center;
            color: #6b7280;
            margin-top: 1.5rem;
          }

          .login-link {
            font-weight: 500;
            color: #4f46e5;
            text-decoration: none;
            transition: color 0.2s;
          }

          .login-link:hover {
            color: #4338ca;
          }

          @media (max-width: 640px) {
            .register-card {
              margin: 0.5rem;
              padding: 1.5rem;
            }
          }

          /* Additional styles from original Register.css */
          #root {
            max-width: 1280px;
            margin: 0 auto;
            padding: 2rem;
            text-align: center;
          }

          .logo {
            height: 6em;
            padding: 1.5em;
            will-change: filter;
            transition: filter 300ms;
          }

          .logo:hover {
            filter: drop-shadow(0 0 2em #646cffaa);
          }

          .logo.react:hover {
            filter: drop-shadow(0 0 2em #61dafbaa);
          }

          @keyframes logo-spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @media (prefers-reduced-motion: no-preference) {
            a:nth-of-type(2) .logo {
              animation: logo-spin infinite 20s linear;
            }
          }

          .card {
            padding: 2em;
          }

          .read-the-docs {
            color: #888;
          }
        `}
      </style>

      <div className="register-container">
        <div className="register-card">
          {/* Header */}
          <div className="register-header">
            <h2 className="register-title">Create Your Account</h2>
            <p className="step-indicator">Step {currentStep} of 6</p>
            
            {/* Progress Bar */}
            <div className="progress-bar-container">
              <div 
                className="progress-bar"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Step Content */}
          <div className="step-container">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="navigation-buttons">
            {currentStep > 1 && (
              <button
                onClick={handlePrev}
                className="btn-secondary"
              >
                Previous
              </button>
            )}
            
            {currentStep < 6 ? (
              <button
                onClick={handleNext}
                className="btn-primary"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-success"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            )}
          </div>

          {/* Login Link */}
          <p className="login-link-container">
            Already have an account?{' '}
            <Link to="/login" className="login-link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;