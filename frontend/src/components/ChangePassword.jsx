import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { RxEyeOpen } from "react-icons/rx";
import { GoEyeClosed } from "react-icons/go";

const ChangePassword = () => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);

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
            navigate('/');
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
                <h2 className="text-2xl font-bold text-emerald-700 mb-6">Change Password</h2>
                <form onSubmit={handleChangePassword}>
                    <div className="mb-4 text-left relative">
                        <label className="block text-gray-700 font-semibold mb-1">
                            Old Password
                        </label>
                        <input
                            type={showOld ? "text" : "password"}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 pr-10"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-9 text-gray-500"
                            tabIndex={-1}
                            onClick={() => setShowOld((v) => !v)}
                        >
                            {showOld ? <GoEyeClosed size={20} /> : <RxEyeOpen size={20} />}
                        </button>
                    </div>
                    <div className="mb-6 text-left relative">
                        <label className="block text-gray-700 font-semibold mb-1">
                            New Password
                        </label>
                        <input
                            type={showNew ? "text" : "password"}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 pr-10"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-9 text-gray-500"
                            tabIndex={-1}
                            onClick={() => setShowNew((v) => !v)}
                        >
                            {showNew ? <GoEyeClosed size={20} /> : <RxEyeOpen size={20} />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 transition text-white px-6 py-2 rounded-lg font-semibold shadow mb-2"
                    >
                        {loading ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-2 bg-gray-200 hover:bg-gray-300 text-emerald-700 px-6 py-2 rounded-lg font-semibold shadow"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default ChangePassword;