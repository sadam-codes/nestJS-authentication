import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { RxEyeOpen } from "react-icons/rx";
import { GoEyeClosed } from "react-icons/go";

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error('Both fields are required');
      return;
    }
    setLoading(true);
    try {
      await axios.patch(
        'http://localhost:3000/auth/change-password',
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Failed to change password'
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-emerald-700 mb-2">
          Welcome{user?.name ? `, ${user.name}` : '!'}
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          <span className="font-semibold">Role:</span>{' '}
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
            {user?.role || 'User'}
          </span>
        </p>
        <button
          onClick={() => navigate('/change-password')}
          className="mb-4 mx-5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
        >
          Change Password
        </button>

        <button
          onClick={handleLogout}
          className="mt-2 bg-emerald-600 hover:bg-emerald-700 transition text-white px-6 py-2 rounded-lg font-semibold shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;