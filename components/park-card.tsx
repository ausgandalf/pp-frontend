import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GoldButton } from '@/components/gold-button'
import { Star, MapPin } from 'lucide-react'
import type { Park, ParkImage } from '@/lib/types'
import { getParkFacilityDisplayItems } from '@/components/park-facility-icons'

interface ParkCardProps {
  park: Park & {
    images?: ParkImage[]
    facilities?: { type: string; value: string }[]
    amenities?: Record<string, boolean>
    region?: string | null
  }
  variant?: 'default' | 'compact'
}

export function ParkCard({ park, variant = 'default' }: ParkCardProps) {
  const primaryImage = park.images?.find((img) => img.is_primary) || park.images?.[0]
  const facilityItems = getParkFacilityDisplayItems(park)
  const parkHref = `/parks/${park.slug}`
  const regionLabel = park.region ?? park.state

  if (variant === 'compact') {
    return (
      <Link href={parkHref}>
        <Card className="group overflow-hidden rounded-xl border border-accent/30 py-0 transition-shadow hover:shadow-lg">
          <div className="flex">
            <div className="relative h-24 w-32 shrink-0">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt_text || park.name}
                  fill
                  className="rounded-none object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <MapPin className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            <CardContent className="flex flex-1 flex-col justify-center p-3">
              <h3 className="text-sm font-medium break-words transition-colors group-hover:text-primary">
                {park.name}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {park.city}, {regionLabel}
              </p>
              {park.average_rating > 0 && (
                <div className="mt-2 flex items-center gap-1">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  <span className="text-xs font-medium">{park.average_rating.toFixed(1)}</span>
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </Link>
    )
  }

  const showReviewStrip = park.average_rating > 0 || park.total_reviews > 0

  return (
    <Card className="flex gap-0 h-full flex-col overflow-hidden rounded-xl border border-accent/30 py-0 shadow-sm transition-shadow hover:shadow-lg">
      <Link
        href={parkHref}
        className="group flex min-h-0 flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-video w-full shrink-0 overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt_text || park.name}
              fill
              className="rounded-none object-cover"
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col gap-0 p-4 pt-4">
          <div>
            <div className="badge-wrapper mb-2 flex justify-between min-h-[1.25rem]">
              {park.is_featured && (
                <Badge className="w-fit bg-accent text-accent-foreground">Featured</Badge>
              )}
            </div>
            <h3 className="text-xl font-semibold break-words text-balance transition-colors group-hover:text-primary">
              {park.name}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-dark-brown">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {park.city}, {regionLabel}
            </p>
          </div>

          {park.short_description && (
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{park.short_description}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {facilityItems.map(({ key, Icon, label }) => (
              <div
                key={key}
                className="inline-flex items-center justify-center rounded-full bg-primary/[0.06] p-1.5 text-brand-green ring-1 ring-primary/10 shadow-sm"
                title={label}
              >
                <Icon className="h-4 w-4" strokeWidth={2.25} aria-hidden />
                <span className="sr-only">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Link>

      {showReviewStrip && (
        <div className="flex justify-between px-4 py-2.5 text-sm text-muted-foreground">
          
          <div className="flex gap-2">
            {park.average_rating > 0 && (
              <>
                <Star className="h-4 w-4 shrink-0 fill-accent text-accent" />
                <span className="font-medium tabular-nums text-foreground">{park.average_rating.toFixed(1)}</span>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {park.total_reviews > 0 && (
                <span>{park.total_reviews} {park.total_reviews === 1 ? 'review' : 'reviews'}</span>
              )}
          </div>
        </div>
      )}

      <div className="mt-auto px-4 pb-4 pt-2">
        <GoldButton asChild size="lg" className="w-full">
          <Link href={parkHref}>View Park</Link>
        </GoldButton>
      </div>
    </Card>
  )
}
