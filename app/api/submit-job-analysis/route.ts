import { calculateFinalScore } from '@/lib/scorecalculations'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface JobAnalysisData {
  complexTasks: string
  humanInteraction: number
  toolsUsed: string[]
  creativityLevel: number
  decisionMaking: number
  taskComplexityScore : number
  assessmentId: string
}

export async function POST(request: Request) {
  try {
    const jobData: JobAnalysisData = await request.json()

    // Verify assessment ID exists
    if (!jobData.assessmentId) {
      return NextResponse.json({
        success: false,
        message: 'Assessment ID is required',
      }, { status: 400 })
    }
    
    // Transform the data to match your database schema
    const dbData = {
      assessment_id: jobData.assessmentId,
      complex_tasks: jobData.complexTasks,
      human_interaction: jobData.humanInteraction,
      tools_used: jobData.toolsUsed,
      creativity_level: jobData.creativityLevel,
      decision_making: jobData.decisionMaking,
      ai_complexity_score: jobData.taskComplexityScore,
      final_score: calculateFinalScore(jobData) // Your existing calculation
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('job_analyses')
      .insert(dbData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Job analysis submitted successfully',
      score: data.final_score
    }, { status: 200 })

  } catch (error) {
    console.error('Error processing job analysis:', error)
    return NextResponse.json({
      success: false,
      message: 'Error processing job analysis',
    }, { status: 500 })
  }
}