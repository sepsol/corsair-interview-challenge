'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

export default function UserNavbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuButtonRef, setMenuButtonRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
  };

  const renderMobileMenu = () => {
    if (!isMenuOpen || !menuButtonRef) return null;

    const rect = menuButtonRef.getBoundingClientRect();
    
    return createPortal(
      <>
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setIsMenuOpen(false)}
        />
        <div 
          className="fixed z-20 min-w-[160px] border rounded-lg shadow-lg overflow-hidden"
          style={{ 
            backgroundColor: 'var(--card)', 
            borderColor: 'var(--border)',
            top: rect.bottom + 8,
            right: window.innerWidth - rect.right,
          }}
        >
          <div className="p-2 space-y-2">
            <Button 
              variant="secondary" 
              size="md" 
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="w-full justify-start"
              style={{ width: '100%' }}
            >
              <svg 
                className="w-4 h-4 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
              Logout
            </Button>
            <div style={{ width: '100%' }}>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </>,
      document.body
    );
  };

  if (!user) return null;

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Welcome back,</p>
          <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{user.username}</p>
        </div>
        
        {/* Desktop buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Button 
            variant="secondary" 
            size="md" 
            onClick={handleLogout}
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
            Logout
          </Button>
          <ThemeSwitcher />
        </div>

        {/* Mobile menu button */}
        <button
          ref={setMenuButtonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg border transition-colors cursor-pointer"
          style={{ 
            backgroundColor: 'var(--secondary)', 
            borderColor: 'var(--border)', 
            color: 'var(--foreground)' 
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--secondary)';
          }}
          aria-label="Open menu"
        >
          <svg 
            className="w-4 h-4" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
          </svg>
        </button>
      </div>
      
      {renderMobileMenu()}
    </>
  );
}