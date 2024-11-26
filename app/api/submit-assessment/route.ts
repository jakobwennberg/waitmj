import { NextResponse } from 'next/server'

// Define the expected shape of the assessment data
interface AssessmentData {
  ageRange: string
  gender?: string
  educationLevel: string
  industry: string
  jobTitle: string
  yearsOfExperience: number
}

export async function POST(request: Request) {
  try {
    // Parse and validate the incoming data
    const assessmentData: AssessmentData = await request.json()
    
    // Validate required fields
    const requiredFields = ['ageRange', 'educationLevel', 'industry', 'jobTitle']
    const missingFields = requiredFields.filter(field => !assessmentData[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      }, { status: 400 })
    }

    // Store the data (in a real app, you'd save this to a database)
    // For now, we'll just generate an initial score based on the data
    const initialScore = calculateInitialScore(assessmentData)

    return NextResponse.json({
      success: true,
      message: 'Assessment submitted successfully',
      score: initialScore,
    }, { status: 200 })

  } catch (error) {
    console.error('Error processing assessment:', error)
    return NextResponse.json({
      success: false,
      message: 'Error processing assessment',
    }, { status: 500 })
  }
}

function calculateInitialScore(data: AssessmentData): number {
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
  return Math.max(0, Math.min(100, score))
}
