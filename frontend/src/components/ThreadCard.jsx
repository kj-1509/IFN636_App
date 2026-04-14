import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TOPIC_COLOURS = {
  Tech: '#80B0E8',
  Culture: '#F29CC3',
  Science: '#D1CAEA',
  Gaming: '#D6D35F',
  Sports: '#C45F3F',
  Other: '#898E46',
};

const ThreadCard = ({ thread, onRefresh }) => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: thread.title, topic: thread.topic, content: thread.content });

  const handleDelete = async (threadId) => {
    if (window.confirm('Delete this post?')) {
      try {
        await axiosInstance.delete(`/api/threads/${threadId}`);
        onRefresh();
      } catch (err) {
        alert(err?.response?.data?.error || 'Failed to delete post');
      }
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/api/threads/${thread._id}`, editForm);
      setEditing(false);
      onRefresh();
    } catch (err) {
      alert(err?.response?.data?.error || 'Failed to update post');
    }
  };

  const topicColour = TOPIC_COLOURS[thread.topic] || '#ccc';
  const isAuthor = user && user._id === thread.author._id;

  return (
    <div className="thread-card">
      <div className="thread-header">
        <div className="thread-avatar">
          {thread.author?.name?.charAt(0).toUpperCase() || '?'}
        </div>
        <div>
          <span className="thread-author">{thread.author?.name}</span>
          <span className="thread-time">{new Date(thread.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleEdit} className="edit-form">
          <input
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          />
          <textarea
            value={editForm.content}
            onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <h3 className="thread-title">{thread.title}</h3>
          <p className="thread-content">{thread.content}</p>
        </>
      )}

      <div className="thread-footer">
        <span className="topic-tag" style={{ background: topicColour }}>
          {thread.topic}
        </span>
        <button>Comment</button>
        <button>Like</button>
        {isAuthor && (
          <>
            <button onClick={() => setEditing(true)}>Edit</button>
            <button onClick={() => handleDelete(thread._id)}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
}

export default ThreadCard;
