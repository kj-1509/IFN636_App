import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TOPICS = [ 'Tech', 'Culture', 'Science', 'Gaming', 'Sports', 'Other'];

const ThreadForm = ({ onCreated }) => {
  const [form, setForm] = useState({ title: ' ' ,topic: ' ',content: ' ' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => { e.preventDefault();
    try {
      await axiosInstance.post('/api/threads', form);
      setForm({ title: ' ' ,topic: ' ',content: ' ' });
      onCreated();
    } catch (error) {
      alert('couldnt create post');
    }
  };
  return (
    <div className="thread-form">
      <h3> Create Post</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          />
        <select name="topic" value={form.topic} onChange={handleChange} required>
          <option value="">Select topic</option>
          {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          required
          />
        <button type="submit">Publish Post</button>
      </form>
    </div>
  ); 
};

export default ThreadForm;
