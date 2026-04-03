import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import axioInstance from '../../axiosConfig';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
  try {
    console.log('Fetching from:', axioInstance.defaults.baseURL + '/api/users');
    const res = await axioInstance.get('/api/users');
    console.log('Users data:', res.data);
    setUsers(res.data || []);
  } catch (err) {
    console.log(err.message);
  }
};

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user?')) {
      await axioInstance.delete(`/api/users/${id}`);
      fetchUsers();
    }
  };
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <h1 className="admin-title">Users</h1>
        <div className="admin-table">
          <div className="admin-table-header">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Joined</span>
            <span>Actions</span>
          </div>
          {users.length === 0
            ? <p className="empty">No users found</p>
            : users.map(u => (
              <div key={u._id} className="admin-table-row">
                <span>{u.name}</span>
                <span>{u.email}</span>
                <span>
                  <span className={`role-badge ${u.role}`}>{u.role}</span>
                </span>
                <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                <span className="admin-actions">
                  <button
                    className="btn-admin-delete"
                    onClick={() => handleDelete(u._id)}
                  >Delete 
                  </button>
                  </span>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;