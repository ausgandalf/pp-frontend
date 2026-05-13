import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, MapPin, Clock } from 'lucide-react'
import { format } from 'date-fns'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  checked_in: 'bg-blue-100 text-blue-800',
  checked_out: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  no_show: 'bg-red-100 text-red-800',
}

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, park:parks(name, slug, city, state), pitch:pitches(name)')
    .eq('guest_id', user.id)
    .order('check_in_date', { ascending: false })

  const now = new Date()
  const upcoming = bookings?.filter(b => 
    new Date(b.check_in_date) >= now && b.status !== 'cancelled'
  ) || []
  const past = bookings?.filter(b => 
    new Date(b.check_out_date) < now || b.status === 'checked_out'
  ) || []
  const cancelled = bookings?.filter(b => b.status === 'cancelled') || []

  function BookingCard({ booking }: { booking: typeof bookings extends (infer T)[] | null ? T : never }) {
    if (!booking) return null
    
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-lg">{booking.park?.name}</h3>
                  <Badge className={statusColors[booking.status] || ''}>
                    {booking.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {booking.park?.city}, {booking.park?.state}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(booking.check_in_date), 'MMM d')} - {format(new Date(booking.check_out_date), 'MMM d, yyyy')}
                  </span>
                  <span className="text-muted-foreground">
                    {booking.total_nights} {booking.total_nights === 1 ? 'night' : 'nights'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Site: {booking.pitch?.name} | Ref: {booking.booking_reference}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <p className="text-xl font-bold">${booking.total_price}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/parks/${booking.park?.slug}`}>View Park</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/dashboard/bookings/${booking.id}`}>Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-medium text-foreground">My Bookings</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all your park reservations
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({past.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcoming.length > 0 ? (
            <div className="space-y-4">
              {upcoming.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No upcoming bookings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ready for your next adventure?
                </p>
                <Button asChild>
                  <Link href="/parks">Find a Park</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {past.length > 0 ? (
            <div className="space-y-4">
              {past.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No past bookings</h3>
                <p className="text-sm text-muted-foreground">
                  Your completed stays will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          {cancelled.length > 0 ? (
            <div className="space-y-4">
              {cancelled.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">No cancelled bookings</h3>
                <p className="text-sm text-muted-foreground">
                  Good news! You haven&apos;t cancelled any bookings
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
