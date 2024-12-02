// app/api/analyze-recommendations/route.ts
import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { assessmentId } = await request.json();

    // Fetch assessment and job analysis data from Supabase
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single();

    if (assessmentError) throw assessmentError;

    const { data: jobAnalysis, error: jobAnalysisError } = await supabase
      .from('job_analyses')
      .select('*')
      .eq('assessment_id', assessmentId)
      .single();

    if (jobAnalysisError) throw jobAnalysisError;

    const prompt = `
      Based on the following assessment data, provide personalized career recommendations. 
      Format the response in JSON with sections for "strengths", "risks", and "recommendations".

      Assessment Data:
      - Industry: ${assessment.industry}
      - Job Title: ${assessment.job_title}
      - Years of Experience: ${assessment.years_of_exp}
      - Education Level: ${assessment.education_level}
      - Complex Tasks: ${jobAnalysis.complex_tasks}
      - AI Complexity Score: ${jobAnalysis.ai_complexity_score}
      - Human Interaction Level: ${jobAnalysis.human_interaction}
      - Tools Used: ${jobAnalysis.tools_used.join(', ')}
      - Creativity Level: ${jobAnalysis.creativity_level}
      - Decision Making Level: ${jobAnalysis.decision_making}
      - Final Score: ${jobAnalysis.final_score}

      Consider:
      1. Current job market trends
      2. AI impact on their industry
      3. Their demonstrated skills and experience
      4. Potential upskilling opportunities
      5. Career transition possibilities if needed

      Return a JSON object with these keys:
      - strengths: Array of 3-4 key professional strengths
      - risks: Array of 2-3 potential AI-related risks to their role
      - recommendations: Array of 4-5 specific actionable recommendations
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const recommendations = JSON.parse(completion.choices[0].message.content || "{}");

    // Store recommendations in Supabase
    const { error: updateError } = await supabase
      .from('job_analyses')
      .update({ ai_recommendations: recommendations })
      .eq('assessment_id', assessmentId);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      recommendations
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json({
      success: false,
      message: 'Error generating recommendations'
    }, { status: 500 });
  }
}