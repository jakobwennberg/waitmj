// app/lib/scorecalculations.ts
interface AssessmentData {
    ageRange: string
    gender?: string
    educationLevel: string
    industry: string
    jobTitle: string
    yearsOfExperience: number
  }
  
  interface JobAnalysisData {
    complexTasks: string
    humanInteraction: number
    toolsUsed: string[]
    creativityLevel: number
    decisionMaking: number
    assessmentId: string
  }
  
  export function calculateInitialScore(data: AssessmentData): number {
    let score = 50 // Base score
  
    // Adjust score based on education level
    const educationScores = {
      'high-school': 0,
      'bachelors': -5,
      'masters': -10,
      'phd': -15,
    }
    score += educationScores[data.educationLevel] || 0
  
    // Adjust for years of experience
    score -= Math.min(data.yearsOfExperience, 20) / 2
  
    // Ensure score stays within 0-100 range
    return Math.round(Math.max(0, Math.min(100, score)))
  }
  
  export function calculateFinalScore(data: JobAnalysisData): number {
    let score = 50 // Base score
  
    // Adjust for human interaction
    score -= data.humanInteraction * 2
  
    // Adjust for creativity
    score -= data.creativityLevel * 2
  
    // Adjust for decision making complexity
    score -= data.decisionMaking * 2
  
    // Adjust for number of tools used
    score += data.toolsUsed.length * 3
  
    // Ensure score stays within 0-100 range
    return Math.round(Math.max(0, Math.min(100, score)))
  }