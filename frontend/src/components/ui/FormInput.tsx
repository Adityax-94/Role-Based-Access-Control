import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

/**
 * Styled form input with label, error message, and optional hint.
 * Forwards ref so it works with React Hook Form's `register`.
 */
export const FormInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#c8c4d8]">
          {label}
          {props.required && <span className="text-indigo-400 ml-0.5">*</span>}
        </label>

        <input
          ref={ref}
          className={clsx(
            'input-base',
            error && 'input-error',
            className
          )}
          {...props}
        />

        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1 animate-fade-in">
            <span>⚠</span> {error}
          </p>
        )}

        {hint && !error && (
          <p className="text-xs text-[#9995b0]">{hint}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
