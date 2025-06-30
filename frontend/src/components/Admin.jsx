import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/user');
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/auth/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleEditClick = (u) => {
    setEditUser(u.id);
    setEditForm({ name: u.name, email: u.email, role: u.role });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/auth/admin-update/${id}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('User updated');
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
        <h1 className="text-3xl font-extrabold text-emerald-700 mb-2 text-center tracking-tight">
          Admin Dashboard
        </h1>
        <p className="mb-6 text-gray-700 text-center text-lg">
          Welcome, <span className="font-semibold">{user?.name}</span>
        </p>
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-emerald-100">
                <th className="border-b p-3 text-left font-semibold">ID</th>
                <th className="border-b p-3 text-left font-semibold">Name</th>
                <th className="border-b p-3 text-left font-semibold">Email</th>
                <th className="border-b p-3 text-left font-semibold">Role</th>
                <th className="border-b p-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u, idx) => (
                <tr
                  key={u.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-emerald-50"}
                >
                  <td className="p-3">{u.id}</td>
                  <td className="p-3">
                    {editUser === u.id ? (
                      <input
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      u.name
                    )}
                  </td>
                  <td className="p-3">
                    {editUser === u.id ? (
                      <input
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      u.email
                    )}
                  </td>
                  <td className="p-3">
                    {editUser === u.id ? (
                      <select
                        name="role"
                        value={editForm.role}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-emerald-200 text-emerald-800' : 'bg-emerald-100 text-emerald-700'}`}>
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {editUser === u.id ? (
                      <>
                        <button
                          onClick={() => handleEditSave(u.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded mr-2 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditUser(null)}
                          className="bg-emerald-200 hover:bg-emerald-300 text-emerald-800 px-3 py-1 rounded transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(u)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded mr-2 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="bg-emerald-400 hover:bg-emerald-500 text-emerald-900 px-3 py-1 rounded transition"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={handleLogout}
          className="mt-8 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2 rounded-lg font-semibold shadow block mx-auto transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Admin;