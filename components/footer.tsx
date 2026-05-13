import Link from 'next/link'
import { Trees } from 'lucide-react'

const footerLinks = {
  explore: [
    { href: '/parks', label: 'Find Parks' },
    { href: '/parks?featured=true', label: 'Featured Parks' },
    { href: '/destinations', label: 'Popular Destinations' },
  ],
  forOwners: [
    { href: '/auth/sign-up?type=owner', label: 'List Your Park' },
    { href: '/owner', label: 'Owner Dashboard' },
    { href: '/resources', label: 'Owner Resources' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/careers', label: 'Careers' },
  ],
  legal: [
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/cookies', label: 'Cookie Policy' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Trees className="h-8 w-8 text-primary" />
              <span className="font-serif text-xl font-medium text-foreground">Platinum Pitches</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover and book the best touring parks and caravan grounds across the United Kingdom.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-medium text-foreground mb-4">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h3 className="font-medium text-foreground mb-4">For Owners</h3>
            <ul className="space-y-3">
              {footerLinks.forOwners.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-medium text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-medium text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Platinum Pitches. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with care for the UK camping community
          </p>
        </div>
      </div>
    </footer>
  )
}
