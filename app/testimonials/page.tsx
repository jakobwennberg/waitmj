import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Manager",
    content: "The AI job assessment opened my eyes to the skills I need to focus on. It's given me a clear path for professional development in the age of AI.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Software Developer",
    content: "As a developer, I was skeptical about AI's impact on my job. This assessment provided valuable insights and helped me identify areas where I can work alongside AI more effectively.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4
  },
  {
    name: "Emily Rodriguez",
    role: "HR Specialist",
    content: "The personalized recommendations were spot-on. I've already started implementing some of the suggested strategies in my role, and I feel more confident about my career prospects.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5
  },
  {
    name: "David Patel",
    role: "Financial Analyst",
    content: "I was surprised by how comprehensive the assessment was. It not only evaluated my current skills but also provided insights into emerging trends in my industry. Highly recommended!",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5
  },
  {
    name: "Laura Thompson",
    role: "Graphic Designer",
    content: "As a creative professional, I was concerned about AI's impact on my field. This assessment helped me understand how to leverage AI tools to enhance my work rather than replace it.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4
  },
  {
    name: "Alex Novak",
    role: "Project Manager",
    content: "The AI Replaceability Score was a wake-up call. It motivated me to upskill in areas I hadn't considered before. I feel much more prepared for the future of work now.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5
  }
]

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">What Our Users Say</h1>
        <p className="text-xl text-center text-muted-foreground mb-12">
          Discover how our AI job assessment has helped professionals across various industries prepare for the future of work.
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-2">{testimonial.content}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Join thousands of professionals who have gained valuable insights from our AI job assessment.
          </p>
          <p className="mt-4 text-primary font-semibold">
            Start your assessment today and take control of your career's future.
          </p>
        </div>
      </div>
    </div>
  )
}

