import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('signup');
  const [step, setStep] = useState('send');
  const [form, setForm] = useState({ name: '', email: '', password: '', otp: '', newPassword: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      toast.success('Registration successful');
      setView('login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/auth/login', {
        email: form.email,
        password: form.password,
      });
      toast.success(res.data.message);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate(res.data.user.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  const handleSendOtp = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/auth/forgot-password', {
        email: form.email,
      });
      toast.success(res.data.message);
      setStep('reset');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleResetPassword = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/auth/reset-password', {
        email: form.email,
        otp: form.otp,
        newPassword: form.newPassword,
      });
      toast.success(res.data.message);
      setView('login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        {view === 'signup' && (
          <>
            <h2 className="text-xl font-bold mb-4">Signup</h2>
            <form onSubmit={handleRegister} className="space-y-3">
              <input name="name" placeholder="Name" className="w-full border p-2" onChange={handleChange} required />
              <input name="email" type="email" placeholder="Email" className="w-full border p-2" onChange={handleChange} required />
              <input name="password" type="password" placeholder="Password" className="w-full border p-2" onChange={handleChange} required />
              <button className="w-full bg-emerald-600 text-white py-2 rounded">Signup</button>
            </form>
            <p className="text-center mt-4 text-sm">
              Already have an account? <button className="text-blue-600" onClick={() => setView('login')}>Login</button>
            </p>
          </>
        )}

        {view === 'login' && (
          <>
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin} className="space-y-3">
              <input name="email" type="email" placeholder="Email" className="w-full border p-2" onChange={handleChange} required />
              <input name="password" type="password" placeholder="Password" className="w-full border p-2" onChange={handleChange} required />
              <button className="w-full bg-emerald-600 text-white py-2 rounded">Login</button>
            </form>
            <p className="text-center mt-2 text-sm">
              <button className="text-blue-600" onClick={() => setView('forgot')}>Forgot Password?</button>
            </p>
            <p className="text-center mt-4 text-sm">
              Don’t have an account? <button className="text-emerald-600" onClick={() => setView('signup')}>Signup</button>
            </p>
          </>
        )}

        {view === 'forgot' && (
          <>
            <form onSubmit={step === 'send' ? handleSendOtp : handleResetPassword} className="space-y-4">
              <input type="email" name="email" placeholder="Email" className="w-full border p-2" onChange={handleChange} required />
              {step === 'reset' && (
                <>
                  <input name="otp" placeholder="OTP" className="w-full border p-2" onChange={handleChange} required />
                  <input name="newPassword" type="password" placeholder="New Password" className="w-full border p-2" onChange={handleChange} required />
                </>
              )}
              <button className="w-full bg-emerald-600 text-white py-2 rounded">
                {step === 'send' ? 'Send OTP' : 'Reset Password'}
              </button>
            </form>
            <p className="text-center mt-4 text-sm">
              Remember password? <button onClick={() => setView('login')} className="text-emerald-600">Back to Login</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
