import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Business Directory', path: '/directory' },
  { label: 'Events', path: '/events' },
  { label: 'AI Concierge', path: '/concierge' },
  { label: 'Submit', path: '/submit' },
  { label: 'Relocation Guide', path: '/guide' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isHome = location.pathname === '/';
  const showTransparent = isHome && !scrolled && !mobileOpen;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out"
      style={{
        backgroundColor: showTransparent ? 'transparent' : '#FAF6F1',
        boxShadow: showTransparent ? 'none' : '0 1px 12px rgba(0,0,0,0.06)',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">NC</span>
            </div>
            <span
              className="font-display text-[20px] font-bold tracking-tight transition-colors duration-300"
              style={{ color: showTransparent ? '#FFFFFF' : '#D4621A' }}
            >
              NC Desi Circle
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative font-body text-[14px] font-medium transition-colors duration-200 group"
                style={{ color: showTransparent ? 'rgba(255,255,255,0.85)' : '#6B6865' }}
                onMouseEnter={(e) => {
                  if (showTransparent) e.currentTarget.style.color = '#FFFFFF';
                  else e.currentTarget.style.color = '#1E2328';
                }}
                onMouseLeave={(e) => {
                  if (showTransparent) e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
                  else e.currentTarget.style.color = '#6B6865';
                }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-saffron transition-all duration-250 ease-out group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/directory"
              className="px-5 py-2 rounded-full bg-saffron text-white font-body text-[14px] font-semibold hover:scale-[1.02] hover:brightness-110 transition-all duration-200"
            >
              List Your Business
            </Link>
            <Link
              to="/about"
              className="font-body text-[14px] font-medium text-teal hover:text-deep-teal transition-colors duration-200"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-saffron" />
            ) : (
              <Menu className="w-6 h-6" style={{ color: showTransparent ? '#FFFFFF' : '#D4621A' }} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[72px] bg-warm-cream z-40">
          <div className="flex flex-col items-center justify-center gap-6 pt-12">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="font-body text-[18px] font-medium text-charcoal hover:text-saffron transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col items-center gap-4 mt-4">
              <Link
                to="/directory"
                className="px-6 py-3 rounded-full bg-saffron text-white font-body text-[14px] font-semibold"
              >
                List Your Business
              </Link>
              <Link
                to="/about"
                className="font-body text-[14px] font-medium text-teal"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
