'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from '@/hooks/use-toast'

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
  const [isLoading, setIsLoading] = useState(false)

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
  }

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      toolsUsed: checked
        ? [...prev.toolsUsed, id]
        : prev.toolsUsed.filter(item => item !== id)
    }))
    updateProgress()
  }

  const updateProgress = () => {
    const { complexTasks, humanInteraction, toolsUsed, creativityLevel, decisionMaking } = formData
    const filledFields = [
      complexTasks,
      humanInteraction,
      toolsUsed.length > 0,
      creativityLevel,
      decisionMaking
    ].filter(Boolean).length
    setProgress((filledFields / 5) * 100)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.success) {
        router.push(`/assessment/processing?score=${data.score}`)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to submit assessment. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error submitting assessment:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">In-Depth Job Analysis</h1>
        <p className="text-muted-foreground mb-6 text-center">
          Please provide detailed information about your job responsibilities and skills. This helps us accurately assess the impact of AI on your role.
        </p>
        <Progress value={progress} className="mb-6" />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="complexTasks">Describe the most complex tasks you perform in your role:</Label>
            <Textarea
              id="complexTasks"
              value={formData.complexTasks}
              onChange={(e) => handleInputChange('complexTasks', e.target.value)}
              placeholder="E.g., Analyzing large datasets to identify market trends..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="humanInteraction">Rate the level of human interaction in your job:</Label>
            <Slider
              id="humanInteraction"
              min={1}
              max={10}
              step={1}
              value={[formData.humanInteraction]}
              onValueChange={(value) => handleInputChange('humanInteraction', value[0])}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Minimal (1)</span>
              <span>Extensive (10)</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Which tools do you regularly use? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-4">
              {tools.map((tool) => (
                <div key={tool.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={tool.id}
                    checked={formData.toolsUsed.includes(tool.id)}
                    onCheckedChange={(checked) => handleCheckboxChange(tool.id, checked as boolean)}
                  />
                  <Label htmlFor={tool.id}>{tool.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="space-y-2">
                  <Label htmlFor="creativityLevel">How much creativity does your job require?</Label>
                  <Slider
                    id="creativityLevel"
                    min={1}
                    max={10}
                    step={1}
                    value={[formData.creativityLevel]}
                    onValueChange={(value) => handleInputChange('creativityLevel', value[0])}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Low (1)</span>
                    <span>High (10)</span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Consider how often you need to come up with original ideas or solutions.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="space-y-2">
                  <Label htmlFor="decisionMaking">How complex are the decisions you make in your role?</Label>
                  <Slider
                    id="decisionMaking"
                    min={1}
                    max={10}
                    step={1}
                    value={[formData.decisionMaking]}
                    onValueChange={(value) => handleInputChange('decisionMaking', value[0])}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Simple (1)</span>
                    <span>Very Complex (10)</span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Consider the impact and difficulty of decisions you regularly make.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit and See Results"}
          </Button>
        </form>
      </div>
    </div>
  )
}

