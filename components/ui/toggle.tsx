import * as React from 'react'
import { cn } from '@/lib/utils'

const Toggle = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    type="button"
    className={cn('inline-flex items-center justify-center rounded-md border border-transparent bg-muted px-3 py-1 text-sm font-medium transition-colors hover:bg-muted/80', className)}
    ref={ref}
    {...props}
  />
))
Toggle.displayName = 'Toggle'

export { Toggle }
