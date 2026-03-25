import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Shield, ShieldCheck, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { FormInput } from '@/components/ui/FormInput';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { getErrorMessage } from '@/utils/errorUtils';
import type { Role } from '@/types';
import clsx from 'clsx';

// ── Zod schema ────────────────────────────────────────────────────────────────
const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be under 60 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['USER', 'ADMIN'], { required_error: 'Please select a role' }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Registration page.
 * - Name, email, password fields + role selector
 * - Full Zod validation matching backend rules
 * - Role card UI for USER / ADMIN selection
 */
export default function RegisterPage() {
  const { registerMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'USER' },
  });

  const selectedRole = watch('role');
  const isLoading = isSubmitting || registerMutation.isPending;

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-mesh flex flex-col items-center justify-center px-4 py-12">

      {/* Brand mark */}
      <div className="flex flex-col items-center gap-3 mb-8 animate-fade-in">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
          <Shield size={22} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gradient">Create Account</h1>
        <p className="text-sm text-[#9995b0]">Join the RBAC system</p>
      </div>

      <div className="auth-card">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">

          {/* Server error */}
          {registerMutation.isError && (
            <Alert type="error" message={getErrorMessage(registerMutation.error)} />
          )}

          {/* Name */}
          <FormInput
            label="Full name"
            type="text"
            placeholder="Jane Doe"
            autoComplete="name"
            required
            error={errors.name?.message}
            {...register('name')}
          />

          {/* Email */}
          <FormInput
            label="Email address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            error={errors.email?.message}
            {...register('email')}
          />

          {/* Password */}
          <div className="relative">
            <FormInput
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 8 chars, upper, lower, digit"
              autoComplete="new-password"
              required
              error={errors.password?.message}
              hint="At least 8 characters with uppercase, lowercase, and a number"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-[38px] text-[#9995b0] hover:text-white transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Role Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#c8c4d8]">
              Role <span className="text-indigo-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['USER', 'ADMIN'] as Role[]).map((role) => {
                const isSelected = selectedRole === role;
                const Icon = role === 'ADMIN' ? ShieldCheck : Shield;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setValue('role', role, { shouldValidate: true })}
                    className={clsx(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 cursor-pointer',
                      isSelected
                        ? role === 'ADMIN'
                          ? 'bg-violet-500/15 border-violet-500/50 text-violet-300'
                          : 'bg-sky-500/15 border-sky-500/50 text-sky-300'
                        : 'bg-[#1e1e2e] border-white/[0.07] text-[#9995b0] hover:border-white/20'
                    )}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-semibold">{role}</span>
                    <span className="text-[10px] leading-tight text-center opacity-70">
                      {role === 'USER'
                        ? 'Standard access'
                        : 'Full system access'}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.role && (
              <p className="text-xs text-red-400">⚠ {errors.role.message}</p>
            )}
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
                Creating account…
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Create account
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

        <p className="text-center text-sm text-[#9995b0]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
