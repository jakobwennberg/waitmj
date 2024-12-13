'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface FormErrors {
  ageRange?: string;
  educationLevel?: string;
  industry?: string;
  jobTitle?: string;
}

export default function AssessmentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    ageRange: '',
    gender: '',
    educationLevel: '',
    industry: '',
    jobTitle: '',
  })
  const [progress, setProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    updateProgress()
    
    // Clear error for this field if it exists
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const updateProgress = () => {
    const requiredFields = ['ageRange', 'educationLevel', 'industry', 'jobTitle']
    const filledFields = requiredFields.filter(field => formData[field as keyof typeof formData]).length
    setProgress((filledFields / requiredFields.length) * 100)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    if (!formData.ageRange) {
      newErrors.ageRange = 'Please select your age range'
      isValid = false
    }

    if (!formData.educationLevel) {
      newErrors.educationLevel = 'Please select your education level'
      isValid = false
    }

    if (!formData.industry) {
      newErrors.industry = 'Please select your industry'
      isValid = false
    }

    if (!formData.jobTitle) {
      newErrors.jobTitle = 'Please enter your job title'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setHasAttemptedSubmit(true)
    
    if (!validateForm()) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      // Store the assessment ID for the next steps
      sessionStorage.setItem('assessmentId', data.assessmentId)
      // Navigate to the job questions page
      router.push('/assessment/questions')
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle>Step 1: Tell Us About Yourself</CardTitle>
          <CardDescription>
            This information helps us provide more accurate insights about AI's impact on your career.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasAttemptedSubmit && Object.keys(errors).length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please correct the following errors:
                <ul className="list-disc pl-4 mt-2">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Progress value={progress} className="mb-6" />
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ageRange" className="required">Age Range</Label>
              <Select 
                name="ageRange" 
                value={formData.ageRange}
                onValueChange={(value) => handleInputChange('ageRange', value)}
              >
                <SelectTrigger className={errors.ageRange && hasAttemptedSubmit ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select Age Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-34">25-34</SelectItem>
                  <SelectItem value="35-44">35-44</SelectItem>
                  <SelectItem value="45-54">45-54</SelectItem>
                  <SelectItem value="55+">55+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender (Optional)</Label>
              <Select 
                name="gender" 
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="educationLevel" className="required">Education Level</Label>
              <Select 
                name="educationLevel" 
                value={formData.educationLevel}
                onValueChange={(value) => handleInputChange('educationLevel', value)}
              >
                <SelectTrigger className={errors.educationLevel && hasAttemptedSubmit ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select Education Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                  <SelectItem value="masters">Master's Degree</SelectItem>
                  <SelectItem value="phd">Ph.D. or Doctorate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="required">Industry</Label>
              <Select 
                name="industry" 
                value={formData.industry}
                onValueChange={(value) => handleInputChange('industry', value)}
              >
                <SelectTrigger className={errors.industry && hasAttemptedSubmit ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="required">Job Title</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                placeholder="Your Current Job Title"
                className={errors.jobTitle && hasAttemptedSubmit ? 'border-red-500' : ''}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Next: Job Questions"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}