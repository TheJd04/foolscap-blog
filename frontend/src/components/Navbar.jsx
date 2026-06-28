import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});


export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Dateline strip — newspaper-style detail, sets the editorial tone */}
      <div className="hidden sm:block text-center text-xs font-mono tracking-wide text-ink-soft py-1.5 border-b border-hairline bg-panel">
        {today}
      </div>

      <header className={`sticky top-0 z-50 border-b border-transparent glass-header transition-all duration-300 ${scrolled ? 'scrolled' : ''}`}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-2 group">
            <span className="font-display text-3xl font-semibold tracking-tight text-ink group-hover:text-teal transition-colors">
              Foolscap
            </span>
            <span className="hidden md:inline text-xs font-mono text-ink-soft opacity-75 group-hover:opacity-100 transition-opacity">
              — write things down
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="text-ink hover:text-teal transition-colors nav-link-underline">
              Read
            </Link>

            {user ? (
              <>
                <Link to="/new" className="text-ink hover:text-teal transition-colors nav-link-underline">
                  Write
                </Link>
                <Link to="/dashboard" className="text-ink hover:text-teal transition-colors nav-link-underline">
                  My posts
                </Link>
                <span className="hidden sm:inline text-ink-soft font-mono text-xs bg-panel border border-hairline rounded px-2.5 py-1">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-hairline px-4 py-1.5 text-xs tracking-wide uppercase font-mono hover:border-rust hover:text-rust transition-colors cursor-pointer"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-ink hover:text-teal transition-colors nav-link-underline">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-wide font-mono text-paper hover:bg-teal transition-all duration-300 hover:shadow-md active:scale-95"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}

