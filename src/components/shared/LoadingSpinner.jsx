/**
 * Reusable Loading Spinner Component
 */

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @param {Object} props
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] - Spinner size
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.text] - Optional loading text
 */
export function LoadingSpinner({ size = 'md', className, text }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

/**
 * Full page loading overlay
 */
export function LoadingOverlay({ text = 'Loading...' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}
