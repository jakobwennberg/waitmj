import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, Brain, BarChart, Lightbulb } from "lucide-react"

const steps = [
  {
    icon: ClipboardList,
    title: "Complete the Assessment",
    description: "Answer a series of questions about your job role, skills, and daily tasks. This typically takes about 5-10 minutes."
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Our advanced AI algorithms analyze your responses, comparing them with current AI capabilities and industry trends."
  },
  {
    icon: BarChart,
    title: "Receive Your Score",
    description: "Get your personalized AI Replaceability Score, indicating how likely your job is to be automated in the near future."
  },
  {
    icon: Lightbulb,
    title: "Personalized Recommendations",
    description: "Based on your score, receive tailored advice on skills to develop and strategies to enhance your career resilience."
  }
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">How It Works</h1>
        <p className="text-xl text-center text-muted-foreground mb-12">
          Discover how our AI-powered assessment helps you understand and prepare for the future of your career.
        </p>
        
        <div className="space-y-8">
          {steps.map((step, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>Step {index + 1}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p>{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Why Use Our Assessment?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Stay informed about AI's impact on your specific job role</li>
            <li>Identify potential risks and opportunities in your career</li>
            <li>Receive actionable advice to enhance your job security</li>
            <li>Understand which skills are most valuable in an AI-driven workplace</li>
          </ul>
        </div>

        <p className="mt-12 text-center text-muted-foreground">
          Ready to discover your AI Replaceability Score? Start your assessment now and take control of your career's future.
        </p>
      </div>
    </div>
  )
}

