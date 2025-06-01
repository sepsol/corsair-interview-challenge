'use client';

import { useTheme, Theme } from '@/contexts/ThemeContext';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRef, setButtonRef] = useState<HTMLElement | null>(null);

  const themes: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[2];

  const renderDropdown = () => {
    if (!isOpen || !buttonRef) return null;

    const rect = buttonRef.getBoundingClientRect();
    
    return createPortal(
      <>
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setIsOpen(false)}
        />
        <div 
          className="fixed z-20 min-w-[120px] border rounded-lg shadow-lg overflow-hidden"
          style={{ 
            backgroundColor: 'var(--card)', 
            borderColor: 'var(--border)',
            top: rect.bottom + 8,
            right: window.innerWidth - rect.right,
          }}
        >
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => {
                setTheme(themeOption.value);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors cursor-pointer"
              style={{
                backgroundColor: theme === themeOption.value ? 'var(--accent)' : 'transparent',
                color: theme === themeOption.value ? 'var(--accent-foreground)' : 'var(--foreground)'
              }}
              onMouseEnter={(e) => {
                if (theme !== themeOption.value) {
                  e.currentTarget.style.backgroundColor = 'var(--muted)';
                }
              }}
              onMouseLeave={(e) => {
                if (theme !== themeOption.value) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                } else {
                  e.currentTarget.style.backgroundColor = 'var(--accent)';
                }
              }}
            >
              <span>{themeOption.icon}</span>
              <span>{themeOption.label}</span>
              {theme === themeOption.value && (
                <span className="ml-auto" style={{ color: 'var(--primary)' }}>✓</span>
              )}
            </button>
          ))}
        </div>
      </>,
      document.body
    );
  };

  return (
    <div className="relative">
      <button
        ref={setButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer"
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
        aria-label="Switch theme"
      >
        <span className="text-sm">{currentTheme.icon}</span>
        <span className="text-sm font-medium">{currentTheme.label}</span>
        <span className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {renderDropdown()}
    </div>
  );
}