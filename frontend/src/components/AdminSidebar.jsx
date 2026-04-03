import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? 'admin-nav-item active' : 'admin-nav-item';

  return (
    <aside className="admin-sidebar">
      
      <div className="admin-user">
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <span>{user?.name}</span>
      </div>

      
      <nav className="admin-nav">
        <p className="sidebar-label">OVERVIEW</p>
        <Link to="/admin"         className={isActive('/admin')}>
          Dashboard
        </Link>

        <p className="sidebar-label">COMMUNITY</p>
        <Link to="/admin/users"   className={isActive('/admin/users')}>
          Users
        </Link>
        <Link to="/admin/threads" className={isActive('/admin/threads')}>
          Threads
        </Link>
        <Link to="/admin/topics"  className={isActive('/admin/topics')}>
          Topics
        </Link>

        <p className="sidebar-label">SYSTEM</p>
        <Link to="/" className="admin-nav-item">
          Back to Forum
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
