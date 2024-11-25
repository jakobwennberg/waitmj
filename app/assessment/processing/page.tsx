'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import { Loader2 } from 'lucide-react'

const facts = [
  "AI can now generate human-like text, images, and even music.",
  "Machine learning algorithms are being used to predict stock market trends.",
  "Autonomous vehicles are becoming increasingly common in various industries.",
  "AI-powered chatbots are handling customer service inquiries 24/7.",
  "Robotic process automation is streamlining repetitive office tasks.",
  "AI is assisting doctors in diagnosing diseases and recommending treatments.",
  "Natural language processing is improving real-time translation services.",
  "AI algorithms are being used to optimize energy consumption in smart buildings.",
  "Facial recognition technology is enhancing security systems worldwide.",
  "AI-driven personalization is revolutionizing the e-commerce experience."
]

export default function ProcessingScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [factIndex, setFactIndex] = useState(0)

  useEffect(() => {
    const score = searchParams.get('score')
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer)
          router.push(`/assessment/results?score=${score}`)
          return 100
        }
        const newProgress = Math.min(oldProgress + 10, 100)
        setFactIndex((oldIndex) => (oldIndex + 1) % facts.length)
        return newProgress
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-primary mb-6">Analyzing Your Responses</h1>
        <div className="flex items-center justify-center mb-6">
          <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">
            Calculating your AI Replaceability Score...
          </p>
        </div>
        <Progress value={progress} className="mb-6" />
        <div className="bg-muted p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Did you know?</h2>
          <p className="text-muted-foreground">{facts[factIndex]}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          This may take a few moments. We're thoroughly analyzing your responses to provide accurate insights.
        </p>
      </div>
    </div>
  )
}

