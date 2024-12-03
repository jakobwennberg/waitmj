// app/api/submit-job-questions/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { calculateJobScore } from '@/lib/scorecalculations'

interface JobQuestionsData {
  assessmentId: string
  answers: Record<number, string>
}

export async function POST(request: Request) {
  try {
    const data: JobQuestionsData = await request.json()
    
    // Validate assessment ID and answers
    if (!data.assessmentId || !data.answers || Object.keys(data.answers).length !== 10) {
      return NextResponse.json({
        success: false,
        message: 'Invalid data provided'
      }, { status: 400 })
    }

    // Calculate job score based on answers
    const jobScore = calculateJobScore(data.answers)
    
    // Transform the data for database
    const dbData = {
      assessment_id: data.assessmentId,
      answers: data.answers,
      job_score: jobScore,
      submitted_at: new Date().toISOString()
    }

    // Insert into Supabase
    const { data: submissionData, error } = await supabase
      .from('job_responses')
      .insert(dbData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Job questions submitted successfully',
      score: jobScore
    }, { status: 200 })

  } catch (error) {
    console.error('Error processing job questions:', error)
    return NextResponse.json({
      success: false,
      message: 'Error processing job questions',
    }, { status: 500 })
  }
}