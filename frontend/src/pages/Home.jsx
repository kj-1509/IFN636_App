import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import ThreadForm from '../components/ThreadForm';
import ThreadCard from '../components/ThreadCard';
import { useAuth } from '../context/AuthContext';

const TOPICS = [ 'Tech', 'Culture', 'Science', 'Gaming', 'Sports', 'Other'];

const Home = () => {
  const [threads, setThreads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTopic, setActiveTopic] = useState('All');
  const { user } = useAuth();

  const fetchThreads = async () => {
  try {
    const res = await api.get('/api/threads');
    const data = Array.isArray(res.data) ? res.data : [];
    setThreads(data);
  } catch (err) {
    console.log(err.message);
    setThreads([]);
  }
};


  useEffect(() => { fetchThreads(); }, []);
  
  const filtered = Array.isArray(threads)
  ? (activeTopic === 'All' ? threads : threads.filter(t => t.topic === activeTopic))
  : [];

  return (
    <div className="page-layout">
      <aside className="sidebar">
        <button className="sidebar-item">Home</button>
        <button className="sidebar-item">Popular</button>
        <button className="sidebar-item">New</button>
        <button className="sidebar-item">Explore</button>
        <div className="sidebar-divider"/>
        <p className="sidebar-label">Topics</p>
        {TOPICS.filter(t => t !== 'All').map(topic => (
          <button
            key={topic}
            className="sidebar-item"
            onClick={() => setActiveTopic(topic)}
          >
            {topic}
          </button>
        ))}
      </aside>
      <main className="main-content">
        {!user && (
          <div className="hero-banner">
            <div>
              <h2>Join the discussion today!</h2>
              <p>Buzz is a forum for your community.</p>
            </div>
            <a href="/register" className="hero-button">Create a free account</a>
          </div>
      )}
      <div className="topic-buttons">
        {TOPICS.map(topic => (
          <button key={topic} className={'button $[activeTopic === topic ? "active" : ""]'} onClick={() => setActiveTopic(topic)}>
            {topic}
          </button>
        ))}
        {user && (
          <button className="btn-new-post" onClick={() => setShowForm(!showForm)}>New Post</button>
        )}
      </div>

      {showForm && (
        <ThreadForm onCreated={() => {setShowForm(false); fetchThreads();}} />
      )}
          {filteredThreads.length === 0
            ? <p className="empty"> No posts available.</p>
            : filteredThreads.map(thread => (
                <ThreadCard key={thread._id} thread={thread} onRefresh={fetchThreads} />
              ))}
          </main>
    
    <aside className="right-panel">
      <div className="panel-block">
        <h4>Trending Threads</h4>
      </div>
      <div className="panel-block">
        <h4>Community Stats</h4>
      </div>
    </aside>
  </div>
  );
};

export default Home;
    