import { useAuth } from '../context/AuthContext.jsx';
import { Search, Bell, LogOut, User, Menu, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useNotifications } from '../context/NotificationContext.jsx';
import NotificationDropdown from './NotificationDropdown.jsx';

export default function NavBar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="top-nav glass-nav">
      <div className="flex items-center gap-16">
        <button 
          className="btn-ghost p-8 hamburger md:hidden" 
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex' }}
        >
          <Menu size={20} color="white" />
        </button>
        <div className="search-box">
          <Search size={18} color="var(--text-muted)" />
          <input type="text" className="search-input" placeholder="Search questions, topics..." />
        </div>
      </div>

      <div className="nav-actions">
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-ghost" 
            aria-label={`View notifications, ${unreadCount} unread`}
            style={{ border: 'none', background: 'none', padding: '8px', cursor: 'pointer', position: 'relative' }}
          >
            <Bell size={20} color="var(--text-secondary)" />
            {unreadCount > 0 && <span className="notification-badge" />}
          </button>

          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}
        </div>
        
        <div className="user-profile-container" style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="user-profile-trigger glass" 
            aria-label="User account menu"
            aria-expanded={showUserMenu}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 12px', borderRadius: '12px', 
              border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer' 
            }}
          >
            <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
              {user?.avatar ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : userInitial}
            </div>
            <div className="hidden md:block" style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.role || 'Student'}</div>
            </div>
          </button>

          {showUserMenu && (
            <>
              <div 
                style={{ position: 'fixed', inset: 0, zIndex: 98 }} 
                onClick={() => setShowUserMenu(false)} 
              />
              <div className="glass-strong user-dropdown animate-fade-in" style={{ 
                position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: '220px', 
                padding: '12px', borderRadius: '16px', zIndex: 99, boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ padding: '8px 12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{user?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                </div>
                
                <button 
                  onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                  className="dropdown-item"
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', transition: '0.2s' }}
                >
                  <User size={16} /> View Profile
                </button>
                <button 
                  onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                  className="dropdown-item"
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', transition: '0.2s' }}
                >
                  <Settings size={16} /> Settings
                </button>
                
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '8px 0' }} />
                
                <button 
                  onClick={handleLogout}
                  className="dropdown-item text-danger"
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', textAlign: 'left', transition: '0.2s' }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
