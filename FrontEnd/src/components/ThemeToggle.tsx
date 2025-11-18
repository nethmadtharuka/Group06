import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle = ({ className = '', showLabel = false }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
    // Debug: Check if class is being applied
    if (import.meta.env.DEV) {
      console.log('Theme toggled to:', theme === 'dark' ? 'light' : 'dark');
      console.log('HTML classes:', document.documentElement.classList.toString());
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 light:bg-gray-200 light:hover:bg-gray-300 text-gray-300 hover:text-white dark:text-gray-300 light:text-gray-700 transition-colors ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-5 h-5" />
          {showLabel && <span>Light Mode</span>}
        </>
      ) : (
        <>
          <Moon className="w-5 h-5" />
          {showLabel && <span>Dark Mode</span>}
        </>
      )}
    </button>
  );
};

