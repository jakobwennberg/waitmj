'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Brain, Users, Zap, ShieldAlert, Lightbulb, ChevronRight } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Recommendations {
  strengths: string[];
  risks: string[];
  recommendations: string[];
}

export default function ResultsPage() {
  const router = useRouter()
  const [replaceabilityScore, setReplaceabilityScore] = useState<number | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null)
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)

  useEffect(() => {
    // Get assessment ID and score from sessionStorage
    const assessmentId = sessionStorage.getItem('assessmentId')
    
    if (!assessmentId) {
      router.push('/assessment')
      return
    }
    
    // Fetch AI recommendations and score
    const fetchResults = async () => {
      setIsLoadingRecommendations(true)
      try {
        const response = await fetch('/api/analyze-recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ assessmentId }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to get recommendations')
        }

        if (data.success) {
          setReplaceabilityScore(data.score)
          setRecommendations(data.recommendations)
        }
      } catch (error) {
        console.error('Error:', error)
        toast({
          title: "Error",
          description: "Failed to load results. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingRecommendations(false)
      }
    }

    fetchResults()
  }, [router])

  if (!replaceabilityScore) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Your Results...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Your AI Replaceability Score</CardTitle>
            <CardDescription>
              Based on your responses, here's how likely your job is to be automated by AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-muted-foreground/20"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="44"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-primary"
                    strokeWidth="8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="44"
                    cx="50"
                    cy="50"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 44}`,
                      strokeDashoffset: `${2 * Math.PI * 44 * (1 - replaceabilityScore / 100)}`,
                      transform: 'rotate(-90deg)',
                      transformOrigin: '50% 50%'
                    }}
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="text-4xl font-bold">{replaceabilityScore}%</div>
                </div>
              </div>
            </div>

            <p className="text-center text-muted-foreground">
              {replaceabilityScore > 75 ? (
                "Your role shows high potential for AI automation. Consider upskilling in areas that complement AI."
              ) : replaceabilityScore > 50 ? (
                "Your job has moderate automation potential. Focus on developing skills that AI cannot easily replicate."
              ) : replaceabilityScore > 25 ? (
                "Your role shows lower automation risk. Continue developing your unique human skills."
              ) : (
                "Your job has very low automation potential. Your human skills are highly valuable."
              )}
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="analysis" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="strengths">Strengths</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle>Key Factors Analysis</CardTitle>
                <CardDescription>How different aspects of your job contribute to your score</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingRecommendations ? (
                  <p>Analyzing factors...</p>
                ) : (
                  <div className="space-y-4">
                    {recommendations?.risks.map((risk, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-primary" />
                          <span className="font-medium">{risk}</span>
                        </div>
                        <Progress value={Math.random() * 100} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strengths">
            <Card>
              <CardHeader>
                <CardTitle>Your Professional Strengths</CardTitle>
                <CardDescription>Areas where you demonstrate strong capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRecommendations ? (
                  <p>Analyzing strengths...</p>
                ) : (
                  <ul className="space-y-4">
                    {recommendations?.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Personalized Recommendations</CardTitle>
                <CardDescription>Steps to enhance your career resilience</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRecommendations ? (
                  <p>Generating recommendations...</p>
                ) : (
                  <ul className="space-y-4">
                    {recommendations?.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ChevronRight className="h-5 w-5 text-primary mt-0.5" />
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/courses">Explore Recommended Courses</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/newsletter">Stay Updated</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}