'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

export default function TestPage() {
  const [assessmentId, setAssessmentId] = useState<string>('')
  const [testResults, setTestResults] = useState<any>({})

  // Test initial assessment submission
  const testAssessment = async () => {
    try {
      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ageRange: "25-34",
          gender: "prefer-not-to-say",
          educationLevel: "bachelors",
          industry: "technology",
          jobTitle: "Software Developer"
        })
      })

      const data = await response.json()
      if (response.ok) {
        setAssessmentId(data.assessmentId)
        setTestResults(prev => ({ ...prev, assessment: data }))
        toast({ title: "Assessment Test Successful" })
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Assessment test failed:', error)
      toast({ 
        title: "Assessment Test Failed", 
        variant: "destructive" 
      })
    }
  }

  // Test job questions submission
  const testJobQuestions = async () => {
    if (!assessmentId) {
      toast({ 
        title: "Run assessment test first", 
        variant: "destructive" 
      })
      return
    }

    try {
      const response = await fetch('/api/submit-job-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentId,
          answers: {
            1: "yes",
            2: "no",
            3: "yes",
            4: "yes",
            5: "no",
            6: "yes",
            7: "no",
            8: "yes",
            9: "no",
            10: "yes"
          }
        })
      })

      const data = await response.json()
      if (response.ok) {
        setTestResults(prev => ({ ...prev, jobQuestions: data }))
        toast({ title: "Job Questions Test Successful" })
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Job questions test failed:', error)
      toast({ 
        title: "Job Questions Test Failed", 
        variant: "destructive" 
      })
    }
  }

  // Test email submission
  const testEmail = async () => {
    if (!assessmentId) {
      toast({ 
        title: "Run assessment test first", 
        variant: "destructive" 
      })
      return
    }

    try {
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentId,
          email: "test@example.com",
          consent: true
        })
      })

      const data = await response.json()
      if (response.ok) {
        setTestResults(prev => ({ ...prev, email: data }))
        toast({ title: "Email Test Successful" })
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Email test failed:', error)
      toast({ 
        title: "Email Test Failed", 
        variant: "destructive" 
      })
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>API Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button 
              onClick={testAssessment}
              className="w-full"
            >
              Test Assessment Submission
            </Button>
            <Button 
              onClick={testJobQuestions}
              className="w-full"
              disabled={!assessmentId}
            >
              Test Job Questions Submission
            </Button>
            <Button 
              onClick={testEmail}
              className="w-full"
              disabled={!assessmentId}
            >
              Test Email Submission
            </Button>
          </div>

          <div className="mt-4">
            <h3 className="font-medium mb-2">Test Results:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}