import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../axiosConfig';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [deletingIds, setDeletingIds] = useState([]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get('/users');
      setUsers(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;

    try {
      setDeletingIds((prev) => [...prev, id]);
      await api.delete(`/users/${id}`);
      setMessage('User deleted successfully');
      fetchUsers();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Could not delete user');
    } finally {
      setDeletingIds((prev) => prev.filter((userId) => userId !== id));
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <h1 className="admin-title">Users</h1>

        {isLoading && <p>Loading users…</p>}
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        {!isLoading && (
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
                <span>
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                </span>
                <span className="admin-actions">
                  <button
                    className="btn-admin-delete"
                    disabled={deletingIds.includes(u._id)}
                    onClick={() => handleDelete(u._id)}
                  >
                    {deletingIds.includes(u._id) ? 'Deleting...' : '🗑 Delete'}
                  </button>
                </span>
              </div>
            ))
          }
        </div>
      )}
      </main>
    </div>
  );
};

export default AdminUsers;
