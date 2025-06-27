import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Welcome, {user?.name}</h1>
      <p className="mt-2 text-gray-600">Role: {user?.role}</p>
      <button onClick={handleLogout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
  );
};

export default Home;
