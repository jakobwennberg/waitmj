import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: "Alice Jönsson",
    role: "Marketing Project Lead",
    company: "Stronger AB",
    content: "The AI job assessment opened my eyes to the skills I need to focus on. It's given me a clear path for professional development.",
    avatar: "/api/placeholder/40/40",
    rating: 5
  },
  {
    name: "Mikael Rosenqvist",
    role: "Software Developer",
    company: "Samsung",
    content: "As a developer, I was skeptical about AI's impact on my job. This assessment provided valuable insights into future-proofing my career.",
    avatar: "/api/placeholder/40/40",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "HR Specialist",
    company: "AstraZeneca",
    content: "The personalized recommendations were spot-on. I've already started implementing some of the suggested strategies in my role.",
    avatar: "/api/placeholder/40/40",
    rating: 5
  }
]

export default function TestimonialsSection() {
  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          What Our Users Say
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-background">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{testimonial.content}</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
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
      </div>
    </section>
  )
}