import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegOTP = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { name, email, password } = location.state || {};
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');

    const handleChange = (e, idx) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length > 1) return;
        const newOtp = [...otp];
        newOtp[idx] = val;
        setOtp(newOtp);
        if (val && idx < 6) document.getElementById(`otp-${idx + 1}`).focus();
        if (!val && idx > 0 && e.nativeEvent.inputType === 'deleteContentBackward') {
            document.getElementById(`otp-${idx - 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setError('Enter 6 digit OTP');
            return;
        }
        try {
            await axios.post('http://localhost:3000/auth/register/verify-otp', {
                name,
                email,
                password,
                otp: otpValue,
            });
            toast.success('Registration successful');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'OTP verification failed');
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
                <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
                <div className="flex justify-center gap-2 mb-4">
                    {otp.map((digit, idx) => (
                        <input
                            key={idx}
                            id={`otp-${idx}`}
                            type="text"
                            maxLength={1}
                            className="w-12 h-12 border rounded text-center text-xl"
                            value={digit}
                            onChange={(e) => handleChange(e, idx)}
                            autoFocus={idx === 0}
                        />
                    ))}
                </div>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <button className="w-full bg-emerald-600 text-white py-2 rounded">Verify OTP</button>
            </form>
        </div>
    );
};

export default RegOTP;