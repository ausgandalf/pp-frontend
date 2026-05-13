import { cn } from '@/lib/utils'

/** Shared “pill” toggle used by region + facilities filter strips (keep in sync visually). */
export function filterToggleButtonClassName(checked: boolean): string {
  return cn(
    'mb-2 mr-2 inline-block max-w-full cursor-pointer align-top rounded-md border px-2 py-1.5 text-sm shadow-sm transition-[color,box-shadow,background-color,border-color] duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    checked
      ? 'border-background/50 bg-accent/80 text-primary ring-1 ring-primary/25 shadow-md'
      : 'border-border bg-background text-foreground hover:border-primary/20 hover:bg-muted/35',
  )
}

export const filterToggleLabelClassName =
  'block max-w-[min(100%,15rem)] text-left font-medium'
