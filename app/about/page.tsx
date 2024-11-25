import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, Brain, Lightbulb, TrendingUp } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">About Will AI Take My Job?</h1>
        
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-xl text-muted-foreground mb-6">
            We're on a mission to empower professionals in the age of AI. Our platform provides insights, tools, and resources to help you navigate the evolving job market with confidence.
          </p>
          <Button asChild size="lg">
            <Link href="/assessment">
              Start Your Assessment <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Brain className="h-10 w-10 text-primary mb-4" />
              <CardTitle>AI-Powered Analysis</CardTitle>
              <CardDescription>Cutting-edge algorithms assess your job's AI replaceability</CardDescription>
            </CardHeader>
            <CardContent>
              Our advanced AI models analyze your job responsibilities and skills, comparing them with current AI capabilities and industry trends to provide an accurate replaceability score.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Lightbulb className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Personalized Insights</CardTitle>
              <CardDescription>Tailored recommendations for your career development</CardDescription>
            </CardHeader>
            <CardContent>
              Based on your assessment results, we offer customized advice on skill development, career pivots, and strategies to enhance your value in an AI-driven workplace.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Continuous Learning</CardTitle>
              <CardDescription>Stay ahead with our curated resources and courses</CardDescription>
            </CardHeader>
            <CardContent>
              Access a wealth of up-to-date information, online courses, and expert insights to help you adapt and thrive in the rapidly evolving job market influenced by AI advancements.
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Commitment</h2>
          <p className="text-lg mb-4">
            At "Will AI Take My Job?", we're committed to providing accurate, up-to-date information to help you make informed decisions about your career. Our team of AI experts, data scientists, and career counselors work tirelessly to ensure our assessments and recommendations reflect the latest developments in AI and the job market.
          </p>
          <p className="text-lg">
            We believe that by understanding the impact of AI on various professions, individuals can proactively adapt, upskill, and position themselves for success in the AI era. Our goal is not to create fear, but to empower you with knowledge and tools to thrive alongside AI.
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Future-Proof Your Career?</h2>
          <Button asChild size="lg">
            <Link href="/assessment">
              Take the AI Replaceability Assessment
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

