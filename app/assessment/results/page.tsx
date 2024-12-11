// app/assessment/results/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  AlertCircle, Brain, TrendingUp, BookOpen, 
  Lightbulb, ChevronRight, Zap, ShieldAlert 
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface FormattedSection {
  title: string;
  bullets: string[];
}

interface ProcessedInsights {
  industryTrends: FormattedSection[];
  automationData: FormattedSection[];
  skillsInsights: FormattedSection[];
}

const ResultsSection = ({ title, sections }: { title: string, sections: FormattedSection[] }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold">{title}</h3>
    {sections.map((section, idx) => (
      <div key={idx} className="space-y-2">
        <h4 className="font-medium text-muted-foreground">{section.title}</h4>
        <ul className="space-y-2">
          {section.bullets.map((bullet, bulletIdx) => (
            <li key={bulletIdx} className="flex items-start gap-2">
              <div className="mt-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              </div>
              <span className="text-sm">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

export default function ResultsPage() {
  const router = useRouter()
  const [replaceabilityScore, setReplaceabilityScore] = useState<number | null>(null)
  const [insights, setInsights] = useState<ProcessedInsights | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const assessmentId = sessionStorage.getItem('assessmentId')
    
    if (!assessmentId) {
      router.push('/assessment')
      return
    }
    
    const fetchResults = async () => {
      try {
        const response = await fetch('/api/analyze-recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assessmentId })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to get recommendations')
        }

        if (data.success) {
          setReplaceabilityScore(data.score)
          setInsights(data.insights)
        }
      } catch (error) {
        console.error('Error:', error)
        toast({
          title: "Error",
          description: "Failed to load results. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-6">
            <div className="space-y-4 text-center">
              <Brain className="h-12 w-12 mx-auto animate-pulse text-primary" />
              <CardTitle>Analyzing Your Results</CardTitle>
              <CardDescription>
                Please wait while we process your assessment data...
              </CardDescription>
              <Progress value={100} className="animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!replaceabilityScore || !insights) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to load your results. Please try taking the assessment again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Score Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Your AI Replaceability Score</CardTitle>
            <CardDescription>
              Based on your responses and our AI-powered analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-4xl font-bold">{replaceabilityScore}%</div>
                  <div className="text-sm text-muted-foreground">Risk Score</div>
                </div>
              </div>
            </div>

            <Card className="bg-muted">
              <CardContent className="p-4">
                <p className="text-center">
                  {replaceabilityScore > 75 ? (
                    <span className="text-red-500">High Risk: Your role shows significant potential for AI automation. Immediate action recommended.</span>
                  ) : replaceabilityScore > 50 ? (
                    <span className="text-yellow-500">Moderate Risk: Your job has some automation potential. Consider upskilling in key areas.</span>
                  ) : replaceabilityScore > 25 ? (
                    <span className="text-green-500">Low Risk: Your role shows resilience to automation. Continue developing your unique skills.</span>
                  ) : (
                    <span className="text-green-600">Minimal Risk: Your job demonstrates strong resistance to AI automation.</span>
                  )}
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Analysis Tabs */}
        <Tabs defaultValue="insights" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="insights">Analysis</TabsTrigger>
            <TabsTrigger value="industry">Industry</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Complete Analysis
                </CardTitle>
                <CardDescription>
                  Comprehensive overview of your assessment results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <ResultsSection 
                  title="Industry Trends" 
                  sections={insights.industryTrends}
                />
                <ResultsSection 
                  title="Automation Insights" 
                  sections={insights.automationData}
                />
                <ResultsSection 
                  title="Skills Recommendations" 
                  sections={insights.skillsInsights}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="industry">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Industry Analysis
                </CardTitle>
                <CardDescription>
                  Current trends and future predictions for your industry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResultsSection 
                  title="Industry Trends" 
                  sections={insights.industryTrends}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" />
                  Automation Impact
                </CardTitle>
                <CardDescription>
                  Analysis of automation risks and vulnerabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResultsSection 
                  title="Automation Insights" 
                  sections={insights.automationData}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Skills Development
                </CardTitle>
                <CardDescription>
                  Recommended skills and professional development paths
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResultsSection 
                  title="Skills Recommendations" 
                  sections={insights.skillsInsights}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/courses">
              <BookOpen className="mr-2 h-4 w-4" />
              View Recommended Courses
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/newsletter">
              <TrendingUp className="mr-2 h-4 w-4" />
              Stay Updated
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}