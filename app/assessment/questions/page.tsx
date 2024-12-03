'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { toast } from '@/hooks/use-toast'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from '@/components/ui/label'

const questions = [
  {
    id: 1,
    question: "Do you repeat the same tasks every day at work?",
    description: "Consider your daily work routine and recurring tasks."
  },
  {
    id: 2,
    question: "Does your job involve a lot of data entry or number crunching?",
    description: "Think about time spent on repetitive data manipulation tasks."
  },
  {
    id: 3,
    question: "Do you need to come up with new ideas or be creative in your role?",
    description: "Consider tasks requiring original thinking and creative solutions."
  },
  {
    id: 4,
    question: "Do you spend a lot of time talking with people, like customers or coworkers?",
    description: "Think about direct human interaction in your daily work."
  },
  {
    id: 5,
    question: "Does your job require you to use your hands for precise tasks or work in changing environments?",
    description: "Consider physical skills and adaptability in your role."
  },
  {
    id: 6,
    question: "Do you have specialized knowledge or skills that aren't easy to teach or learn?",
    description: "Think about unique expertise that requires significant training or experience."
  },
  {
    id: 7,
    question: "Have you noticed new technology that can do parts of your job?",
    description: "Consider recent technological advancements in your field."
  },
  {
    id: 8,
    question: "Do you often make decisions in situations where things are unclear or complicated?",
    description: "Think about complex problem-solving and judgment calls."
  },
  {
    id: 9,
    question: "Are your work tasks very routine and follow set steps or procedures?",
    description: "Consider how standardized your work processes are."
  },
  {
    id: 10,
    question: "Do you regularly need to learn new things or adapt to changes in your job?",
    description: "Think about how often you need to update your skills or approach."
  }
]

export default function JobQuestionsPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }))
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast({
        title: "Please answer all questions",
        description: "Make sure you've answered every question before proceeding.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit-job-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentId: sessionStorage.getItem('assessmentId'),
          answers
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      // Navigate to email collection
      router.push('/assessment/email')
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Step 2: Your Job Details</CardTitle>
          <CardDescription>
            Question {currentQuestion + 1} of {questions.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="mb-6" />
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{currentQ.question}</h3>
              <p className="text-sm text-muted-foreground">{currentQ.description}</p>
            </div>

            <RadioGroup
              value={answers[currentQ.id]}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>

            <div className="flex justify-between space-x-4">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>

              <div className="flex-1" /> {/* Spacer */}

              {currentQuestion < questions.length - 1 ? (
                <Button 
                  onClick={handleNext}
                  disabled={!answers[currentQ.id]}
                >
                  Next Question
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !answers[currentQ.id]}
                >
                  {isSubmitting ? "Submitting..." : "Complete Assessment"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}