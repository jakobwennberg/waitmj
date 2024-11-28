// app/submit-assessment/route.ts
import { calculateInitialScore } from '@/lib/scorecalculations'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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
    const assessmentData: AssessmentData = await request.json()
    
    // Transform the data to match your database schema
    const dbData = {
      age_range: assessmentData.ageRange,
      gender: assessmentData.gender,
      education_level: assessmentData.educationLevel,
      industry: assessmentData.industry,
      job_title: assessmentData.jobTitle,
      years_of_exp: assessmentData.yearsOfExperience,
      initial_score: calculateInitialScore(assessmentData) // Your existing calculation
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('assessments')
      .insert(dbData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Assessment submitted successfully',
      score: data.initial_score,
      assessmentId: data.id // Important: You'll need this for job analysis
    }, { status: 200 })

  } catch (error) {
    console.error('Error processing assessment:', error)
    return NextResponse.json({
      success: false,
      message: 'Error processing assessment',
    }, { status: 500 })
  }
}
