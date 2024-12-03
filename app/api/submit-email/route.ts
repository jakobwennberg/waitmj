// app/api/submit-email/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface EmailSubmissionData {
  assessmentId: string
  email: string
  consent: boolean
}

export async function POST(request: Request) {
  try {
    const data: EmailSubmissionData = await request.json()
    
    // Validate inputs
    if (!data.assessmentId || !data.email || !data.consent) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email format'
      }, { status: 400 })
    }

    // Transform the data for database
    const dbData = {
      assessment_id: data.assessmentId,
      email: data.email,
      has_consent: data.consent,
      subscribed_at: new Date().toISOString()
    }

    // Insert into Supabase
    const { error } = await supabase
      .from('email_subscriptions')
      .insert(dbData)

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Email subscription successful'
    }, { status: 200 })

  } catch (error) {
    console.error('Error processing email subscription:', error)
    return NextResponse.json({
      success: false,
      message: 'Error processing email subscription'
    }, { status: 500 })
  }
}