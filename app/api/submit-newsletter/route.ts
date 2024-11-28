// app/api/submit-newsletter/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface NewsletterData {
  email: string
  consent: boolean
}

export async function POST(request: Request) {
  try {
    const data: NewsletterData = await request.json()
    
    // Validate the incoming data
    if (!data.email || typeof data.consent !== 'boolean') {
      return NextResponse.json({
        success: false,
        message: 'Invalid data provided'
      }, { status: 400 })
    }

    console.log('Attempting to insert:', data) // Debug log

    const { data: subscription, error } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        email: data.email,
        consent: data.consent,
        created_at: new Date().toISOString() // Add created_at if it's in your schema
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error) // Debug log
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Newsletter subscription successful',
      data: subscription
    }, { status: 200 })

  } catch (error) {
    console.error('Error processing subscription:', error)
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Error processing subscription'
    }, { status: 500 })
  }
}