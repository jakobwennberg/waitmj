'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Mail, Shield } from 'lucide-react'

export default function EmailCollectionPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email && !consent) {
      router.push('/assessment/processing')
      return
    }

    if (email && !consent) {
      toast({
        title: "Consent Required",
        description: "Please check the consent box to proceed with email subscription.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentId: sessionStorage.getItem('assessmentId'),
          email,
          consent
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save email preference')
      }

      router.push('/assessment/processing')
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    router.push('/assessment/processing')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle>Would you like personalized insights?</CardTitle>
          <CardDescription>
            Get tailored recommendations and industry updates delivered to your inbox.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked === true)}
                  disabled={!email}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="consent"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email communications consent
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    I agree to receive personalized insights and updates about AI&apos;s impact on my industry.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                disabled={isSubmitting || (!!email && !consent)}
              >
                {isSubmitting ? "Saving..." : "Continue with Email"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleSkip}
                disabled={isSubmitting}
              >
                Skip for now
              </Button>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-center text-sm text-muted-foreground">
            <Shield className="mr-2 h-4 w-4" />
            <span>Your email is secure and will never be shared.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}