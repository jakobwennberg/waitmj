// app/api/analyze-recommendations/route.ts
import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { retrieveRelevantDocuments } from '@/lib/langbase/retrieval'
import { processingPipeline } from '@/lib/langbase/processing'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const { assessmentId } = await request.json()

    // Fetch assessment and job response data from Supabase
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single()

    if (assessmentError) throw assessmentError

    const { data: jobResponse, error: jobError } = await supabase
      .from('job_responses')
      .select('*')
      .eq('assessment_id', assessmentId)
      .single()

    if (jobError) throw jobError

    // Get relevant documents from Langbase
    const relevantDocs = await retrieveRelevantDocuments({
      industry: assessment.industry,
      jobTitle: assessment.job_title,
      skills: jobResponse.answers ? Object.values(jobResponse.answers) : undefined
    })

    // Process the documents
    const processedDocs = await processingPipeline.process(relevantDocs)

    // Extract key insights
    const industryTrends = processedDocs.industryTrends.map(doc => doc.content).join('\n')
    const automationInsights = processedDocs.automationData.map(doc => doc.content).join('\n')
    const skillsRecommendations = processedDocs.skillsInsights.map(doc => doc.content).join('\n')

    // Create enhanced prompt with Langbase insights
    const prompt = `
      Based on the following assessment data and retrieved insights, provide personalized career recommendations. 
      Format the response in JSON with sections for "strengths", "risks", and "recommendations".

      Assessment Data:
      - Industry: ${assessment.industry}
      - Job Title: ${assessment.job_title}
      - Education Level: ${assessment.education_level}
      - Job Score: ${jobResponse.job_score}
      - Answers to Key Questions: ${JSON.stringify(jobResponse.answers)}

      Retrieved Industry Trends:
      ${industryTrends}

      Automation Insights:
      ${automationInsights}

      Skills Recommendations:
      ${skillsRecommendations}

      Consider:
      1. Current job market trends and industry-specific changes
      2. AI impact on their specific role and industry
      3. Their demonstrated skills and experience
      4. Potential upskilling opportunities based on market demands
      5. Career transition possibilities if needed

      Return a JSON object with these keys:
      - strengths: Array of 3-4 key professional strengths based on their background and current market needs
      - risks: Array of 2-3 potential AI-related risks specific to their role
      - recommendations: Array of 4-5 specific actionable recommendations, including suggested skills to develop
    `

    // Get recommendations from OpenAI
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" }
    })

    const recommendations = JSON.parse(completion.choices[0].message.content || "{}")

    // Store everything in Supabase
    const { error: updateError } = await supabase
      .from('job_responses')
      .update({ 
        ai_recommendations: recommendations,
        retrieved_insights: {
          industry_trends: industryTrends,
          automation_insights: automationInsights,
          skills_recommendations: skillsRecommendations
        },
        analyzed_at: new Date().toISOString()
      })
      .eq('assessment_id', assessmentId)

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      score: jobResponse.job_score,
      recommendations,
      insights: {
        industryTrends,
        automationInsights,
        skillsRecommendations
      }
    })

  } catch (error) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json({
      success: false,
      message: 'Error generating recommendations'
    }, { status: 500 })
  }
}