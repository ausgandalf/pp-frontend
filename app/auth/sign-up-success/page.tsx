import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, ArrowRight } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <Card className="border-border/50 shadow-lg text-center">
      <CardHeader className="space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-serif">Check your email</CardTitle>
        <CardDescription className="text-base">
          We&apos;ve sent you a confirmation link to verify your email address.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          <p>
            Click the link in your email to activate your account. 
            If you don&apos;t see it, check your spam folder.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button asChild variant="outline" className="w-full">
          <Link href="/auth/login">
            Back to sign in
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
