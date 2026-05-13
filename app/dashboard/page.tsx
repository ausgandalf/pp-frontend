import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Heart, Caravan, MapPin, ArrowRight, Clock } from 'lucide-react'
import { format } from 'date-fns'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch user's data
  const [{ data: profile }, { data: bookings }, { data: savedParks }, { data: rigProfiles }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('bookings')
      .select('*, park:parks(name, slug, city, state), pitch:pitches(name)')
      .eq('guest_id', user.id)
      .order('check_in_date', { ascending: true })
      .limit(5),
    supabase.from('saved_parks')
      .select('*, park:parks(name, slug, city, state)')
      .eq('user_id', user.id)
      .limit(3),
    supabase.from('rig_profiles')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_default', true)
      .single(),
  ])

  const upcomingBookings = bookings?.filter(b => 
    new Date(b.check_in_date) >= new Date() && b.status !== 'cancelled'
  ) || []

  const pastBookings = bookings?.filter(b => 
    new Date(b.check_out_date) < new Date()
  ) || []

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="font-serif text-3xl font-medium text-foreground">
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your bookings, saved parks, and profile settings
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming stays</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{savedParks?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Saved parks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <Caravan className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rigProfiles ? 1 : 0}</p>
                <p className="text-sm text-muted-foreground">Rig profiles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Stays</CardTitle>
            <CardDescription>Your next camping adventures</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/bookings">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{booking.park?.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {booking.park?.city}, {booking.park?.state}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">
                          {format(new Date(booking.check_in_date), 'MMM d')} - {format(new Date(booking.check_out_date), 'MMM d, yyyy')}
                        </Badge>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'outline'}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/bookings/${booking.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No upcoming stays</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start planning your next adventure
              </p>
              <Button asChild>
                <Link href="/parks">Find a Park</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved Parks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Saved Parks</CardTitle>
            <CardDescription>Parks you&apos;ve bookmarked for later</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/saved">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {savedParks && savedParks.length > 0 ? (
            <div className="grid sm:grid-cols-3 gap-4">
              {savedParks.map((saved) => (
                <Link 
                  key={saved.id} 
                  href={`/parks/${saved.park?.slug}`}
                  className="block p-4 border rounded-lg hover:border-primary transition-colors"
                >
                  <h3 className="font-medium">{saved.park?.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {saved.park?.city}, {saved.park?.state}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No saved parks yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Save parks to easily find them later
              </p>
              <Button asChild>
                <Link href="/parks">Browse Parks</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rig Profile Quick View */}
      {!rigProfiles && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
                  <Caravan className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Add your rig profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Save your caravan or RV details for easier booking
                  </p>
                </div>
              </div>
              <Button asChild>
                <Link href="/dashboard/rig">Add Rig</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
