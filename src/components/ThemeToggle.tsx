import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center gap-2 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 cursor-pointer ${
        isDark
          ? 'bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-slate-700 shadow-md'
          : 'bg-white/90 hover:bg-white text-rose-500 border border-rose-200/80 shadow-sm'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-5 h-5 transition-transform duration-300 hover:rotate-45" />
        ) : (
          <Moon className="w-5 h-5 transition-transform duration-300 hover:-rotate-12" />
        )}
      </div>
      <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline-block pr-1 select-none">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
};

export default ThemeToggle;
