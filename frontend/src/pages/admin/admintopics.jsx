import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

const DEFAULT_TOPICS = ['Tech','Culture','Science','Gaming','Sports','Other'];

const AdminTopics = () => {
  const [topics, setTopics] = useState(DEFAULT_TOPICS);
  const [newTopic, setNewTopic] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleAdd = () => {
    const candidate = newTopic.trim();
    if (!candidate) {
      setError('Please enter topic name');
      return;
    }
    if (topics.includes(candidate)) {
      setError('Topic already exists');
      return;
    }
    setTopics((prev) => [...prev, candidate]);
    setNewTopic('');
    setMessage(`Topic "${candidate}" added`);
    setError('');
    setTimeout(() => setMessage(''), 2500);
  };

  const handleDelete = (topic) => {
    setTopics((prev) => prev.filter((t) => t !== topic));
    setMessage(`Topic "${topic}" removed`);
    setError('');
    setTimeout(() => setMessage(''), 2500);
  };

  const handleSave = () => {
    setSaved(true);
    setMessage('Topics saved');
    setError('');
    setTimeout(() => {
      setSaved(false);
      setMessage('');
    }, 3000);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <h1 className="admin-title">Topics</h1>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        {/* Current topics */}
        <div className="admin-block" style={{ marginBottom: '24px' }}>
          <h3>All Topics</h3>
          <div className="topic-pills" style={{ marginTop: '12px' }}>
            {topics.map(topic => (
              <div key={topic} className="topic-pill-admin">
                <span>{topic}</span>
                <button
                  className="topic-remove"
                  onClick={() => handleDelete(topic)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add new topic */}
        <div className="admin-block">
          <h3>Add New Topic</h3>
          <div className="add-topic-row">
            <input
              value={newTopic}
              onChange={e => setNewTopic(e.target.value)}
              placeholder="New topic name"
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <button className="btn-primary" onClick={handleAdd}>
              + Add
            </button>
          </div>
        </div>

        {/* Save */}
        <div className="form-actions" style={{ marginTop: '24px' }}>
          <button className="btn-primary" onClick={handleSave}>
            Save Changes
          </button>
          {saved && <span className="save-confirm">✓ Saved</span>}
        </div>
      </main>
    </div>
  );
};

export default AdminTopics;
