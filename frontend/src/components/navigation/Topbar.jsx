import { Menu, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLocation, Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/common';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/interviews': 'My Interviews',
  '/interviews/new': 'New Interview',
  '/sessions': 'Session History',
  '/resumes': 'My Resumes',
  '/jobs': 'Jobs Portal',
  '/profile': 'Profile',
};

export default function Topbar({ onMenuClick }) {
  const { user } = useAuthStore();
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'AI Interview';

  return (
    <header className="h-16 bg-surface-card border-b border-surface-border flex items-center justify-between px-6 flex-shrink-0 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-surface-hover lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-display font-semibold text-slate-900 dark:text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        <button
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-surface-hover transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>

        <Link
          to="/profile"
          className="flex items-center gap-2 pl-3 border-l border-surface-border hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-brand flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User'}
                className="w-full h-full object-cover"
              />
            ) : (
              user?.name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <span className="text-sm text-slate-700 dark:text-slate-300 font-medium hidden sm:block">{user?.name}</span>
        </Link>
      </div>
    </header>
  );
}
