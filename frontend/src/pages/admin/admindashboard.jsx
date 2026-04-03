import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../axiosConfig';

const AdminDashboard = () => {
  const [threads, setThreads] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const t = await api.get('/threads');
        setThreads(t.data);
      } catch (err) {
        console.log('Threads error:', err.message);
      }

      try {
        const u = await api.get('/users');
        setUsers(u.data);
      } catch (err) {
        console.log('Users error:', err.message);
        setError('Could not load users — make sure you are logged in as admin');
      }
    };
    fetchData();
  }, []);

  const topThreads = [...threads].sort((a, b) => b.likes - a.likes).slice(0, 5);
  const topicCount = threads.reduce((acc, t) => {
    acc[t.topic] = (acc[t.topic] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <h1 className="admin-title">Admin Dashboard</h1>

        {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}

        <div className="kpi-grid">
          <div className="kpi-card" style={{ borderColor: '#008471' }}>
            <p className="kpi-label">Total Users</p>
            <p className="kpi-value">{users.length}</p>
          </div>
          <div className="kpi-card" style={{ borderColor: '#80B0E8' }}>
            <p className="kpi-label">Total Threads</p>
            <p className="kpi-value">{threads.length}</p>
          </div>
          <div className="kpi-card" style={{ borderColor: '#F4D242' }}>
            <p className="kpi-label">Total Likes</p>
            <p className="kpi-value">
            </p>
          </div>
          <div className="kpi-card" style={{ borderColor: '#F29CC3' }}>
            <p className="kpi-label">Total Comments</p>
            <p className="kpi-value">
            </p>
          </div>
        </div>
        <div className="admin-row">
          <div className="admin-block">
            <h3>Top Threads</h3>
            {topThreads.length === 0 ? <p className="empty">No threads yet</p>
            :topThreads.map((t, i) => (
              <div key={t._id} className="admin-list-item">
                <span className="admin-rank">#{i + 1}</span>
                <span>{t.title}</span>
                <span className="admin-meta">Likes {t.likes}</span>
              </div>
            ))
            }
        </div>
        <div className="admin-block">
            <h3>Top Users</h3>
            {users.length === 0
              ? <p className="empty">No users yet</p>
              : users.slice(0, 5).map((u, i) => (
                <div key={u._id} className="admin-list-item">
                  <span className="admin-rank">#{i + 1}</span>
                  <span>{u.name}</span>
                  <span className="admin-meta">{u.email}</span>
                </div>
              ))
            }
          </div>
          <div className="admin-block">
            <h3>Traffic by Topic</h3>
            {Object.entries(topicCount).length === 0
              ? <p className="empty">No data yet</p>
              : Object.entries(topicCount).map(([topic, count]) => (
                <div key={topic} className="admin-list-item">
                  <span>{topic}</span>
                  <div className="topic-bar-wrap">
                    <div
                      className="topic-bar"
                      style={{ width: `${(count / threads.length) * 100}%` }}
                    />
                  </div>
                  <span className="admin-meta">{count}</span>
                </div>
              ))
            }
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;