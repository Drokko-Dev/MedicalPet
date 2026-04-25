import { Link } from 'react-router-dom';
import { useThemeStore } from '../../store/useThemeStore';
import { Moon, Sun, Stethoscope } from 'lucide-react';

export function Navbar() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Stethoscope className="h-8 w-8 text-[var(--color-brand-green)]" />
              <span className="font-bold text-xl tracking-tight text-[var(--color-brand-green)]">
                PetTrack
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-green)] transition-colors font-medium">
              Dashboard
            </Link>
            <Link to="/pets" className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-green)] transition-colors font-medium">
              Mis Mascotas
            </Link>
            <Link to="/agenda" className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-green)] transition-colors font-medium">
              Agenda
            </Link>
          </div>

          {/* Right section: Theme Toggle & Avatar (placeholder) */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-foreground)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)]"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {/* User Avatar Placeholder */}
            <div className="h-8 w-8 rounded-full bg-[var(--color-brand-blue)] flex items-center justify-center text-white font-semibold shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
              JD
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
