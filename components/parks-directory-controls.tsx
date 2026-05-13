'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { RadioButtonSet } from '@/components/ui/radio-button-set'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  buildParksQueryString,
  facilitiesParamWithout,
  mergeParksQuery,
  parseFacilitiesParam,
  parseRegionParam,
  regionParamWithout,
  searchParamsToParksQuery,
  type ParksQueryParams,
} from '@/lib/parks-query'
import { getFacilityFilterLabel } from '@/lib/park-facilities-filter'
import { regionSlugToCanonical } from '@/lib/park-regions'
import { RegionFilterCheckboxStrip } from '@/components/region-filter-checkbox-strip'
import { FacilityFilterCheckboxStrip } from '@/components/facility-filter-checkbox-strip'
import { GoldButton } from '@/components/gold-button'
import {
  filterToggleButtonClassName,
  filterToggleLabelClassName,
} from '@/lib/filter-toggle-styles'

function regionChipLabel(slug: string): string {
  return regionSlugToCanonical(slug) ?? slug
}

const MIN_RATING_REVIEW_OPTIONS = [
  { value: 'any', label: 'Any' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
  { value: '4.5', label: '4.5+' },
] as const

export function ParksDirectoryControls() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const qp = useMemo(() => searchParamsToParksQuery(searchParams), [searchParams])

  const [sheetOpen, setSheetOpen] = useState(false)
  const [draftRegions, setDraftRegions] = useState<Set<string>>(() => new Set())
  const [draftMinRating, setDraftMinRating] = useState('any')
  const [draftFeatured, setDraftFeatured] = useState(false)
  const [draftFacilities, setDraftFacilities] = useState<Set<string>>(() => new Set())

  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    setSearchInput(qp.location ?? '')
  }, [qp.location])

  const syncDraftFromUrl = useCallback(() => {
    setDraftRegions(new Set(parseRegionParam(qp.region)))
    setDraftMinRating(qp.minRating && qp.minRating !== 'any' ? qp.minRating : 'any')
    setDraftFeatured(qp.featured === 'true')
    setDraftFacilities(new Set(parseFacilitiesParam(qp.facilities)))
  }, [qp.region, qp.minRating, qp.featured, qp.facilities])

  useEffect(() => {
    if (sheetOpen) syncDraftFromUrl()
  }, [sheetOpen, syncDraftFromUrl])

  const navigate = useCallback(
    (updates: Partial<Record<keyof ParksQueryParams, string | undefined>>, resetPage = true) => {
      const current = searchParamsToParksQuery(searchParams)
      const merged = mergeParksQuery(current, updates)
      const page = resetPage ? 1 : Math.max(1, parseInt(current.page || '1', 10) || 1)
      const qs = buildParksQueryString(merged, page)
      router.push(`${pathname}?${qs}`)
    },
    [pathname, router, searchParams],
  )

  const applyDrawerFilters = () => {
    navigate(
      {
        region:
          draftRegions.size > 0 ? Array.from(draftRegions).sort().join(',') : undefined,
        minRating: draftMinRating === 'any' ? undefined : draftMinRating,
        featured: draftFeatured ? 'true' : undefined,
        facilities:
          draftFacilities.size > 0 ? Array.from(draftFacilities).sort().join(',') : undefined,
      },
      true,
    )
    setSheetOpen(false)
  }

  const clearAllFilters = () => {
    navigate(
      {
        region: undefined,
        facilities: undefined,
        minRating: undefined,
        featured: undefined,
        location: undefined,
      },
      true,
    )
    setSearchInput('')
    setSheetOpen(false)
  }

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    const q = searchInput.trim()
    navigate({ location: q || undefined }, true)
  }

  const sortValue = qp.sort && qp.sort !== 'featured' ? qp.sort : 'featured'

  const chips = useMemo(() => {
    const out: { id: string; label: string; onRemove: () => void }[] = []

    if (qp.location?.trim()) {
      out.push({
        id: 'location',
        label: `Search: “${qp.location.trim()}”`,
        onRemove: () => navigate({ location: undefined }),
      })
    }
    for (const slug of parseRegionParam(qp.region)) {
      out.push({
        id: `region-${slug}`,
        label: regionChipLabel(slug),
        onRemove: () => navigate({ region: regionParamWithout(qp.region, slug) }),
      })
    }
    if (qp.minRating && qp.minRating !== 'any') {
      out.push({
        id: 'minRating',
        label: `${qp.minRating}+ stars`,
        onRemove: () => navigate({ minRating: undefined }),
      })
    }
    if (qp.featured === 'true') {
      out.push({
        id: 'featured',
        label: 'Featured only',
        onRemove: () => navigate({ featured: undefined }),
      })
    }
    for (const type of parseFacilitiesParam(qp.facilities)) {
      out.push({
        id: `facility-${type}`,
        label: getFacilityFilterLabel(type),
        onRemove: () => {
          const next = facilitiesParamWithout(qp.facilities, type)
          navigate({ facilities: next })
        },
      })
    }
    return out
  }, [qp.location, qp.region, qp.minRating, qp.featured, qp.facilities, navigate])

  return (
    <div className="mb-6 space-y-3 rounded-md border p-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer shrink-0 sm:w-auto"
            onClick={() => setSheetOpen(true)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <SheetContent
            side="left"
            className="flex h-full w-[75vw] max-w-[550px] flex-col overflow-y-auto sm:max-w-[550px]"
          >
            <SheetHeader className="text-left">
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Choose regions and options, then Apply. Use Clear filters to reset everything.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-2 flex flex-1 flex-col gap-6 px-4 pb-4">
              <fieldset className="space-y-2">
                <legend className="mb-1 text-sm font-medium leading-none">Region</legend>
                <RegionFilterCheckboxStrip
                  id="parks-filter-region"
                  selected={draftRegions}
                  onSelectionChange={setDraftRegions}
                />
              </fieldset>

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium leading-none">Minimum rating</legend>
                <RadioButtonSet
                  value={draftMinRating}
                  onValueChange={setDraftMinRating}
                  options={[...MIN_RATING_REVIEW_OPTIONS]}
                  aria-label="Minimum rating"
                />
              </fieldset>

              <div className="leading-[0]">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={draftFeatured}
                  onClick={() => setDraftFeatured((f) => !f)}
                  className={filterToggleButtonClassName(draftFeatured)}
                >
                  <span className={filterToggleLabelClassName}>Featured parks only</span>
                </button>
              </div>

              <fieldset className="space-y-2">
                <legend className="mb-1 text-sm font-medium leading-none">Facilities</legend>
                <FacilityFilterCheckboxStrip
                  id="parks-filter-facilities"
                  selected={draftFacilities}
                  onSelectionChange={setDraftFacilities}
                />
              </fieldset>
            </div>
            <div className="mt-auto flex flex-col gap-2 border-t border-border p-4 sm:flex-row sm:justify-end sm:gap-3">
              <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={clearAllFilters}>
                Clear filters
              </Button>
              <GoldButton type="button" className="w-full sm:min-w-[160px] sm:flex-1" onClick={applyDrawerFilters}>
                Apply
              </GoldButton>
            </div>
          </SheetContent>
        </Sheet>

        <form
          onSubmit={submitSearch}
          className="relative min-w-0 flex-1"
          role="search"
        >
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search parks, towns…"
            className="h-10 pl-9 pr-20"
            aria-label="Search parks"
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 px-3"
          >
            Search
          </Button>
        </form>

        <div className="flex shrink-0 items-center gap-2 sm:w-[200px]">
          <span className="whitespace-nowrap text-sm text-muted-foreground sm:hidden">Sort</span>
          <Select
            value={sortValue}
            onValueChange={(v) =>
              navigate({ sort: v === 'featured' ? undefined : v }, true)
            }
          >
            <SelectTrigger className="cursor-pointer h-10 w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="rating">Highest rated</SelectItem>
              <SelectItem value="reviews">Most reviews</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {chips.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <Badge
              key={c.id}
              variant="accent"
              className="gap-1 pr-1 font-normal"
            >
              <span>{c.label}</span>
              <button
                type="button"
                className="cursor-pointer rounded-sm p-0.5 text-muted-foreground hover:bg-background/80 hover:text-foreground"
                onClick={c.onRemove}
                aria-label={`Remove ${c.label}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  )
}
