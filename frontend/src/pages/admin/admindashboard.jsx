import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../axiosConfig';

const AdminDashboard = () => {
  const [threads, setThreads] = useState([]);
  const [users,   setUsers]   = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const t = await api.get('/threads');
        const u = await api.get('/users');
        setThreads(t.data);
        setUsers(u.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);

  const topThreads = [...threads]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5);

  const topUsers = [...users].slice(0, 5);

  // Traffic by topic
  const topicCount = threads.reduce((acc, t) => {
    acc[t.topic] = (acc[t.topic] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <h1 className="admin-title">Admin Dashboard</h1>

        {/* KPI Cards */}
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
              {threads.reduce((a, t) => a + t.likes, 0)}
            </p>
          </div>
          <div className="kpi-card" style={{ borderColor: '#F29CC3' }}>
            <p className="kpi-label">Total Comments</p>
            <p className="kpi-value">
              {threads.reduce((a, t) => a + t.comments.length, 0)}
            </p>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="admin-row">

          {/* Top Users */}
          <div className="admin-block">
            <h3>Top Users</h3>
            {topUsers.length === 0
              ? <p className="empty">No users yet</p>
              : topUsers.map((u, i) => (
                <div key={u._id} className="admin-list-item">
                  <span className="admin-rank">#{i + 1}</span>
                  <span>{u.name}</span>
                  <span className="admin-meta">{u.email}</span>
                </div>
              ))
            }
          </div>

          {/* Top Threads */}
          <div className="admin-block">
            <h3>Top Threads</h3>
            {topThreads.length === 0
              ? <p className="empty">No threads yet</p>
              : topThreads.map((t, i) => (
                <div key={t._id} className="admin-list-item">
                  <span className="admin-rank">#{i + 1}</span>
                  <span>{t.title}</span>
                  <span className="admin-meta">👍 {t.likes}</span>
                </div>
              ))
            }
          </div>

          {/* Traffic by Topic */}
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
