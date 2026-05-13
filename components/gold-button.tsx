import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type GoldButtonProps = Omit<React.ComponentProps<typeof Button>, 'variant'>

/**
 * Premium gold CTA — dark gold gradient, bright top edge, deep bottom edge,
 * white label with text-shadow for contrast. Implemented as `Button variant="gold"`.
 */
export function GoldButton({ className, ...props }: GoldButtonProps) {
  return <Button variant="gold" className={cn(className)} {...props} />
}
