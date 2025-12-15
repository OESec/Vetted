
import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';
import Button from './Button';
import { NavLink } from '../types';

const navLinks: NavLink[] = [
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
];

interface NavbarProps {
  onNavigateToApp?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigateToApp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
      window.history.pushState(null, '', href);
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="#" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <span className="text-xl font-serif font-bold text-neutralDark">Vetted</span>
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.label} 
                href={link.href} 
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="text-neutralDark/80 hover:text-primary font-medium transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center space-x-4">
              <button 
                onClick={onNavigateToApp} 
                className="text-neutralDark font-medium hover:text-primary"
              >
                Log in
              </button>
              <Button onClick={onNavigateToApp} variant="primary" size="sm">Get Started</Button>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutralDark hover:text-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg animate-fade-in-up">
          <div className="px-4 pt-2 pb-6 space-y-4">
            {navLinks.map((link) => (
              <a 
                key={link.label} 
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="block text-lg font-medium text-neutralDark hover:text-primary py-2"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 flex flex-col space-y-3">
              <Button onClick={onNavigateToApp} variant="secondary" className="w-full justify-center">Log in</Button>
              <Button onClick={onNavigateToApp} variant="primary" className="w-full justify-center">Get Started</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
