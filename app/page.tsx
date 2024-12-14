// app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import TestimonialsSection from '@/components/TestimonialsSection'
import { Header } from '@/components/header'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex-grow flex flex-col items-center justify-center max-w-4xl mx-auto w-full mt-8 md:mt-40">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6">
            Is Your Job Safe from AI Automation?
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Discover the impact of AI on your career with our cutting-edge assessment tool.
            Get personalized insights and recommendations to future-proof your job.
          </p>
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href="/assessment">Start Your Free Assessment Now</Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Your privacy is our priority. All data is securely processed and never shared.
          </p>
        </div>

        <div className="mt-40 w-full">
          <TestimonialsSection />
        </div>
      </main>

      <footer className="py-6 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
        <p>&copy; 2024 WAITMJ. All rights reserved.</p>
      </footer>
    </div>
  )
}