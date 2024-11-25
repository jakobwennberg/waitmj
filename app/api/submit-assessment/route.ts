import { NextResponse } from 'next/server'

// This is a mock function to calculate the replaceability score
// In a real application, this would likely be a more complex algorithm
function calculateReplaceabilityScore(assessmentData: any): number {
  // This is a simplified calculation for demonstration purposes
  const { 
    ageRange, 
    educationLevel, 
    industry, 
    yearsOfExperience, 
    complexTasks, 
    humanInteraction, 
    toolsUsed, 
    creativityLevel, 
    decisionMaking 
  } = assessmentData

  let score = 50 // Start with a base score

  // Adjust score based on education level
  if (educationLevel === 'phd') score -= 10
  else if (educationLevel === 'masters') score -= 5
  else if (educationLevel === 'bachelors') score -= 2

  // Adjust score based on years of experience
  score -= Math.min(yearsOfExperience, 20) / 2

  // Adjust score based on human interaction level
  score -= humanInteraction * 2

  // Adjust score based on creativity level
  score -= creativityLevel * 2

  // Adjust score based on decision making complexity
  score -= decisionMaking * 2

  // Adjust score based on number of tools used
  score += toolsUsed.length * 2

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score))
}

export async function POST(request: Request) {
  try {
    const assessmentData = await request.json()

    // Here you would typically validate the input data
    // For brevity, we're skipping detailed validation in this example

    // Calculate the replaceability score
    const replaceabilityScore = calculateReplaceabilityScore(assessmentData)

    // In a real application, you might want to save this data to a database
    // For now, we'll just return the calculated score

    return NextResponse.json({ 
      success: true, 
      score: replaceabilityScore,
      message: 'Assessment submitted successfully' 
    }, { status: 200 })

  } catch (error) {
    console.error('Error processing assessment:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Error processing assessment' 
    }, { status: 500 })
  }
}

