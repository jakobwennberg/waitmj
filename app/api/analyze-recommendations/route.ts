// app/api/analyze-recommendations/route.ts

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { retrieveRelevantDocuments } from '@/lib/langbase/retrieval'

interface RequestData {
  assessmentId: string;
}

enum RiskLevel {
  MINIMAL = 'MINIMAL',
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH'
}

function getRiskLevel(score: number): RiskLevel {
  if (score <= 25) return RiskLevel.MINIMAL
  if (score <= 50) return RiskLevel.LOW
  if (score <= 75) return RiskLevel.MODERATE
  return RiskLevel.HIGH
}

export async function POST(request: Request) {
  try {
    const { assessmentId }: RequestData = await request.json()

    if (!assessmentId) {
      return NextResponse.json({
        success: false,
        message: 'Assessment ID is required'
      }, { status: 400 })
    }

    // First check if we already have analyzed results
    const { data: existingJobResponse, error: existingError } = await supabase
      .from('job_responses')
      .select('*')
      .eq('assessment_id', assessmentId)
      .single()

    if (existingError) {
      return NextResponse.json({
        success: false,
        message: 'Failed to check existing analysis'
      }, { status: 500 })
    }

    // If we already have analysis results, return them
    if (existingJobResponse.retrieved_insights) {
      return NextResponse.json({
        success: true,
        score: existingJobResponse.job_score,
        recommendations: existingJobResponse.ai_recommendations,
        insights: existingJobResponse.retrieved_insights,
        riskLevel: getRiskLevel(existingJobResponse.job_score)
      })
    }

    // If not, fetch assessment data for new analysis
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single()

    if (assessmentError) {
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch assessment data'
      }, { status: 500 })
    }

    // Get Langbase insights
    const langbaseQuery = {
      industry: assessment.industry,
      jobTitle: assessment.job_title,
      skills: Object.values(existingJobResponse.answers || {})
        .filter((answer): answer is string => typeof answer === 'string')
    }

    const processedInsights = await retrieveRelevantDocuments(langbaseQuery)

    // Update job_responses with insights
    const { error: updateError } = await supabase
      .from('job_responses')
      .update({
        retrieved_insights: processedInsights,
        analyzed_at: new Date().toISOString()
      })
      .eq('id', existingJobResponse.id)

    if (updateError) {
      console.error('Error storing results:', updateError)
    }

    return NextResponse.json({
      success: true,
      score: existingJobResponse.job_score,
      insights: processedInsights,
      riskLevel: getRiskLevel(existingJobResponse.job_score)
    })

  } catch (error) {
    console.error('Error processing analysis:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Error processing analysis'
    }, { status: 500 })
  }
}