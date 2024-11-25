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
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'

export default function AssessmentQuestionnaire() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    ageRange: '',
    gender: '',
    educationLevel: '',
    industry: '',
    jobTitle: '',
    yearsOfExperience: 0,
  })
  const [progress, setProgress] = useState(0)

  const handleInputChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    updateProgress()
  }

  const handleSliderChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, yearsOfExperience: value[0] }))
    updateProgress()
  }

  const updateProgress = () => {
    const filledFields = Object.values(formData).filter(Boolean).length
    setProgress((filledFields / Object.keys(formData).length) * 100)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log(formData)
    router.push('/assessment/job-analysis')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Professional Information</h1>
        <p className="text-muted-foreground mb-6 text-center">
          Please provide some information about your professional background. This helps us tailor the assessment to your specific situation.
        </p>
        <Progress value={progress} className="mb-6" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select name="ageRange" onValueChange={(value) => handleInputChange('ageRange', value)} required>
            <SelectTrigger>
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

          <Select name="gender" onValueChange={(value) => handleInputChange('gender', value)}>
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

          <Select name="educationLevel" onValueChange={(value) => handleInputChange('educationLevel', value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select Education Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high-school">High School</SelectItem>
              <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
              <SelectItem value="masters">Master's Degree</SelectItem>
              <SelectItem value="phd">Ph.D. or Doctorate</SelectItem>
            </SelectContent>
          </Select>

          <Select name="industry" onValueChange={(value) => handleInputChange('industry', value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Input
            name="jobTitle"
            value={formData.jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            placeholder="Your Job Title"
            required
          />

          <div>
            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-muted-foreground mb-2">
              Years of Experience: {formData.yearsOfExperience}
            </label>
            <Slider
              id="yearsOfExperience"
              min={0}
              max={40}
              step={1}
              value={[formData.yearsOfExperience]}
              onValueChange={handleSliderChange}
            />
          </div>

          <Button type="submit" className="w-full">
            Next: Job Analysis
          </Button>
        </form>
      </div>
    </div>
  )
}

