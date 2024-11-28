'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { Mail, Shield } from 'lucide-react'

export default function NewsletterSignup() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !consent) {
      toast({
        title: "Error",
        description: "Please provide your email and consent to subscribe.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/submit-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          consent
        })
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe')
      }
  
      if (data.success) {
        toast({
          title: "Success!",
          description: "You've been subscribed to our newsletter.",
        })
        router.push('/thank-you')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Stay Informed with Our Newsletter</CardTitle>
          <CardDescription className="text-center">
            Get the latest insights on AI's impact on jobs and career development strategies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked as boolean)}
                required
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="consent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to receive email communications
                </Label>
                <p className="text-sm text-muted-foreground">
                  You can unsubscribe at any time. Read our Privacy Policy.
                </p>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Subscribing..." : "Subscribe to Newsletter"}
            </Button>
          </form>
          <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
            <Shield className="mr-2 h-4 w-4" />
            <span>Your information is secure and will never be shared.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

