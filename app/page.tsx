import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SearchForm } from '@/components/search-form'
import { ParkCard } from '@/components/park-card'
import { FeaturedParksCarousel } from '@/components/featured-parks-carousel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getFeaturedParks, getPopularDestinationSummaries, getBundledParkTotal } from '@/lib/api/parks'
import type { LucideIcon } from 'lucide-react'
import { 
  Trees, 
  MapPin, 
  Shield, 
  Star, 
  Tent,
  Caravan,
  Mountain,
  Waves,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'

const DESTINATION_ICONS: Record<string, LucideIcon> = {
  'south-west': Waves,
  'south-east': Trees,
  'yorkshire': Mountain,
  'scotland': Tent,
}

const features = [
  {
    icon: MapPin,
    title: 'Discover Amazing Locations',
    description: 'Find the perfect park from hundreds of locations across the United Kingdom, from coastal escapes to countryside retreats.',
  },
  {
    icon: Shield,
    title: 'Book with Confidence',
    description: 'Verified parks, real reviews, and secure booking. Know exactly what to expect before you arrive.',
  },
  {
    icon: Star,
    title: 'Quality Guaranteed',
    description: 'Every listed park meets our quality standards for facilities, cleanliness, and guest experience.',
  },
]

function SearchFormHeroFallback() {
  return (
    <div className="rounded-xl bg-card p-2 shadow-lg" aria-hidden>
      <div className="grid min-h-[3.5rem] grid-cols-1 gap-2 md:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-muted/80" />
        ))}
      </div>
    </div>
  )
}

const testimonials = [
  {
    quote: "Platinum Pitches made finding the perfect spot for our family holiday so easy. The reviews were spot-on!",
    author: "Sarah M.",
    location: 'Cornwall, England',
    rating: 5,
  },
  {
    quote: "As a park owner, this platform has transformed how we manage bookings. Highly recommend!",
    author: "David R.",
    location: 'Park Owner, Wales',
    rating: 5,
  },
  {
    quote: "We've used Platinum Pitches for three trips now. The booking process is seamless every time.",
    author: "Michelle & Tom",
    location: 'Edinburgh, Scotland',
    rating: 5,
  },
]

export default async function HomePage() {
  const featuredParks = await getFeaturedParks({ limit: 6 })
  const destinations = getPopularDestinationSummaries()
  const bundledParkTotal = getBundledParkTotal()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src="/images/site/hero.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/92 via-background/58 to-background dark:from-background/95 dark:via-background/82 dark:to-background" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-6 text-balance">
              Find Your Perfect
              <span className="text-primary"> Camping Escape</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">
              Discover and book amazing touring parks, caravan parks, and camping grounds across the United Kingdom. 
              Your next adventure starts here.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Suspense fallback={<SearchFormHeroFallback />}>
              <SearchForm variant="hero" />
            </Suspense>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>{bundledParkTotal} parks listed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Verified Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Secure Booking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Parks */}
      {featuredParks && featuredParks.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-2">
                  Featured Parks
                </h2>
                <p className="text-muted-foreground">
                  Hand-picked destinations for your next adventure
                </p>
              </div>
              <Button variant="outline" asChild className="shrink-0 self-start sm:self-auto">
                <Link href="/parks?featured=true">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <FeaturedParksCarousel>
              {featuredParks.map((park) => (
                <ParkCard key={park.id} park={park} />
              ))}
            </FeaturedParksCarousel>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
              Why Choose Platinum Pitches?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We make finding and booking your perfect camping spot simple, secure, and stress-free.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/50 bg-card/50">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-lg text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
              Popular Destinations
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore parks across the United Kingdom&apos;s most loved camping regions
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest) => {
              const Icon = DESTINATION_ICONS[dest.slug] ?? MapPin
              return (
              <Link 
                key={dest.slug} 
                href={`/parks?region=${dest.slug}`}
                className="group"
              >
                <Card className="border-border/50 overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-lg text-foreground group-hover:text-primary transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {dest.count === 1 ? '1 park' : `${dest.count} parks`}
                    </p>
                  </CardContent>
                </Card>
              </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
              What Our Community Says
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of happy campers and park owners
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <blockquote className="text-foreground mb-4">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                  <div className="text-sm">
                    <p className="font-medium text-foreground">{testimonial.author}</p>
                    <p className="text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <Caravan className="h-12 w-12 mx-auto mb-6 opacity-90" />
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Join Platinum Pitches today and discover the best camping experiences the United Kingdom has to offer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/parks">
                  Find a Park
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
                <Link href="/auth/sign-up">
                  Create Account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Park Owner CTA */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-muted/50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:max-w-xl">
              <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-4">
                Own a Park or Campground?
              </h2>
              <p className="text-muted-foreground">
                List your property on Platinum Pitches and reach thousands of campers looking for their next destination. 
                Easy management tools, real-time bookings, and dedicated support.
              </p>
            </div>
            <Button size="lg" asChild>
              <Link href="/auth/sign-up?type=owner">
                List Your Park
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
