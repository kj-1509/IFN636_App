import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import ThreadForm from '../components/ThreadForm';
import ThreadCard from '../components/ThreadCard';
import { useAuth } from '../context/AuthContext';

const TOPICS = ['All', 'Tech', 'Culture', 'Science', 'Gaming', 'Sports', 'Other'];

const Home = () => {
  const [threads, setThreads] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTopic, setActiveTopic] = useState('All');
  const { user } = useAuth();

  const fetchThreads = async () => {
    try {
      const res = await axiosInstance.get('/threads');
      setThreads(res.data);
    } catch (error) {
      console.error('Failed to fetch threads', error);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const filtered = activeTopic === 'All'
    ? threads
    : threads.filter(t => t.topic === activeTopic);

  return (
    <div className="page-layout">
      <aside className='sidebar'>
        <nav>
          <button className='sidebar-item active'>Home</button>
          <button className='sidebar-item'>Popular</button>
          <button className='sidebar-item'>New</button>
          <button className='sidebar-item'>Explore</button>
        </nav>
        <div className='sidebar-divider' />
        <p className='sidebar-label'>TOPICS</p>
        {TOPICS.filter(t => t !== 'All').map(topic => (
          <button
            key={topic}
            className='sidebar-item'
            onClick={() => setActiveTopic(topic)}
          >
            {topic}
          </button>
        ))}
      </aside>

      <main className='main-feed'>
        {!user && (
          <div className='hero-banner'>
            <div>
              <h2>Join the discussion today!</h2>
              <p>Buzz is a forum for your community</p>
            </div>
            <a href='/register' className='btn-hero'>Create a free account</a>
          </div>
        )}

        <div className='topic-buttons'>
          {TOPICS.map(topic => (
            <button
              key={topic}
              className={`button ${activeTopic === topic ? 'active' : ''}`}
              onClick={() => setActiveTopic(topic)}
            >
              {topic}
            </button>
          ))}
          {user && (
            <button
              className='btn-new-post'
              onClick={() => setShowForm(prev => !prev)}
            >
              + New Post
            </button>
          )}
        </div>

        {showForm && (
          <ThreadForm
            onCreated={() => {
              setShowForm(false);
              fetchThreads();
            }}
          />
        )}

        {filtered.map(thread => (
          <ThreadCard
            key={thread._id}
            thread={thread}
            onRefresh={fetchThreads}
          />
        ))}
      </main>

      <aside className="right-panel">
        <div className="panel-block">
          <h4>Trending Threads</h4>
          <p className="placeholder-text">Loading</p>
        </div>
        <div className='panel-block'>
          <h4>Community Stats</h4>
          <p className='placeholder-text'>Loading</p>
        </div>
      </aside>
    </div>
  );
};

export default Home;
