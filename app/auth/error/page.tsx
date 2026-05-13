import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <Card className="border-border/50 shadow-lg text-center">
      <CardHeader className="space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <CardTitle className="text-2xl font-serif">Something went wrong</CardTitle>
        <CardDescription className="text-base">
          There was an error processing your request. Please try again.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          If this problem persists, please contact support.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button asChild className="w-full">
          <Link href="/auth/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <Link href="/">Go to homepage</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
