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
    // eslint-disable-next-line
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
    <div className="p-6 container mx-auto">
      <h1 className="text-2xl font-bold text-black mb-4 text-center">Admin Dashboard</h1>
      <p className="mb-2 text-gray-700">Welcome, {user?.name}</p>
      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.id}</td>
              <td className="border p-2">
                {editUser === u.id ? (
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="border px-2"
                  />
                ) : (
                  u.name
                )}
              </td>
              <td className="border p-2">
                {editUser === u.id ? (
                  <input
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="border px-2"
                  />
                ) : (
                  u.email
                )}
              </td>
              <td className="border p-2">
                {editUser === u.id ? (
                  <select
                    name="role"
                    value={editForm.role}
                    onChange={handleEditChange}
                    className="border px-2"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                ) : (
                  u.role
                )}
              </td>
              <td className="border text-center">
                {editUser === u.id ? (
                  <>
                    <button
                      onClick={() => handleEditSave(u.id)}
                      className="bg-black text-white px-2 py-1 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditUser(null)}
                      className="bg-black text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditClick(u)}
                      className="bg-black text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="bg-black text-white px-2 py-1 rounded"
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
      <button
        onClick={handleLogout}
        className="mt-6 bg-black text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Admin;