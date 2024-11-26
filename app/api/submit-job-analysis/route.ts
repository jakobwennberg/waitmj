import { NextResponse } from 'next/server'

interface JobAnalysisData {
  complexTasks: string
  humanInteraction: number
  toolsUsed: string[]
  creativityLevel: number
  decisionMaking: number
}

export async function POST(request: Request) {
  try {
    const jobData: JobAnalysisData = await request.json()
    
    // Validate required fields
    const requiredFields = ['complexTasks', 'humanInteraction', 'toolsUsed', 'creativityLevel', 'decisionMaking']
    const missingFields = requiredFields.filter(field => !jobData[field] && jobData[field] !== 0)
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      }, { status: 400 })
    }

    // Calculate final score combining initial assessment and job analysis
    const finalScore = calculateFinalScore(jobData)

    return NextResponse.json({
      success: true,
      message: 'Job analysis submitted successfully',
      score: finalScore,
    }, { status: 200 })

  } catch (error) {
    console.error('Error processing job analysis:', error)
    return NextResponse.json({
      success: false,
      message: 'Error processing job analysis',
    }, { status: 500 })
  }
}

function calculateFinalScore(data: JobAnalysisData): number {
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
  return Math.max(0, Math.min(100, score))
}