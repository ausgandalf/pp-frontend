import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ParkCard } from '@/components/park-card'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

export default async function SavedParksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: savedParks } = await supabase
    .from('saved_parks')
    .select(`
      id,
      created_at,
      park:parks(
        *,
        images:park_images(*),
        park_facilities(*, facility:facilities(*))
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-medium text-foreground">Saved Parks</h1>
        <p className="text-muted-foreground mt-1">
          Parks you&apos;ve bookmarked for future visits
        </p>
      </div>

      {savedParks && savedParks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {savedParks.map((saved) => (
            saved.park && <ParkCard key={saved.id} park={saved.park} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No saved parks yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              When you find parks you love, click the heart icon to save them here for easy access later.
            </p>
            <Button asChild>
              <Link href="/parks">Explore Parks</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
