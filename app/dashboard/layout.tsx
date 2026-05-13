import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Trees, LayoutDashboard, Calendar, Heart, Caravan, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

const sidebarLinks = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/bookings', label: 'My Bookings', icon: Calendar },
  { href: '/dashboard/saved', label: 'Saved Parks', icon: Heart },
  { href: '/dashboard/rig', label: 'My Rig', icon: Caravan },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  
  if (!user) {
    redirect('/auth/login?redirect=/dashboard')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Trees className="h-8 w-8 text-primary" />
            <span className="font-serif text-xl font-medium text-foreground">Platinum Pitches</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {profile?.full_name || user.email}
            </span>
            {profile?.user_type === 'owner' && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/owner">Owner Dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-muted/30 min-h-[calc(100vh-4rem)]">
          <nav className="flex-1 p-4 space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-border">
            <form action="/api/auth/signout" method="POST">
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" type="submit">
                <LogOut className="h-5 w-5" />
                Sign out
              </Button>
            </form>
          </div>
        </aside>

        {/* Mobile Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
          <nav className="flex justify-around py-2">
            {sidebarLinks.slice(0, 5).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-1 px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <link.icon className="h-5 w-5" />
                <span className="text-xs">{link.label.split(' ')[0]}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  )
}
