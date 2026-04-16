import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className='navbar'>
      <div className='navbar-logo'>
        <div className='logo-dots'>
          <span style={{ background: '#F4D242'}}> </span>
          <span style={{ background: '#F29CC3'}}></span>
          <span style={{background:'#80B0E8'}}></span>
        </div>
        <Link to="/" className='logo-text'>Buzz</Link>
      </div>
      <div className='navbar-search'>
        <input type="text" placeholder='Search'/>
      </div>
      <div className='navbar-actions'>
        {user ? (
  <>
    <span className="nav-username">👤 {user.name}</span>
    {user.role === 'admin' && (
      <Link to="/admin" className="btn-admin">Admin</Link>
    )}
    <Link to="/profile" className="btn-outline">Profile</Link>
    <button className="btn-logout" onClick={handleLogout}>Log Out</button>
  </>
) : (
  <>
    <Link to="/login"    className="btn-outline">Log In</Link>
    <Link to="/register" className="btn-primary">Sign Up</Link>
  </>
)}
      </div>
    </nav>
  );
};
//test
export default Navbar;
