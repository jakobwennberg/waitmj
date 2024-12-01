// app/api/analyze-task-complexity/route.ts
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { taskDescription } = await request.json();

    if (!taskDescription) {
      return NextResponse.json(
        { error: 'Task description is required' },
        { status: 400 }
      );
    }

    const prompt = `
      Analyze the following job task description and rate its complexity on a scale of 1-100, where:
      1-20: Very simple, routine tasks requiring minimal skill
      21-40: Basic tasks requiring some training
      41-60: Moderately complex tasks requiring specialized knowledge
      61-80: Complex tasks requiring extensive expertise
      81-100: Highly complex tasks requiring exceptional expertise and judgment
      
      Consider factors like:
      - Technical complexity
      - Required decision-making
      - Number of variables to consider
      - Level of expertise needed
      - Potential impact of errors
      
      Task description: "${taskDescription}"
      
      Respond with only a number between 1 and 100.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 10
    });

    const complexityScore = parseInt(completion.choices[0].message.content || "50");

    // Ensure the score is within bounds
    const normalizedScore = Math.max(1, Math.min(100, complexityScore));

    return NextResponse.json({
      success: true,
      complexityScore: normalizedScore
    });

  } catch (error) {
    console.error('Error analyzing task complexity:', error);
    return NextResponse.json(
      { error: 'Error analyzing task complexity' },
      { status: 500 }
    );
  }
}