import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MapPin,
  Star,
  Phone,
  Mail,
  Globe,
  Clock,
  Calendar,
  Users,
  Zap,
  Droplets,
  Wifi,
  PawPrint,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Navigation,
  Check,
} from 'lucide-react'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: park } = await supabase
    .from('parks')
    .select('name, short_description, city, state')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!park) {
    return { title: 'Park Not Found' }
  }

  return {
    title: park.name,
    description: park.short_description || `Book your stay at ${park.name} in ${park.city}, ${park.state}`,
  }
}

// Icon mapping for facilities
const facilityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Zap': Zap,
  'Droplets': Droplets,
  'Wifi': Wifi,
  'PawPrint': PawPrint,
}

export default async function ParkDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: park } = await supabase
    .from('parks')
    .select(`
      *,
      images:park_images(*, id, url, alt_text, is_primary, display_order),
      park_facilities(*, facility:facilities(*)),
      pitches(*),
      directions:park_directions(*),
      policies:park_policies(*),
      reviews(*, guest:profiles(full_name, avatar_url))
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!park) {
    notFound()
  }

  const sortedImages = park.images?.sort((a, b) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    return a.display_order - b.display_order
  }) || []

  const primaryImage = sortedImages[0]

  // Group facilities by category
  const facilitiesByCategory = park.park_facilities?.reduce((acc, pf) => {
    const category = pf.facility?.category || 'other'
    if (!acc[category]) acc[category] = []
    acc[category].push(pf.facility)
    return acc
  }, {} as Record<string, typeof park.park_facilities[0]['facility'][]>) || {}

  const minPrice = park.pitches?.length 
    ? Math.min(...park.pitches.map(p => p.base_price_per_night))
    : null

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/parks" className="hover:text-primary">Parks</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/parks?state=${park.state?.toLowerCase()}`} className="hover:text-primary">
              {park.state}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{park.name}</span>
          </nav>
        </div>

        {/* Image Gallery */}
        <section className="container mx-auto px-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 rounded-xl overflow-hidden">
            {/* Primary Image */}
            <div className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.alt_text || park.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <MapPin className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
            {/* Secondary Images */}
            {sortedImages.slice(1, 5).map((image, index) => (
              <div key={image.id} className="relative aspect-[4/3] hidden md:block">
                <Image
                  src={image.url}
                  alt={image.alt_text || `${park.name} ${index + 2}`}
                  fill
                  className="object-cover"
                />
                {index === 3 && sortedImages.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-medium">+{sortedImages.length - 5} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-2">
                      {park.name}
                    </h1>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {park.address && `${park.address}, `}
                      {park.city}, {park.state} {park.postcode}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {park.average_rating > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded-md">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-medium">{park.average_rating.toFixed(1)}</span>
                      </div>
                      <span className="text-muted-foreground">
                        ({park.total_reviews} {park.total_reviews === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                    {park.is_featured && (
                      <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h2 className="text-xl font-medium mb-4">About this park</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {park.description || park.short_description || 'No description available.'}
                </p>
              </div>

              {/* Facilities */}
              {Object.keys(facilitiesByCategory).length > 0 && (
                <div>
                  <h2 className="text-xl font-medium mb-4">Facilities & Amenities</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {Object.entries(facilitiesByCategory).map(([category, facilities]) => (
                      <div key={category}>
                        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-3">
                          {category}
                        </h3>
                        <ul className="space-y-2">
                          {facilities.map((facility) => {
                            const IconComponent = facility?.icon ? facilityIcons[facility.icon] : Check
                            return (
                              <li key={facility?.id} className="flex items-center gap-2 text-foreground">
                                {IconComponent ? (
                                  <IconComponent className="h-4 w-4 text-primary" />
                                ) : (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                                {facility?.name}
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Tabs for additional info */}
              <Tabs defaultValue="pitches" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="pitches">Sites</TabsTrigger>
                  <TabsTrigger value="directions">Directions</TabsTrigger>
                  <TabsTrigger value="policies">Policies</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="pitches" className="mt-6">
                  {park.pitches && park.pitches.length > 0 ? (
                    <div className="grid gap-4">
                      {park.pitches.filter(p => p.is_active).map((pitch) => (
                        <Card key={pitch.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="font-medium">{pitch.name}</h3>
                                {pitch.description && (
                                  <p className="text-sm text-muted-foreground mt-1">{pitch.description}</p>
                                )}
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {pitch.has_power && (
                                    <Badge variant="secondary" className="gap-1">
                                      <Zap className="h-3 w-3" /> Power
                                    </Badge>
                                  )}
                                  {pitch.has_water && (
                                    <Badge variant="secondary" className="gap-1">
                                      <Droplets className="h-3 w-3" /> Water
                                    </Badge>
                                  )}
                                  {pitch.is_pull_through && (
                                    <Badge variant="secondary">Pull-through</Badge>
                                  )}
                                  {pitch.is_shaded && (
                                    <Badge variant="secondary">Shaded</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    Max {pitch.max_guests} guests
                                  </span>
                                  {pitch.max_length_meters && (
                                    <span>Up to {pitch.max_length_meters}m</span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-medium text-foreground">
                                  ${pitch.base_price_per_night}
                                </p>
                                <p className="text-sm text-muted-foreground">per night</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No site information available.</p>
                  )}
                </TabsContent>

                <TabsContent value="directions" className="mt-6">
                  {park.directions && park.directions.length > 0 ? (
                    <div className="space-y-4">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-foreground whitespace-pre-line">{park.directions[0].content}</p>
                      </div>
                      {park.directions[0].gps_coordinates && (
                        <div className="flex items-center gap-2">
                          <Navigation className="h-4 w-4 text-primary" />
                          <span className="text-sm">GPS: {park.directions[0].gps_coordinates}</span>
                        </div>
                      )}
                      {park.directions[0].road_conditions && (
                        <div>
                          <h4 className="font-medium mb-2">Road Conditions</h4>
                          <p className="text-sm text-muted-foreground">{park.directions[0].road_conditions}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No directions available. Contact the park for details.</p>
                  )}
                </TabsContent>

                <TabsContent value="policies" className="mt-6">
                  {park.policies && park.policies.length > 0 ? (
                    <div className="space-y-6">
                      {park.policies[0].cancellation_policy && (
                        <div>
                          <h4 className="font-medium mb-2">Cancellation Policy</h4>
                          <p className="text-sm text-muted-foreground">{park.policies[0].cancellation_policy}</p>
                        </div>
                      )}
                      {park.policies[0].pet_policy && (
                        <div>
                          <h4 className="font-medium mb-2">Pet Policy</h4>
                          <p className="text-sm text-muted-foreground">{park.policies[0].pet_policy}</p>
                        </div>
                      )}
                      {park.policies[0].quiet_hours && (
                        <div>
                          <h4 className="font-medium mb-2">Quiet Hours</h4>
                          <p className="text-sm text-muted-foreground">{park.policies[0].quiet_hours}</p>
                        </div>
                      )}
                      {park.policies[0].other_rules && (
                        <div>
                          <h4 className="font-medium mb-2">Other Rules</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">{park.policies[0].other_rules}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No specific policies listed. Contact the park for details.</p>
                  )}
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  {park.reviews && park.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {park.reviews.filter(r => r.is_published).map((review) => (
                        <div key={review.id} className="border-b border-border pb-6 last:border-0">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              {review.guest?.avatar_url ? (
                                <Image
                                  src={review.guest.avatar_url}
                                  alt={review.guest.full_name || 'Guest'}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              ) : (
                                <span className="text-sm font-medium text-muted-foreground">
                                  {review.guest?.full_name?.[0] || 'G'}
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{review.guest?.full_name || 'Guest'}</span>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? 'fill-accent text-accent'
                                          : 'text-muted'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              {review.title && (
                                <h4 className="font-medium mb-1">{review.title}</h4>
                              )}
                              <p className="text-sm text-muted-foreground">{review.content}</p>
                              {review.owner_response && (
                                <div className="mt-4 pl-4 border-l-2 border-primary/20">
                                  <p className="text-sm font-medium text-primary">Owner response:</p>
                                  <p className="text-sm text-muted-foreground">{review.owner_response}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No reviews yet. Be the first to review this park!</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-baseline gap-2">
                    {minPrice ? (
                      <>
                        <span className="text-3xl">${minPrice}</span>
                        <span className="text-muted-foreground font-normal text-base">/ night</span>
                      </>
                    ) : (
                      <span className="text-lg">Contact for pricing</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border rounded-lg p-3">
                      <label className="text-xs text-muted-foreground">CHECK-IN</label>
                      <p className="font-medium">{park.check_in_time}</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <label className="text-xs text-muted-foreground">CHECK-OUT</label>
                      <p className="font-medium">{park.check_out_time}</p>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/parks/${slug}/book`}>
                      Check Availability
                    </Link>
                  </Button>

                  <Separator />

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Contact</h4>
                    {park.phone && (
                      <a href={`tel:${park.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                        <Phone className="h-4 w-4" />
                        {park.phone}
                      </a>
                    )}
                    {park.email && (
                      <a href={`mailto:${park.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                        <Mail className="h-4 w-4" />
                        {park.email}
                      </a>
                    )}
                    {park.website && (
                      <a href={park.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                        <Globe className="h-4 w-4" />
                        Visit website
                      </a>
                    )}
                  </div>

                  <Separator />

                  {/* Stay Requirements */}
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Min stay: {park.min_stay_nights} {park.min_stay_nights === 1 ? 'night' : 'nights'}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Max stay: {park.max_stay_nights} nights
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
