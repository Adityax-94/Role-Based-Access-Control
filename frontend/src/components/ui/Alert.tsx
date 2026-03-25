import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';

interface AlertProps {
  type: 'error' | 'success' | 'warning';
  message: string;
  className?: string;
}

const config = {
  error: {
    icon: XCircle,
    classes: 'bg-red-500/10 border-red-500/25 text-red-300',
  },
  success: {
    icon: CheckCircle,
    classes: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300',
  },
  warning: {
    icon: AlertCircle,
    classes: 'bg-amber-500/10 border-amber-500/25 text-amber-300',
  },
};

/**
 * Inline alert banner for displaying API errors or success messages.
 */
export function Alert({ type, message, className }: AlertProps) {
  const { icon: Icon, classes } = config[type];

  return (
    <div
      className={clsx(
        'flex items-start gap-2.5 px-4 py-3 rounded-xl border text-sm animate-fade-in',
        classes,
        className
      )}
      role="alert"
    >
      <Icon size={16} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
