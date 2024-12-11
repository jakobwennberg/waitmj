'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { toast } from '@/hooks/use-toast'

const faqs = [
  {
    question: "How accurate is the AI Replaceability Score?",
    answer: "Our AI Replaceability Score is based on current AI capabilities and job market trends. While it provides a good indication, it's not a definitive prediction. The AI landscape is rapidly evolving, and we recommend using the score as a guide for personal development rather than a fixed outcome."
  },
  {
    question: "How often should I retake the assessment?",
    answer: "We recommend retaking the assessment every 6-12 months, or whenever you've acquired new skills or changed roles. This will help you stay updated on how your career prospects align with AI advancements."
  },
  {
    question: "Are my assessment results confidential?",
    answer: "Yes, your assessment results and personal information are kept strictly confidential. We do not share individual data with third parties. For more information, please refer to our Privacy Policy."
  },
  {
    question: "How can I improve my AI Replaceability Score?",
    answer: "To improve your score, focus on developing skills that complement AI rather than compete with it. This includes enhancing your creativity, emotional intelligence, complex problem-solving, and ability to work alongside AI tools. Our personalized recommendations provide specific guidance based on your assessment results."
  }
]

export default function ContactAndSupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log(formData)
    toast({
      title: "Message Sent",
      description: "We've received your message and will get back to you soon.",
    })
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">Contact & Support</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>Have a question or need assistance? Reach out to us!</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

