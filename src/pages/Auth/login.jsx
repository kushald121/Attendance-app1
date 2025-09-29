import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect based on user role
        if (result.user.role === 'teacher') {
          navigate('/teacher');
        } else if (result.user.role === 'student') {
          navigate('/student');
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred during login');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fill demo credentials
  const fillDemoCredentials = () => {
    if (activeTab === 'student') {
      setFormData({
        email: 'krishnapatel_comp_2024@ltce.in',
        password: 'Password123'
      });
    } else {
      setFormData({
        email: 'krishna.singal@ltce.in',
        password: 'Teacher123'
      });
    }
  };

  return (
    <div className="h-screen bg-gray-200 flex flex-col">
      <img src="Upashit_logo.png" alt="Profile" className="absolute top-4 left-6 h-12 w-auto object-contain"/>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-[6px_6px_20px_rgba(0,0,0,0.55)] p-8">
          {/* Welcome Text */}
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-8">
            Welcome to Upasthit
          </h1>

          {/* Toggle Buttons */}
          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={() => setActiveTab('teacher')}
              className={`px-8 py-3 rounded-full text-base font-medium transition-colors ${
                activeTab === 'teacher'
                  ? 'bg-blue-600 text-white'
                  : 'bg-green-300 text-white'
              }`}
            >
              Teacher
            </button>
            <button
              onClick={() => setActiveTab('student')}
              className={`px-8 py-3 rounded-full text-base font-medium transition-colors ${
                activeTab === 'student'
                  ? 'bg-blue-600 text-white'
                  : 'bg-green-300 text-white'
              }`}
            >
              Student
            </button>
          </div>

          {/* Login Heading */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-base font-bold text-gray-700 mb-2 ">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                required
              />
            </div>

            <div>
              <label className="block text-base font-bold text-gray-700 mb-2 ">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                required
              />
            </div>

            <div className="flex justify-between items-center">
              <button type="button" className="text-base text-gray-600 hover:text-gray-800">
                Forgot password?
              </button>
              <button 
                type="button" 
                onClick={fillDemoCredentials}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Fill Demo Credentials
              </button>
            </div>

            <div className="flex justify-center pt-3">
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>

            <div className="text-center pt-3">
              <button type="button" className="text-base text-gray-600 hover:text-gray-800 underline">
                No account contact admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
