import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Thank You!</CardTitle>
          <CardDescription className="text-center">
            Your action has been successfully completed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            We appreciate your interest in staying informed about AI's impact on the job market. You'll receive our latest insights and updates directly in your inbox.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            If you don't see an email from us within the next few minutes, please check your spam folder.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

