import { Link } from 'react-router-dom';
import { MapPin, Mail } from 'lucide-react';

const quickLinks = [
  { label: 'Business Directory', path: '/directory' },
  { label: 'Events', path: '/events' },
  { label: 'AI Concierge', path: '/concierge' },
  { label: 'Relocation Guide', path: '/guide' },
  { label: 'Professionals', path: '/professionals' },
  { label: 'Community Map', path: '/map' },
];

const resourceLinks = [
  { label: 'About Us', path: '/about' },
  { label: 'List Your Business', path: '/directory' },
  { label: 'Partner With Us', path: '/about' },
  { label: 'Privacy Policy', path: '#' },
  { label: 'Terms of Service', path: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-deep-teal text-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">NC</span>
              </div>
              <span className="font-display text-[20px] font-bold text-white">
                NC Desi Circle
              </span>
            </Link>
            <p className="font-accent italic text-gold text-[16px] mb-4">
              Where Tradition Meets Tar Heel Spirit
            </p>
            <p className="text-white/70 text-[14px] leading-relaxed mb-6">
              North Carolina&apos;s premier discovery engine for South Asian community, business, and culture.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gold hover:text-white transition-colors duration-200" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="text-gold hover:text-white transition-colors duration-200" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="text-gold hover:text-white transition-colors duration-200" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-[14px] font-semibold uppercase tracking-wider text-white/90 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-white/70 text-[14px] hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-body text-[14px] font-semibold uppercase tracking-wider text-white/90 mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-white/70 text-[14px] hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h4 className="font-body text-[14px] font-semibold uppercase tracking-wider text-white/90 mb-4">
              Stay Connected
            </h4>
            <p className="text-white/70 text-[14px] mb-4">
              Get the latest events and updates from the community.
            </p>
            <div className="flex mb-6">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 rounded-l-lg bg-white/10 border border-white/20 text-white placeholder-white/50 text-[14px] focus:outline-none focus:border-saffron"
              />
              <button className="px-4 py-2.5 rounded-r-lg bg-saffron text-white text-[14px] font-semibold hover:brightness-110 transition-all duration-200">
                Join
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/70 text-[13px]">
                <MapPin className="w-4 h-4 text-gold shrink-0" />
                <span>North Carolina, USA</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-[13px]">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>hello@ncdesicircle.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-[13px]">
            &copy; {new Date().getFullYear()} NC Desi Circle. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-white/50 text-[13px] hover:text-gold transition-colors duration-200">
              Terms
            </Link>
            <Link to="#" className="text-white/50 text-[13px] hover:text-gold transition-colors duration-200">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
