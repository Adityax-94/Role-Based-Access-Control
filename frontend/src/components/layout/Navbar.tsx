import { LogOut, Shield, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import clsx from 'clsx';

/**
 * Top navigation bar shown on all authenticated pages.
 * Displays the app logo, current user info, role badge, and logout button.
 */
export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#0f0f13]/80 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 font-semibold text-white hover:opacity-80 transition-opacity"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600">
            <Shield size={16} className="text-white" />
          </span>
          <span className="hidden sm:block text-sm tracking-wide">RBAC System</span>
        </Link>

        {/* Right side */}
        {user && (
          <div className="flex items-center gap-3">
            {/* Role badge */}
            <span className={clsx(
              user.role === 'ADMIN' ? 'badge-admin' : 'badge-user'
            )}>
              {user.role === 'ADMIN'
                ? <Shield size={11} />
                : <User size={11} />
              }
              {user.role}
            </span>

            {/* User name */}
            <span className="hidden sm:block text-sm text-[#9995b0] max-w-[120px] truncate">
              {user.name}
            </span>

            {/* Divider */}
            <div className="w-px h-5 bg-white/10" />

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-[#9995b0] hover:text-red-400
                         transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-red-400/10"
              title="Log out"
            >
              <LogOut size={15} />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
