'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

export default function ProcessingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [factIndex, setFactIndex] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(true)

  useEffect(() => {
    let progressTimer: NodeJS.Timeout
    let factTimer: NodeJS.Timeout

    const startAnalysis = () => {
      progressTimer = setInterval(() => {
        setProgress(oldProgress => {
          if (oldProgress === 100) {
            clearInterval(progressTimer)
            // Navigate to results page after a short delay
            setTimeout(() => {
              router.push('/assessment/results')
            }, 500)
            return 100
          }
          return Math.min(oldProgress + 5, 100)
        })
      }, 300)

      factTimer = setInterval(() => {
        setFactIndex(oldIndex => (oldIndex + 1) % facts.length)
      }, 3000)
    }

    startAnalysis()

    // Cleanup
    return () => {
      clearInterval(progressTimer)
      clearInterval(factTimer)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <CardTitle>Analyzing Your Responses</CardTitle>
          <CardDescription>
            Please wait while we process your answers and calculate your AI Replaceability Score.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              {progress}% complete
            </p>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-2">Did you know?</h3>
            <p className="text-sm text-muted-foreground">
              {facts[factIndex]}
            </p>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            This may take a few moments. We're thoroughly analyzing your responses to provide accurate insights.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

