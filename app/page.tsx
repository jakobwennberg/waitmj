import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">WILL AI TAKE MY JOB?</div>
          <div className="space-x-4">
            <Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link>
            <Link href="/how-it-works" className="text-muted-foreground hover:text-primary">How It Works</Link>
            <Link href="/testimonials" className="text-muted-foreground hover:text-primary">Testimonials</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-6">
          Is Your Job Safe from AI Automation?
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Discover the impact of AI on your career with our cutting-edge assessment tool. Get personalized insights and recommendations to future-proof your job.
        </p>
        <Button size="lg" asChild>
          <Link href="/assessment">Start Your Free Assessment Now</Link>
        </Button>
        <p className="mt-4 text-sm text-muted-foreground">
          Your privacy is our priority. All data is securely processed and never shared.
        </p>
      </main>

      <footer className="py-6 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
        <p>&copy; 2023 WAITMJ. All rights reserved.</p>
      </footer>
    </div>
  )
}

