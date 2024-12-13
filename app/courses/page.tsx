'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Star, BookOpen, Globe, Code, Briefcase, GraduationCap } from 'lucide-react'

const courses = [
  {
    title: "Introduction to Machine Learning",
    description: "Learn the fundamentals of machine learning and its applications in various industries.",
    provider: "Duke University",
    duration: "4 weeks",
    level: "Beginner",
    rating: 4.7,
    icon: Code,
    enrollLink: "https://www.coursera.org/learn/machine-learning-duke?utm_medium=sem&utm_source=gg&utm_campaign=B2C_EMEA__coursera_FTCOF_career-academy_pmax-multiple-audiences-country-multi&campaignid=20858198824&adgroupid=&device=c&keyword=&matchtype=&network=x&devicemodel=&adposition=&creativeid=&hide_mobile_promo&gad_source=1&gclid=Cj0KCQiA0--6BhCBARIsADYqyL-PsTjR5JwSOfPasBOv4vNz4viKbEvA7dvwGq2NPNZuI0Fa64ayu_MaAs_yEALw_wcB",
  },
  {
    title: "Applying Generative AI as a Business Professional",
    description: "Learn how generative AI tools can increase productivity.",
    provider: "LinkedIn Learning",
    duration: "2 weeks",
    level: "Intermediate",
    rating: 4.5,
    icon: BookOpen,
    enrollLink: "https://www.linkedin.com/learning/paths/building-generative-ai-skills-for-business-professionals",
  },
  {
    title: "Elements of AI",
    description: "Explore the ethical implications of AI and learn about governance frameworks.",
    provider: "Helsinki University",
    duration: "4 weeks",
    level: "Beginner",
    rating: 4.8,
    icon: Globe,
    enrollLink: "https://www.elementsofai.com/",
  },
  {
    title: "AI for Marketing",
    description: "Learn to use artificial intelligence to ramp up your marketing strategies",
    provider: "HubSpot",
    duration: "3 weeks",
    level: "Beginner",
    rating: 4.6,
    icon: Briefcase,
    enrollLink: "https://academy.hubspot.com/courses/AI-for-Marketers",
  },
]

const resources = [
  {
    title: "AI Job Market Report 2024",
    description: "Comprehensive analysis of AI's impact on various job sectors.",
    type: "PDF Report",
    icon: GraduationCap,
  },
  {
    title: "Podcast: Future of Work in the Age of AI",
    description: "Weekly discussions with industry experts on AI and employment.",
    type: "Podcast Series",
    icon: BookOpen,
  },
  {
    title: "AI Skill Assessment Tool",
    description: "Interactive tool to evaluate your AI-related skills and get personalized recommendations.",
    type: "Online Tool",
    icon: Code,
  },
  {
    title: "AI Career Transition Guide",
    description: "Step-by-step guide for professionals looking to transition into AI-related roles.",
    type: "E-Book",
    icon: Briefcase,
  },
]

export default function CoursesAndResourcesPage() {
  const [selectedTab, setSelectedTab] = useState('courses')

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">Courses and Resources</h1>
        <p className="text-xl text-muted-foreground mb-8 text-center">
          Enhance your skills and stay informed with our curated selection of courses and resources.
        </p>

        <Tabs defaultValue="courses" className="mb-8" onValueChange={(value) => setSelectedTab(value)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="courses">Recommended Courses</TabsTrigger>
            <TabsTrigger value="resources">Additional Resources</TabsTrigger>
          </TabsList>
          <TabsContent value="courses">
            <div className="grid gap-6 md:grid-cols-2">
              {courses.map((course, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <course.icon className="h-8 w-8 text-primary" />
                      <Badge variant="secondary">{course.level}</Badge>
                    </div>
                    <CardTitle className="mt-4">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{course.provider}</span>
                      <span>{course.duration}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{course.rating}</span>
                    </div>
                    <Button asChild>
                      <Link href={course.enrollLink} target="_blank" rel="noopener noreferrer">
                        Enroll Now
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="resources">
            <div className="grid gap-6 md:grid-cols-2">
              {resources.map((resource, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <resource.icon className="h-8 w-8 text-primary" />
                      <Badge>{resource.type}</Badge>
                    </div>
                    <CardTitle className="mt-4">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full">Access Resource</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {selectedTab === 'courses' && (
          <div className="text-center text-sm text-muted-foreground">
            <p>Note: Course recommendations are based on your assessment results and industry trends.</p>
            <p className="mt-2">
              We may receive a small commission for enrollments. Read our{' '}
              <Link href="/affiliate-disclosure" className="text-primary hover:underline">
                affiliate disclosure
              </Link>{' '}
              for more information.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

