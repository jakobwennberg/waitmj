// lib/scorecalculations.ts

interface AssessmentData {
  ageRange: string
  gender?: string
  educationLevel: string
  industry: string
  jobTitle: string
}

export function calculateInitialScore(data: AssessmentData): number {
  let score = 50 // Base score

  // Adjust score based on education level
  const educationScores: Record<string, number> = {
    'high-school': 5,
    'bachelors': 0,
    'masters': -5,
    'phd': -10
  }
  score += educationScores[data.educationLevel] || 0

  // Adjust based on industry
  const industryScores: Record<string, number> = {
    'technology': -5,
    'healthcare': -10,
    'finance': 5,
    'retail': 15,
    'manufacturing': 10,
    'education': -5
  }
  score += industryScores[data.industry] || 0

  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, score))
}

// Add this to lib/scorecalculations.ts

export function calculateJobScore(answers: Record<number, string>): number {
  let score = 50 // Base score
  
  // Questions that increase AI replaceability if answered "yes"
  const replaceableIfYes = [1, 2, 7, 9] // Questions about routine tasks, data entry, existing tech, set procedures
  
  // Questions that decrease AI replaceability if answered "yes"
  const nonReplaceableIfYes = [3, 4, 5, 6, 8, 10] // Questions about creativity, human interaction, physical skills, etc.
  
  Object.entries(answers).forEach(([questionId, answer]) => {
    const id = parseInt(questionId)
    
    if (replaceableIfYes.includes(id)) {
      score += answer === 'yes' ? 5 : -5
    }
    
    if (nonReplaceableIfYes.includes(id)) {
      score += answer === 'yes' ? -5 : 5
    }
  })

  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, score))
}