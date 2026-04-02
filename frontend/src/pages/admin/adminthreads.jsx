import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../axiosConfig';

const TOPICS = ['All','Tech','Culture','Science','Gaming','Sports','Other'];

const AdminThreads = () => {
  const [threads,     setThreads]     = useState([]);
  const [activeTopic, setActiveTopic] = useState('All');

  const fetchThreads = async () => {
    const res = await api.get('/threads');
    setThreads(res.data);
  };

  useEffect(() => { fetchThreads(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this thread?')) {
      await api.delete(`/threads/${id}`);
      fetchThreads();
    }
  };

  const filtered = activeTopic === 'All'
    ? threads
    : threads.filter(t => t.topic === activeTopic);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <h1 className="admin-title">Threads</h1>

        {/* Topic filter */}
        <div className="topic-pills" style={{ marginBottom: '16px' }}>
          {TOPICS.map(topic => (
            <button
              key={topic}
              className={`pill ${activeTopic === topic ? 'active' : ''}`}
              onClick={() => setActiveTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="admin-table">
          <div className="admin-table-header">
            <span>Title</span>
            <span>Author</span>
            <span>Topic</span>
            <span>Likes</span>
            <span>Comments</span>
            <span>Actions</span>
          </div>
          {filtered.length === 0
            ? <p className="empty">No threads found</p>
            : filtered.map(t => (
              <div key={t._id} className="admin-table-row">
                <span>{t.title}</span>
                <span>{t.author?.name}</span>
                <span>{t.topic}</span>
                <span>👍 {t.likes}</span>
                <span>💬 {t.comments.length}</span>
                <span className="admin-actions">
                  <button
                    className="btn-admin-delete"
                    onClick={() => handleDelete(t._id)}
                  >
                    🗑 Delete
                  </button>
                </span>
              </div>
            ))
          }
        </div>
      </main>
    </div>
  );
};

export default AdminThreads;
