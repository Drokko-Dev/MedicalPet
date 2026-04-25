import { Link, useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Moon, Sun, Stethoscope, LogOut } from 'lucide-react';

export function Navbar() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={isAuthenticated ? (user?.role === 'vet' ? '/vet/dashboard' : '/dashboard') : '/'} className="flex items-center gap-2">
              <Stethoscope className="h-8 w-8 text-[var(--color-brand-green)]" />
              <span className="font-bold text-xl tracking-tight text-[var(--color-brand-green)]">
                PetTrack
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              <Link to={user?.role === 'vet' ? '/vet/dashboard' : '/dashboard'} className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-green)] transition-colors font-medium">
                Dashboard
              </Link>
              {user?.role === 'owner' && (
                <Link to="/pets" className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-green)] transition-colors font-medium">
                  Mis Mascotas
                </Link>
              )}
              {user?.role === 'vet' && (
                <Link to="/vet/patients" className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-green)] transition-colors font-medium">
                  Pacientes
                </Link>
              )}
              <Link to="/agenda" className="text-[var(--color-text-muted)] hover:text-[var(--color-brand-green)] transition-colors font-medium">
                Agenda
              </Link>
            </div>
          )}

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-foreground)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)]"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 rounded-full bg-[var(--color-brand-blue)] flex items-center justify-center text-white font-semibold shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-foreground)] transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-hover)] rounded-lg shadow-sm transition-colors">
                  Registro
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
