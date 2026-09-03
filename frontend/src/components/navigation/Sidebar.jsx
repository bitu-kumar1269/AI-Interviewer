import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  BrainCircuit,
  LayoutDashboard,
  MessageSquarePlus,
  ClipboardList,
  FileText,
  History,
  User,
  LogOut,
  X,
  Briefcase,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/dashboard',         icon: LayoutDashboard,   label: 'Dashboard',       desc: 'Cockpit overview' },
  { to: '/interviews',        icon: ClipboardList,     label: 'Interviews',      desc: 'All mock sessions' },
  { to: '/interviews/new',    icon: MessageSquarePlus, label: 'New Interview',   desc: 'Create AI session', isPrimary: true },
  { to: '/sessions',          icon: History,           label: 'History',         desc: 'Past recordings & stats' },
  { to: '/resumes',           icon: FileText,          label: 'Resumes',         desc: 'ATS score & profiles' },
  { to: '/jobs',              icon: Briefcase,         label: 'Jobs',            desc: 'Live openings', badge: 'SOON' },
  { to: '/jobs/recommended',  icon: Sparkles,          label: 'Recommendations', desc: 'AI matched roles' },
  { to: '/profile',           icon: User,              label: 'Profile',         desc: 'Settings & account' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#090c17]/95 backdrop-blur-xl border-r border-[#192238] flex-shrink-0 select-none z-20">
        <SidebarContent user={user} onLogout={handleLogout} />
      </aside>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed left-0 top-0 z-40 h-full w-72 bg-[#090c17] border-r border-[#192238] flex flex-col lg:hidden shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Close navigation"
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#141b2f] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent user={user} onLogout={handleLogout} onNavClick={onClose} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({ user, onLogout, onNavClick }) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="px-5 py-5 border-b border-[#161d33] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative p-2 rounded-xl bg-gradient-to-br from-brand-500 via-violet-600 to-cyan-500 shadow-glow flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-base tracking-tight text-white">Interview</span>
              <span className="font-display font-bold text-base tracking-tight bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">AI</span>
            </div>
            <p className="text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
              COCKPIT v2.0
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Navigation
        </p>

        {NAV_ITEMS.map(({ to, icon: Icon, label, isPrimary, badge }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavClick}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              clsx(
                'group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isPrimary
                  ? isActive
                    ? 'bg-gradient-to-r from-brand-600 to-violet-600 text-white shadow-glow border border-brand-400/40'
                    : 'bg-gradient-to-r from-brand-600/20 to-violet-600/20 text-brand-200 hover:text-white border border-brand-500/30 hover:border-brand-400/60 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                  : isActive
                  ? 'bg-gradient-to-r from-brand-600/20 via-violet-600/15 to-transparent text-white border-l-2 border-l-brand-400 border-y border-r border-transparent'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#12172b]/80'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={clsx(
                    'p-1.5 rounded-lg transition-colors',
                    isPrimary
                      ? 'bg-white/10 text-white'
                      : isActive
                      ? 'text-brand-400 bg-brand-500/15'
                      : 'text-slate-400 group-hover:text-slate-200 group-hover:bg-[#19213b]'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <span className={clsx('flex-1 text-xs sm:text-sm', isPrimary && 'font-semibold')}>
                  {label}
                </span>

                {badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 uppercase tracking-wider">
                    {badge}
                  </span>
                )}

                {isPrimary && !badge && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}

                {isActive && !isPrimary && !badge && (
                  <ChevronRight className="w-3.5 h-3.5 text-brand-400/60" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User profile dock */}
      <div className="p-3 border-t border-[#161d33] bg-[#070912]/80">
        <div className="p-2.5 rounded-xl bg-[#0f1426]/70 border border-[#1b233d] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 via-violet-600 to-cyan-500 p-[1px]">
                <div className="w-full h-full rounded-[11px] bg-[#090d18] flex items-center justify-center text-white font-semibold text-xs">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#090d18]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Candidate'}</p>
                <ShieldCheck className="w-3 h-3 text-cyan-400 flex-shrink-0" />
              </div>
              <p className="text-[11px] text-slate-500 truncate">{user?.email || 'Logged In'}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
