import Link from 'next/link'
import { Trees } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <Trees className="h-8 w-8 text-primary" />
          <span className="font-serif text-2xl font-medium text-foreground">Platinum Pitches</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
      <footer className="p-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Platinum Pitches. All rights reserved.</p>
      </footer>
    </div>
  )
}
