import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, LogIn, Mail, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { FormInput } from '@/components/ui/FormInput';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { getErrorMessage } from '@/utils/errorUtils';

// ── Zod validation schema ─────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login page.
 * - Email + password fields validated with Zod
 * - Submits via React Query mutation
 * - Shows server errors via Alert
 * - Redirects to /dashboard on success (handled in useAuth)
 */
export default function LoginPage() {
  const { loginMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const isLoading = isSubmitting || loginMutation.isPending;

  return (
    <div className="min-h-screen bg-mesh flex flex-col items-center justify-center px-4 py-12">

      {/* Brand mark */}
      <div className="flex flex-col items-center gap-3 mb-8 animate-fade-in">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
          <Shield size={22} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gradient">RBAC System</h1>
        <p className="text-sm text-[#9995b0]">Sign in to your account</p>
      </div>

      {/* Card */}
      <div className="auth-card">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">

          {/* Server error */}
          {loginMutation.isError && (
            <Alert type="error" message={getErrorMessage(loginMutation.error)} />
          )}

          {/* Email */}
          <div className="relative">
            <FormInput
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              error={errors.email?.message}
              {...register('email')}
            />
            <Mail size={15} className="absolute right-3.5 top-[38px] text-[#9995b0] pointer-events-none" />
          </div>

          {/* Password */}
          <div className="relative">
            <FormInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              error={errors.password?.message}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-[38px] text-[#9995b0] hover:text-white transition-colors"
              tabIndex={-1}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full mt-1"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" />
                Signing in…
              </>
            ) : (
              <>
                <LogIn size={16} />
                Sign in
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-xs text-[#9995b0]">or</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-[#9995b0]">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>

      {/* Demo hint */}
      <div className="mt-6 card px-5 py-3 text-xs text-[#9995b0] text-center max-w-sm animate-fade-in">
        <Lock size={12} className="inline mr-1.5 mb-0.5" />
        Demo accounts: register as <strong className="text-[#c8c4d8]">USER</strong> or{' '}
        <strong className="text-[#c8c4d8]">ADMIN</strong> to see role-based access in action.
      </div>
    </div>
  );
}
