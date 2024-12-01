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
    taskComplexityScore: number;
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
  
    // Incorporate AI-analyzed task complexity (weighted at 30% of the final score)
    const complexityImpact = (data.taskComplexityScore || 50) * 0.3;
    score -= complexityImpact;

    // Adjust for human interaction (weighted at 20%)
    score -= data.humanInteraction * 2 * 0.2;

    // Adjust for creativity (weighted at 20%)
    score -= data.creativityLevel * 2 * 0.2;

    // Adjust for decision making complexity (weighted at 20%)
    score -= data.decisionMaking * 2 * 0.2;

    // Adjust for number of tools used (weighted at 10%)
    score += data.toolsUsed.length * 3 * 0.1;

    // Ensure score stays within 0-100 range
    return Math.round(Math.max(0, Math.min(100, score)));
  }