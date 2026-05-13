import { Suspense } from 'react'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ParkCard } from '@/components/park-card'
import { getParks } from '@/lib/api/parks'
import { GoldButton } from '@/components/gold-button'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MapPin } from 'lucide-react'
import Link from 'next/link'
import { ParksDirectoryControls } from '@/components/parks-directory-controls'
import { buildParksQueryString, type ParksQueryParams } from '@/lib/parks-query'
import { getPageList } from '@/lib/pagination-range'

async function ParksGrid({ searchParams }: { searchParams: ParksQueryParams }) {
  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1)
  const pageSize = 12

  const { parks, meta } = await getParks({
    page,
    pageSize,
    location: searchParams.location,
    region: searchParams.region,
    featured: searchParams.featured,
    minRating: searchParams.minRating,
    facilities: searchParams.facilities,
    sort: searchParams.sort,
  })

  const { total, total_pages: totalPages, page: currentPage } = meta
  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to = Math.min(currentPage * pageSize, total)

  if (!parks || parks.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <MapPin className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-medium text-foreground">No parks found</h3>
        <p className="mb-6 text-muted-foreground">
          Try adjusting your search filters or explore all parks
        </p>
        <Button asChild>
          <Link href="/parks">View all parks</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 text-sm text-muted-foreground">
        <p>
          Showing {from}–{to} of {total} parks
        </p>
        <p className="text-xs">
          Page {currentPage} of {totalPages}
          {meta.page_size ? ` · ${meta.page_size} per page` : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {parks.map((park) => (
          <ParkCard key={park.id} park={park} />
        ))}
      </div>

      {totalPages > 1 ? (
        <nav
          className="mt-10 flex flex-col items-center gap-3"
          aria-label="Pagination"
        >
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {currentPage > 1 ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/parks?${buildParksQueryString(searchParams, 1)}`}>First</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                First
              </Button>
            )}
            {currentPage > 1 ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/parks?${buildParksQueryString(searchParams, currentPage - 1)}`}>
                  Previous
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
            )}

            {getPageList(currentPage, totalPages).map((item, idx) =>
              item === 'ellipsis' ? (
                <span
                  key={`e-${idx}`}
                  className="flex min-w-9 items-center justify-center px-1 text-muted-foreground"
                  aria-hidden
                >
                  …
                </span>
              ) : (
                <Button
                  key={item}
                  variant={item === currentPage ? 'default' : 'outline'}
                  size="sm"
                  className="min-w-9 px-0"
                  asChild={item !== currentPage}
                  disabled={item === currentPage}
                  aria-current={item === currentPage ? 'page' : undefined}
                >
                  {item === currentPage ? (
                    <span className="tabular-nums">{item}</span>
                  ) : (
                    <Link href={`/parks?${buildParksQueryString(searchParams, item)}`}>
                      <span className="tabular-nums">{item}</span>
                    </Link>
                  )}
                </Button>
              ),
            )}

            {currentPage < totalPages ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/parks?${buildParksQueryString(searchParams, currentPage + 1)}`}>
                  Next
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            )}
            {currentPage < totalPages ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/parks?${buildParksQueryString(searchParams, totalPages)}`}>
                  Last
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Last
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
        </nav>
      ) : null}
    </div>
  )
}

function ParksToolbarFallback() {
  return (
    <div
      className="mb-6 flex h-[52px] animate-pulse flex-col gap-3 rounded-lg bg-muted/60 sm:h-10 sm:flex-row"
      aria-hidden
    />
  )
}

export default async function ParksPage({
  searchParams,
}: {
  searchParams: Promise<ParksQueryParams>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <section className="relative flex min-h-[min(70vh,560px)] overflow-hidden border-b border-border">
        <Image
          src="/images/site/parks-hero.jpg"
          alt="Platinum Pitches estate parks"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] dark:bg-dark-accent/50"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-3xl px-4 py-16 text-center md:py-20">
          <div className="">
            <h1 className="font-serif text-4xl font-medium tracking-tight text-primary drop-shadow-sm md:text-5xl lg:text-6xl">
              Platinum Pitches
            </h1>
            <p className="mt-4 text-lg leading-snug md:text-xl lg:text-2xl">
              <span className="font-medium text-dark-brown">The Finest Members-Only </span>
              <span className="font-medium text-charcoal">Estate Parks</span>
            </p>
            <GoldButton asChild size="lg" className="mt-8 px-8 text-base">
              <Link href="#parks-directory">Discover Location</Link>
            </GoldButton>
          </div>
        </div>
      </section>

      <main id="parks-directory" className="flex-1 scroll-mt-20 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="font-serif text-2xl font-medium text-foreground md:text-3xl">
              {params.featured === 'true' ? 'Featured Parks' : 'All Parks'}
            </h1>
          </div>

          <Suspense fallback={<ParksToolbarFallback />}>
            <ParksDirectoryControls />
          </Suspense>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="aspect-[4/3] animate-pulse bg-muted" />
                ))}
              </div>
            }
          >
            <ParksGrid searchParams={params} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  )
}
