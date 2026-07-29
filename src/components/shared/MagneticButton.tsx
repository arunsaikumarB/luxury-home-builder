import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  /** Kept for API compatibility — magnetic pull is disabled. */
  strength?: number
  as?: 'button' | 'a' | 'div'
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  'aria-label'?: string
}

/** Static CTA wrapper (no cursor-follow / magnetic motion). */
export function MagneticButton({
  children,
  className,
  as = 'button',
  href,
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
}: MagneticButtonProps) {
  const shared = {
    className: cn('relative inline-flex cursor-pointer', className),
    onClick,
    'aria-label': ariaLabel,
  }

  if (as === 'a' && href) {
    return (
      <a href={href} {...shared}>
        {children}
      </a>
    )
  }

  if (as === 'div') {
    return <div {...shared}>{children}</div>
  }

  return (
    <button type={type} {...shared}>
      {children}
    </button>
  )
}
