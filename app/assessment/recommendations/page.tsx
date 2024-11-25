'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Briefcase, GraduationCap, Lightbulb, Zap } from 'lucide-react'

export default function RecommendationsPage() {
  const [replaceabilityScore] = useState(65) // This would typically come from your backend or state management

  const skillRecommendations = [
    { title: "Data Analysis", description: "Enhance your ability to interpret complex datasets and derive insights.", icon: Zap },
    { title: "Machine Learning Basics", description: "Understand the fundamentals of AI and machine learning algorithms.", icon: Lightbulb },
    { title: "Emotional Intelligence", description: "Develop skills in areas where humans still outperform AI, such as empathy and complex communication.", icon: BookOpen },
    { title: "Creative Problem Solving", description: "Improve your ability to think outside the box and develop innovative solutions.", icon: GraduationCap },
  ]

  const careerRecommendations = [
    { title: "Upskill in Complementary Areas", description: "Identify and learn skills that complement AI rather than compete with it.", icon: Briefcase },
    { title: "Specialize in Human-AI Collaboration", description: "Position yourself as an expert in leveraging AI tools to enhance human work.", icon: Zap },
    { title: "Explore Emerging Fields", description: "Consider transitioning to fields that are growing due to AI advancements.", icon: Lightbulb },
    { title: "Develop Your Personal Brand", description: "Highlight your unique human skills and experiences that set you apart from AI.", icon: GraduationCap },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">Your Personalized Recommendations</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Based on Your Replaceability Score: {replaceabilityScore}%</CardTitle>
            <CardDescription>
              Here are tailored suggestions to enhance your job security and career prospects in the age of AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              With a replaceability score of {replaceabilityScore}%, it's {replaceabilityScore > 50 ? 'crucial' : 'beneficial'} to focus on developing skills that complement AI and position yourself for future opportunities.
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="skills" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="skills">Skill Development</TabsTrigger>
            <TabsTrigger value="career">Career Advancement</TabsTrigger>
          </TabsList>
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Skills to Develop</CardTitle>
                <CardDescription>Enhance your value in an AI-driven workplace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {skillRecommendations.map((skill, index) => (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-center gap-4">
                        <skill.icon className="h-8 w-8 text-primary" />
                        <CardTitle>{skill.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{skill.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="career">
            <Card>
              <CardHeader>
                <CardTitle>Career Advancement Strategies</CardTitle>
                <CardDescription>Position yourself for success in an evolving job market</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {careerRecommendations.map((career, index) => (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-center gap-4">
                        <career.icon className="h-8 w-8 text-primary" />
                        <CardTitle>{career.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{career.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Take action to secure your future in an AI-driven world</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1">
                <Link href="/courses">Explore Recommended Courses</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/courses?tab=resources">Browse Additional Resources</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

