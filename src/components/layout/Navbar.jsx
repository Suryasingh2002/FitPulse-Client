import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dumbbell, Menu, X, LogOut, User, LayoutDashboard, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/workouts', label: 'Workouts' },
    { to: '/challenges', label: 'Challenges' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Dumbbell size={16} className="text-white" />
            </div>
            <span className="font-display text-2xl font-800 tracking-tight text-white">
              FIT<span className="text-primary">PULSE</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-semibold text-sm tracking-wide transition-colors ${
                  isActive(link.to) ? 'text-primary' : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-surface-elevated border border-surface-border rounded-xl px-4 py-2 hover:border-primary/40 transition-colors"
                >
                  <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-xs font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-white/80">{user.name}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface-elevated border border-surface-border rounded-xl shadow-2xl overflow-hidden z-50">
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-surface-card text-sm text-white/80 hover:text-white transition-colors">
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-surface-card text-sm text-white/80 hover:text-white transition-colors">
                      <User size={15} /> Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-surface-card text-sm text-primary transition-colors">
                        <Shield size={15} /> Admin
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-card text-sm text-red-400 hover:text-red-300 transition-colors border-t border-surface-border">
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost py-2 px-5 text-sm">Login</Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-card border-t border-surface-border px-4 py-4 space-y-2">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
              className="block py-3 px-4 rounded-xl text-white/70 hover:text-white hover:bg-surface-elevated font-medium">
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block py-3 px-4 rounded-xl text-white/70 hover:text-white hover:bg-surface-elevated">Dashboard</Link>
              {user.role === 'admin' && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-3 px-4 rounded-xl text-primary hover:bg-surface-elevated">Admin</Link>}
              <button onClick={handleLogout} className="w-full text-left py-3 px-4 rounded-xl text-red-400 hover:bg-surface-elevated">Logout</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 btn-ghost text-sm text-center">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 btn-primary text-sm text-center">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
