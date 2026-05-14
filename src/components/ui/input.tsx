'use client';

import * as React from "react"

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-12 w-full rounded-xl border border-slate-600 bg-slate-800/50 px-4 py-3 text-base text-slate-200 placeholder:text-slate-500 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 ${className || ''}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
