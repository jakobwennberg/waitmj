'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface FormErrors {
  complexTasks?: string;
  humanInteraction?: string;
  toolsUsed?: string;
  creativityLevel?: string;
  decisionMaking?: string;
}

export default function JobAnalysisQuestionnaire() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    complexTasks: '',
    humanInteraction: 5,
    toolsUsed: [] as string[],
    creativityLevel: 5,
    decisionMaking: 5,
  })
  const [progress, setProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [complexityScore, setComplexityScore] = useState<number | null>(null);

  const tools = [
    { id: 'word-processing', label: 'Word Processing' },
    { id: 'spreadsheets', label: 'Spreadsheets' },
    { id: 'presentation-software', label: 'Presentation Software' },
    { id: 'project-management', label: 'Project Management Tools' },
    { id: 'coding-languages', label: 'Coding Languages' },
    { id: 'design-software', label: 'Design Software' },
  ]

  const handleInputChange = (name: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    updateProgress()
    
    // Clear error for this field if it exists
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleCheckboxChange = (id: string, checked: boolean) => {
    const newToolsUsed = checked
      ? [...formData.toolsUsed, id]
      : formData.toolsUsed.filter(item => item !== id)
    
    setFormData(prev => ({
      ...prev,
      toolsUsed: newToolsUsed
    }))
    
    if (errors.toolsUsed) {
      setErrors(prev => ({ ...prev, toolsUsed: undefined }))
    }
    
    updateProgress()
  }

  const updateProgress = () => {
    const requiredFields = ['complexTasks', 'toolsUsed']
    const filledRequiredFields = requiredFields.filter(field => {
      if (field === 'toolsUsed') {
        return formData.toolsUsed.length > 0
      }
      return formData[field as keyof typeof formData]
    }).length
    setProgress((filledRequiredFields / requiredFields.length) * 100)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    if (!formData.complexTasks.trim()) {
      newErrors.complexTasks = 'Please describe your complex tasks'
      isValid = false
    } else if (formData.complexTasks.length < 20) {
      newErrors.complexTasks = 'Please provide a more detailed description (at least 20 characters)'
      isValid = false
    }

    if (formData.toolsUsed.length === 0) {
      newErrors.toolsUsed = 'Please select at least one tool that you use'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const analyzeTaskComplexity = async (description: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-task-complexity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskDescription: description }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Error analyzing task complexity');
      }
  
      setComplexityScore(data.complexityScore);
      return data.complexityScore;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze task complexity. Using default scoring.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    
    if (!validateForm()) {
      toast({
        title: "Form Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      // First, analyze task complexity
      const taskScore = await analyzeTaskComplexity(formData.complexTasks);
      
      // Prepare submission data with AI-analyzed complexity score
      const submissionData = {
        ...formData,
        assessmentId: sessionStorage.getItem('assessmentId'),
        taskComplexityScore: taskScore
      };
  
      const response = await fetch('/api/submit-job-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit job analysis');
      }
  
      if (data.success) {
        router.push(`/assessment/processing?score=${data.score}`);
      }
    } catch (error) {
      console.error('Error submitting job analysis:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">In-Depth Job Analysis</CardTitle>
          <CardDescription>
            Please provide detailed information about your job responsibilities and skills.
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
          
          <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
  <Label htmlFor="complexTasks" className="required">
    Describe the most complex tasks you perform in your role:
  </Label>
  <Textarea
    id="complexTasks"
    value={formData.complexTasks}
    onChange={(e) => handleInputChange('complexTasks', e.target.value)}
    placeholder="E.g., Analyzing large datasets to identify market trends..."
    className={errors.complexTasks && hasAttemptedSubmit ? 'border-red-500' : ''}
  />
  {isAnalyzing && (
    <p className="text-sm text-muted-foreground">
      Analyzing task complexity...
    </p>
  )}
  {complexityScore && (
    <p className="text-sm text-muted-foreground">
      Task Complexity Score: {complexityScore}
    </p>
  )}
  {errors.complexTasks && hasAttemptedSubmit && (
    <p className="text-sm text-red-500 mt-1">{errors.complexTasks}</p>
  )}
</div>

            <div className="space-y-2">
              <Label>Rate the level of human interaction in your job:</Label>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[formData.humanInteraction]}
                onValueChange={(value) => handleInputChange('humanInteraction', value[0])}
                className="mt-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Minimal (1)</span>
                <span>Extensive (10)</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="required">Which tools do you regularly use? (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {tools.map((tool) => (
                  <div key={tool.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={tool.id}
                      checked={formData.toolsUsed.includes(tool.id)}
                      onCheckedChange={(checked) => handleCheckboxChange(tool.id, checked as boolean)}
                    />
                    <Label htmlFor={tool.id} className="text-sm font-normal">
                      {tool.label}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.toolsUsed && hasAttemptedSubmit && (
                <p className="text-sm text-red-500 mt-1">{errors.toolsUsed}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>How much creativity does your job require?</Label>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[formData.creativityLevel]}
                onValueChange={(value) => handleInputChange('creativityLevel', value[0])}
                className="mt-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Low (1)</span>
                <span>High (10)</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>How complex are the decisions you make in your role?</Label>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[formData.decisionMaking]}
                onValueChange={(value) => handleInputChange('decisionMaking', value[0])}
                className="mt-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Simple (1)</span>
                <span>Very Complex (10)</span>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit and See Results"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}