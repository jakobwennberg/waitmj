// components/TestimonialsSection.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: "Alice Jönsson",
    role: "Marketing Project Lead",
    company: "Stronger AB",
    content: "The AI job assessment opened my eyes to the skills I need to focus on. It's given me a clear path for professional development.",
    initials: "AJ",
    rating: 5
  },
  {
    name: "Mikael Rosenqvist",
    role: "Software Developer",
    company: "Samsung",
    content: "As a developer, I was skeptical about AI's impact on my job. This assessment provided valuable insights into future-proofing my career.",
    initials: "MR",
    rating: 5
  },
  {
    name: "August Pernvik",
    role: "CFO",
    company: "Iron Brothers",
    content: "The personalized recommendations were spot-on. I've already started implementing some of the suggested strategies in my role.",
    initials: "AP",
    rating: 5
  }
]

export default function TestimonialsSection() {
  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold text-center mb-10">
        What Our Users Say
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-start space-x-4">
              <Avatar>
                <AvatarFallback>{testimonial.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                <p className="text-sm text-muted-foreground">{testimonial.company}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{testimonial.content}</p>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}