import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../axiosConfig';

const TOPICS = ['All','Tech','Culture','Science','Gaming','Sports','Other'];

const AdminThreads = () => {
  const [threads, setThreads] = useState([]);
  const [activeTopic, setActiveTopic] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [deletingIds, setDeletingIds] = useState([]);

  const fetchThreads = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get('/threads');
      setThreads(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load threads');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchThreads(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this thread?')) return;

    try {
      setDeletingIds((prev) => [...prev, id]);
      await api.delete(`/threads/${id}`);
      setMessage('Thread deleted successfully');
      fetchThreads();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Could not delete thread');
    } finally {
      setDeletingIds((prev) => prev.filter((threadId) => threadId !== id));
      setTimeout(() => setMessage(''), 3000);
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

        {isLoading && <p>Loading threads…</p>}
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        {!isLoading && (
          <>
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
                <span>👍 {t.likes || 0}</span>
                <span>💬 {(t.comments || []).length}</span>
                <span className="admin-actions">
                  <button
                    className="btn-admin-delete"
                    disabled={deletingIds.includes(t._id)}
                    onClick={() => handleDelete(t._id)}
                  >
                    {deletingIds.includes(t._id) ? 'Deleting...' : '🗑 Delete'}
                  </button>
                </span>
              </div>
            ))
          }
        </div>
      </>
    )}
      </main>
    </div>
  );
};

export default AdminThreads;
