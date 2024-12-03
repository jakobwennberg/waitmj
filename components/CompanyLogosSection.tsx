import { Card, CardContent } from "@/components/ui/card"

const companies = [
  {
    name: "TechCorp",
    employees: "500+",
    logo: "/api/placeholder/120/60"
  },
  {
    name: "InnovateX",
    employees: "1000+",
    logo: "/api/placeholder/120/60"
  },
  {
    name: "GlobalHR",
    employees: "750+",
    logo: "/api/placeholder/120/60"
  },
  {
    name: "FutureFinance",
    employees: "300+",
    logo: "/api/placeholder/120/60"
  },
  {
    name: "DataDriven",
    employees: "450+",
    logo: "/api/placeholder/120/60"
  }
]

export default function CompanyLogosSection() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Trusted by Professionals From
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          Join thousands of professionals from leading companies who have taken our assessment
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {companies.map((company, index) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="h-12 w-auto object-contain mb-2 grayscale group-hover:grayscale-0 transition-all"
                />
                <p className="text-sm font-medium text-center">{company.name}</p>
                <p className="text-xs text-muted-foreground text-center">
                  {company.employees} employees
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}