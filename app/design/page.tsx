import * as React from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

import { DesignUiShowcase } from '@/components/design-ui-showcase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const BRAND_SWATCHES = [
  { name: 'Navy', hex: '#1a213f', token: '--primary' },
  { name: 'Gold', hex: '#c6aa76', token: '--accent' },
  { name: 'Cream', hex: '#f5f2eb', token: '--background' },
  { name: 'Light Grey', hex: '#e6e8ec', token: '--muted / --border' },
  { name: 'Charcoal', hex: '#2b2f38', token: '--foreground / --charcoal' },
  { name: 'Members brown', hex: '#4a3428', token: '--dark-brown' },
  { name: 'Sage Green', hex: '#6c8c6e', token: '--chart-3' },
  { name: 'Linen', hex: '#efe9dd', token: '--card / --secondary' },
] as const

export const metadata = {
  title: 'Design system',
}

export default function DesignPage() {
  return (
    <div
      className="min-h-screen bg-background text-foreground"
    >
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10 md:py-14">
        <header className="space-y-3 border-b border-border pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="size-6" aria-hidden />
              <span className="font-serif text-2xl font-medium md:text-3xl">Design system</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Back to site</Link>
            </Button>
          </div>
          <p className="max-w-2xl text-muted-foreground">
            Brand color patterns and live previews of the UI primitives used across Platinum Pitches. Tokens below
            mirror how we map swatches to shadcn variables.
          </p>
        </header>

        <section className="space-y-4">
          <div>
            <h2 className="font-serif text-xl font-medium md:text-2xl">Color patterns</h2>
            <p className="mt-1 text-sm text-muted-foreground">Hex values and suggested semantic roles.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BRAND_SWATCHES.map((c) => (
              <Card key={c.name} className="overflow-hidden py-0">
                <div className="h-20 border-b border-border" style={{ backgroundColor: c.hex }} />
                <CardContent className="space-y-1 p-4">
                  <p className="font-medium">{c.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{c.hex}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-mono text-foreground">{c.token}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        <section className="space-y-8">
          <div>
            <h2 className="font-serif text-xl font-medium md:text-2xl">Component showcase</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Every module under <code className="rounded bg-muted px-1 font-mono text-xs">components/ui</code> (56
              files). Sticky jump links scroll to each demo; file names are shown on every card.
            </p>
          </div>

          <DesignUiShowcase />
        </section>
      </div>
    </div>
  )
}
