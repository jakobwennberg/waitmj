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
    // Get score from sessionStorage
    const score = sessionStorage.getItem('aiScore')
    const assessmentId = sessionStorage.getItem('assessmentId')
    
    if (!score || !assessmentId) {
      router.push('/assessment')
      return
    }
    setReplaceabilityScore(Number(score))
    
    // Fetch AI recommendations
    const fetchRecommendations = async () => {
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
          setRecommendations(data.recommendations)
        }
      } catch (error) {
        console.error('Error:', error)
        toast({
          title: "Error",
          description: "Failed to load recommendations. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingRecommendations(false)
      }
    }

    fetchRecommendations()
  }, [router])

  // If score isn't loaded yet, show loading state
  if (replaceabilityScore === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Results...</h1>
        </div>
      </div>
    )
  }

  const factors = [
    { name: 'Task Complexity', score: Math.min(100, replaceabilityScore + 5), icon: Brain },
    { name: 'Human Interaction', score: Math.min(100, replaceabilityScore - 10), icon: Users },
    { name: 'Use of Technology', score: Math.min(100, replaceabilityScore + 15), icon: Zap },
    { name: 'Creativity', score: Math.min(100, replaceabilityScore - 5), icon: AlertCircle },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">Your AI Replaceability Assessment Results</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Replaceability Score</CardTitle>
            <CardDescription>Based on your responses, here's how likely your job is to be automated by AI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-muted-foreground"
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
                    }}
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold">
                  {replaceabilityScore}%
                </div>
              </div>
            </div>
            <p className="text-center mt-4 text-muted-foreground">
              A score of {replaceabilityScore}% suggests that your job has a {replaceabilityScore > 50 ? 'higher' : 'lower'} than average chance of being automated by AI in the near future.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="breakdown" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
            <TabsTrigger value="explanation">What This Means</TabsTrigger>
          </TabsList>
          <TabsContent value="breakdown">
            <Card>
              <CardHeader>
                <CardTitle>Factor Breakdown</CardTitle>
                <CardDescription>How different aspects of your job contribute to your overall score</CardDescription>
              </CardHeader>
              <CardContent>
                {factors.map((factor) => (
                  <div key={factor.name} className="mb-4">
                    <div className="flex items-center mb-2">
                      <factor.icon className="mr-2 h-4 w-4" />
                      <span className="font-medium">{factor.name}</span>
                      <span className="ml-auto">{factor.score}%</span>
                    </div>
                    <Progress value={factor.score} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="explanation">
            <Card>
              <CardHeader>
                <CardTitle>Understanding Your Score</CardTitle>
                <CardDescription>What your replaceability score means for your career</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    Your replaceability score of {replaceabilityScore}% indicates that your job has a {replaceabilityScore > 50 ? 'higher' : 'lower'} than average likelihood of being impacted by AI automation in the coming years.
                  </p>
                  <h3 className="font-semibold text-lg">Key Insights:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Tasks that are routine or predictable are more likely to be automated</li>
                    <li>Jobs requiring high levels of human interaction, creativity, or complex decision-making are generally less at risk</li>
                    <li>The pace of AI development means that the landscape is constantly changing</li>
                    <li>Regardless of your score, upskilling and staying informed about AI developments in your field is crucial</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Tabs defaultValue="recommendations" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="strengths">Your Strengths</TabsTrigger>
            <TabsTrigger value="risks">Potential Risks</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="strengths">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Professional Strengths
                </CardTitle>
                <CardDescription>
                  Key areas where you demonstrate strong capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRecommendations ? (
                  <p className="text-muted-foreground">Analyzing your strengths...</p>
                ) : (
                  <ul className="space-y-4">
                    {recommendations?.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ChevronRight className="h-5 w-5 text-primary mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risks">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" />
                  Potential AI Impact
                </CardTitle>
                <CardDescription>
                  Areas where AI might affect your role
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRecommendations ? (
                  <p className="text-muted-foreground">Analyzing potential risks...</p>
                ) : (
                  <ul className="space-y-4">
                    {recommendations?.risks.map((risk, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ChevronRight className="h-5 w-5 text-primary mt-0.5" />
                        <span>{risk}</span>
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
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Personalized Recommendations
                </CardTitle>
                <CardDescription>
                  Action steps to enhance your career resilience
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRecommendations ? (
                  <p className="text-muted-foreground">Generating personalized recommendations...</p>
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

        <div className="flex gap-4 justify-center">
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
