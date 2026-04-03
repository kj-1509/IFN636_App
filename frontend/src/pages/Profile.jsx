import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get('/api/auth/profile');
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          bio: response.data.bio || '',
          location: response.data.location || '',
        });
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.put('/api/auth/profile', formData);
      setMessage('Profile updated successfully!');
      if (updateUser) updateUser(response.data);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-20">
        <p>Please log in to view and edit your profile.</p>
        <a href="/login" className="text-blue-500 underline">Go to Login</a>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Your Profile</h1>
        {error && <p className="text-red-600 mb-3">{error}</p>}
        {message && <p className="text-green-600 mb-3">{message}</p>}
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <textarea
          placeholder="Bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full mb-4 p-2 border rounded h-24"
        />
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
