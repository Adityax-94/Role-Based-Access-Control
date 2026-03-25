import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Globe,
  Lock,
  Settings,
  Shield,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { resourceApi } from '@/api/resourceApi';
import { useAuthStore } from '@/store/authStore';
import { Navbar } from '@/components/layout/Navbar';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { getErrorMessage } from '@/utils/errorUtils';
import clsx from 'clsx';

/**
 * Main dashboard page shown after login.
 * Fetches content from all accessible endpoints and renders
 * role-gated cards based on the current user's role.
 */
export default function DashboardPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  // ── Public content (everyone) ───────────────────────────────────────────
  const publicQuery = useQuery({
    queryKey: ['public-content'],
    queryFn: resourceApi.getPublicContent,
    staleTime: 60_000,
  });

  // ── User content (USER + ADMIN) ──────────────────────────────────────────
  const userQuery = useQuery({
    queryKey: ['user-content'],
    queryFn: resourceApi.getUserContent,
    staleTime: 60_000,
  });

  // ── Admin content (ADMIN only) ───────────────────────────────────────────
  const adminQuery = useQuery({
    queryKey: ['admin-content'],
    queryFn: resourceApi.getAdminContent,
    enabled: isAdmin,
    staleTime: 60_000,
  });

  // ── Admin: list all users ────────────────────────────────────────────────
  const allUsersQuery = useQuery({
    queryKey: ['all-users'],
    queryFn: resourceApi.getAllUsers,
    enabled: isAdmin,
    staleTime: 30_000,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">

        {/* Welcome header */}
        <div className="animate-slide-up">
          <h2 className="text-2xl font-bold text-white">
            Welcome back, <span className="text-gradient">{user?.name}</span> 👋
          </h2>
          <p className="text-[#9995b0] mt-1 text-sm">
            You're signed in as{' '}
            <span className={clsx(
              'font-semibold',
              isAdmin ? 'text-violet-400' : 'text-sky-400'
            )}>
              {user?.role}
            </span>
            . Below you'll see all content sections your role can access.
          </p>
        </div>

        {/* ── Stats row ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '60ms' }}>
          {[
            { label: 'Role',    value: user?.role ?? '—',  icon: Shield,   color: isAdmin ? 'text-violet-400' : 'text-sky-400' },
            { label: 'Email',   value: 'Verified',         icon: CheckCircle, color: 'text-emerald-400' },
            { label: 'Access',  value: isAdmin ? 'Full' : 'Standard', icon: Lock, color: 'text-indigo-400' },
            { label: 'Status',  value: 'Active',           icon: Activity, color: 'text-green-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card px-4 py-3 flex items-center gap-3">
              <Icon size={18} className={color} />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#9995b0]">{label}</p>
                <p className="text-sm font-semibold text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Content cards grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* PUBLIC CARD */}
          <ContentCard
            title="Public Content"
            subtitle="Accessible by everyone — no auth required"
            icon={<Globe size={18} className="text-emerald-400" />}
            accentColor="emerald"
            isLoading={publicQuery.isLoading}
            isError={publicQuery.isError}
            error={publicQuery.error}
          >
            {publicQuery.data && (
              <div className="space-y-2 text-sm text-[#c8c4d8]">
                <p>{publicQuery.data.message}</p>
                <p className="text-[#9995b0] text-xs">{publicQuery.data.info}</p>
              </div>
            )}
          </ContentCard>

          {/* USER CARD */}
          <ContentCard
            title="User Content"
            subtitle="Requires USER or ADMIN role"
            icon={<Shield size={18} className="text-sky-400" />}
            accentColor="sky"
            isLoading={userQuery.isLoading}
            isError={userQuery.isError}
            error={userQuery.error}
          >
            {userQuery.data && (
              <div className="space-y-3">
                <p className="text-sm text-[#c8c4d8]">{userQuery.data.message}</p>
                <ul className="space-y-1.5">
                  {userQuery.data.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[#9995b0]">
                      <CheckCircle size={12} className="text-sky-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </ContentCard>

          {/* ADMIN CARD — only rendered for ADMIN users */}
          {isAdmin && (
            <ContentCard
              title="Admin Content"
              subtitle="Restricted to ADMIN role only"
              icon={<ShieldAlert size={18} className="text-violet-400" />}
              accentColor="violet"
              isLoading={adminQuery.isLoading}
              isError={adminQuery.isError}
              error={adminQuery.error}
              badge="ADMIN ONLY"
            >
              {adminQuery.data && (
                <div className="space-y-3">
                  <p className="text-sm text-[#c8c4d8]">{adminQuery.data.message}</p>
                  <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 text-xs text-amber-300">
                    <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                    {adminQuery.data.warning}
                  </div>
                  <ul className="space-y-1.5">
                    {adminQuery.data.permissions.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-xs text-[#9995b0]">
                        <Settings size={11} className="text-violet-400 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </ContentCard>
          )}

          {/* Show locked admin card to USER role */}
          {!isAdmin && (
            <LockedCard
              title="Admin Content"
              subtitle="You need ADMIN role to access this section"
            />
          )}

          {/* ALL USERS CARD — ADMIN only */}
          {isAdmin && (
            <ContentCard
              title="All Registered Users"
              subtitle="User directory — ADMIN only"
              icon={<Users size={18} className="text-rose-400" />}
              accentColor="rose"
              isLoading={allUsersQuery.isLoading}
              isError={allUsersQuery.isError}
              error={allUsersQuery.error}
              badge="ADMIN ONLY"
            >
              {allUsersQuery.data && (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {allUsersQuery.data.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#1e1e2e] text-xs"
                    >
                      <div>
                        <p className="font-medium text-[#f1f0f5]">{u.name}</p>
                        <p className="text-[#9995b0]">{u.email}</p>
                      </div>
                      <span className={clsx(
                        u.role === 'ADMIN' ? 'badge-admin' : 'badge-user'
                      )}>
                        {u.role}
                      </span>
                    </div>
                  ))}
                  {allUsersQuery.data.length === 0 && (
                    <p className="text-xs text-[#9995b0] text-center py-4">No users found.</p>
                  )}
                </div>
              )}
            </ContentCard>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ContentCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: 'emerald' | 'sky' | 'violet' | 'rose';
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  badge?: string;
  children?: React.ReactNode;
}

const accentBorderMap = {
  emerald: 'border-emerald-500/20',
  sky:     'border-sky-500/20',
  violet:  'border-violet-500/20',
  rose:    'border-rose-500/20',
};

const accentBadgeMap = {
  emerald: 'bg-emerald-500/10 text-emerald-400',
  sky:     'bg-sky-500/10 text-sky-400',
  violet:  'bg-violet-500/10 text-violet-400',
  rose:    'bg-rose-500/10 text-rose-400',
};

function ContentCard({
  title, subtitle, icon, accentColor,
  isLoading, isError, error, badge, children,
}: ContentCardProps) {
  return (
    <div className={clsx(
      'card border p-5 flex flex-col gap-4 animate-slide-up',
      accentBorderMap[accentColor]
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04]">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <p className="text-[11px] text-[#9995b0]">{subtitle}</p>
          </div>
        </div>
        {badge && (
          <span className={clsx(
            'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider',
            accentBadgeMap[accentColor]
          )}>
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-[#9995b0]">
            <Spinner size="sm" /> Loading…
          </div>
        )}
        {isError && (
          <Alert type="error" message={getErrorMessage(error)} />
        )}
        {!isLoading && !isError && children}
      </div>
    </div>
  );
}

function LockedCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="card border border-white/[0.04] p-5 flex flex-col gap-4 opacity-50 select-none">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04]">
          <Lock size={18} className="text-[#9995b0]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-[11px] text-[#9995b0]">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 py-6 text-[#9995b0]">
        <Lock size={28} strokeWidth={1.5} />
        <p className="text-sm text-center">This content is restricted.</p>
        <p className="text-xs text-center">Register with the ADMIN role to unlock this section.</p>
      </div>
    </div>
  );
}
