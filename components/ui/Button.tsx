'use client'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold rounded-[14px] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none',
          {
            'bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white shadow-lg shadow-violet-600/25': variant === 'primary',
            'bg-surface-2 hover:bg-surface-3 text-text-primary border border-white/10': variant === 'secondary',
            'hover:bg-white/5 text-text-secondary hover:text-text-primary': variant === 'ghost',
            'bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30': variant === 'danger',
            'border border-violet-500/50 hover:bg-violet-500/10 text-violet-400': variant === 'outline',
          },
          {
            'px-3 py-1.5 text-xs': size === 'sm',
            'px-4 py-2.5 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
            'w-9 h-9 rounded-xl': size === 'icon',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export default Button
