// app/api/submit-assessment/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { calculateInitialScore } from '@/lib/scorecalculations'

interface AssessmentData {
  ageRange: string
  gender?: string
  educationLevel: string
  industry: string
  jobTitle: string
}

export async function POST(request: Request) {
  try {
    const assessmentData: AssessmentData = await request.json()
    
    // Initial validation
    if (!assessmentData.ageRange || !assessmentData.educationLevel || 
        !assessmentData.industry || !assessmentData.jobTitle) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 })
    }
    
    // Transform the data to match your database schema
    const dbData = {
      age_range: assessmentData.ageRange,
      gender: assessmentData.gender,
      education_level: assessmentData.educationLevel,
      industry: assessmentData.industry,
      job_title: assessmentData.jobTitle,
      initial_score: calculateInitialScore(assessmentData),
      created_at: new Date().toISOString()
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('assessments')
      .insert(dbData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Assessment submitted successfully',
      assessmentId: data.id
    }, { status: 200 })

  } catch (error) {
    console.error('Error processing assessment:', error)
    return NextResponse.json({
      success: false,
      message: 'Error processing assessment',
    }, { status: 500 })
  }
}
