import React, { useContext } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, Activity, LogOut } from 'lucide-react';

const Navbar = () => {
  const { logOut } = useContext(AuthContext);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  const firstName = user?.given_name || user?.name || 'User';
  const initials = firstName.charAt(0).toUpperCase();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
        <Activity className="w-5 h-5 text-indigo-400" />
        <span className="navbar-brand-text">Fit&Fantastic</span>
      </div>

      <div className="navbar-nav">
        <a
          className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </a>
        <a
          className={`navbar-link ${isActive('/activities') ? 'active' : ''}`}
          onClick={() => navigate('/activities')}
        >
          <Activity className="w-4 h-4" />
          Activities
        </a>
      </div>

      <div className="navbar-actions">
        <div className="navbar-user">
          <div className="navbar-avatar">{initials}</div>
          <span className="navbar-username">{firstName}</span>
        </div>
        <button className="navbar-logout-btn" onClick={logOut}>
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
