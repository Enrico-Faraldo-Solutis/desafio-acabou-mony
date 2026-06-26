import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-secondary">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors
            ${error ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'}
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'
