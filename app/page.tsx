// app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import TestimonialsSection from '@/components/TestimonialsSection'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow flex flex-col px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="flex-grow flex flex-col items-center justify-center py-12 sm:py-20">
          {/* Main Title - Smaller on mobile */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 text-center">
            Is Your Job Safe from AI Automation?
          </h1>

          {/* Subtitle - Adjusted padding and font size for mobile */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl text-center px-4">
            Discover the impact of AI on your career with our cutting-edge assessment tool. 
            Get personalized insights and recommendations to future-proof your job.
          </p>

          {/* CTA Button - Full width on mobile */}
          <div className="w-full sm:w-auto px-4 sm:px-0">
            <Button 
              size="lg" 
              asChild 
              className="w-full sm:w-auto text-base sm:text-lg py-6"
            >
              <Link href="/assessment">Start Your Free Assessment Now</Link>
            </Button>
          </div>

          {/* Privacy Notice - Adjusted margins for mobile */}
          <p className="mt-6 text-sm text-muted-foreground text-center px-4">
            Your privacy is our priority. All data is securely processed and never shared.
          </p>
        </div>

        {/* Testimonials Section - Now responsive */}
        <div className="w-full py-12 sm:py-20">
          <TestimonialsSection />
        </div>
      </main>

      {/* Footer - Adjusted padding for mobile */}
      <footer className="py-4 sm:py-6 px-4 text-center text-muted-foreground text-sm">
        <p>&copy; 2024 WAITMJ. All rights reserved.</p>
      </footer>
    </div>
  )
}