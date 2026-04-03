import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TOPICS = [ 'Tech', 'Culture', 'Science', 'Gaming', 'Sports', 'Other'];

const ThreadForm = ({ onCreated }) => {
  const [form, setForm] = useState({ title: '', topic: '', content: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.topic.trim() || !form.content.trim()) {
      setError('All fields are required');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await axiosInstance.post('/api/threads', {
        title: form.title.trim(),
        topic: form.topic.trim(),
        content: form.content.trim(),
      });
      setForm({ title: '', topic: '', content: '' });
      onCreated();
    } catch (error) {
      setError(error?.response?.data?.message || 'Could not create post');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="thread-form">
      <h3> Create Post</h3>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Title"
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
          placeholder="Write your post..."
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Publish Post'}
        </button>
      </form>
    </div>
  ); 
};

export default ThreadForm;
