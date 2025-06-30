import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('login');
  const [step, setStep] = useState('send');
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (view === 'signup') {
      if (!form.name.trim()) newErrors.name = 'Name is required';
      else if (form.name.length > 50) newErrors.name = 'Name is too long';

      if (!form.email.trim()) newErrors.email = 'Email is required';
      else if (!emailRegex.test(form.email)) newErrors.email = 'Enter a valid email address';

      if (!form.password) newErrors.password = 'Password is required';
      else if (!passwordRegex.test(form.password))
        newErrors.password =
          'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
    }

    if (view === 'login') {
      if (!form.email.trim()) newErrors.email = 'Email is required';
      else if (!emailRegex.test(form.email)) newErrors.email = 'Enter a valid email address';

      if (!form.password) newErrors.password = 'Password is required';
    }

    if (view === 'forgot') {
      if (!form.email.trim()) newErrors.email = 'Email is required';
      else if (!emailRegex.test(form.email)) newErrors.email = 'Enter a valid email address';

      if (step === 'reset') {
        if (!form.otp || !/^\d{6}$/.test(form.otp)) newErrors.otp = 'OTP must be 6 digits';
        if (!form.newPassword) newErrors.newPassword = 'New password is required';
        else if (!passwordRegex.test(form.newPassword))
          newErrors.newPassword =
            'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await axios.post('http://localhost:3000/auth/register/send-otp', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      toast.success('OTP sent to your email');
      navigate('/reg-otp', { state: { name: form.name, email: form.email, password: form.password } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validate()) return;
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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validate()) return;
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
              <input
                name="name"
                placeholder="Name"
                className="w-full border p-2"
                onChange={handleChange}
                value={form.name}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="w-full border p-2"
                onChange={handleChange}
                value={form.email}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full border p-2"
                onChange={handleChange}
                value={form.password}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

              <button className="w-full bg-emerald-600 text-white py-2 rounded cursor-pointer">
                Signup
              </button>
            </form>
            <p className="text-center mt-4 text-sm">
              Already have an account?{' '}
              <button className="text-blue-600 cursor-pointer" onClick={() => { setView('login'); }}>
                Login
              </button>
            </p>
          </>
        )}
        {view === 'login' && (
          <>
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="w-full border p-2"
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full border p-2"
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              <button className="w-full bg-emerald-600 text-white py-2 rounded cursor-pointer">Login</button>
            </form>
            <p className="text-center mt-2 text-sm">
              <button className="text-blue-600 cursor-pointer" onClick={() => setView('forgot')}>
                Forgot Password?
              </button>
            </p>
            <p className="text-center mt-4 text-sm">
              Don’t have an account?{' '}
              <button className="text-emerald-600 cursor-pointer" onClick={() => setView('signup')}>
                Signup
              </button>
            </p>
          </>
        )}

        {view === 'forgot' && (
          <>
            <form
              onSubmit={step === 'send' ? handleSendOtp : handleResetPassword}
              className="space-y-4"
            >
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full border p-2"
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              {step === 'reset' && (
                <>
                  <input
                    name="otp"
                    placeholder="OTP"
                    className="w-full border p-2"
                    onChange={handleChange}
                  />
                  {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}

                  <input
                    name="newPassword"
                    type="password"
                    placeholder="New Password"
                    className="w-full border p-2"
                    onChange={handleChange}
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm">{errors.newPassword}</p>
                  )}
                </>
              )}
              <button className="w-full bg-emerald-600 text-white py-2 rounded cursor-pointer">
                {step === 'send' ? 'Send OTP' : 'Reset Password'}
              </button>
            </form>
            <p className="text-center mt-4 text-sm">
              Remember password?{' '}
              <button onClick={() => setView('login')} className="text-emerald-600 cursor-pointer">
                Back to Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;