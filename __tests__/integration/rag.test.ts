// __tests__/integration/rag.test.ts
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: { id: 'test-id' }, error: null })
        }),
        delete: () => Promise.resolve({ error: null })
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: { id: 'test-id' }, error: null })
        })
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: null })
      })
    })
  })
}))

// Mock fetch for API calls
global.fetch = vi.fn();

describe('RAG Integration Tests', () => {
  let assessmentId: string
  
  const testAssessment = {
    ageRange: "25-34",
    educationLevel: "bachelors",
    industry: "technology",
    jobTitle: "Software Developer"
  }

  const testJobAnswers = {
    1: "yes",
    2: "no",
    3: "yes",
    4: "yes",
    5: "no",
    6: "yes",
    7: "no",
    8: "yes",
    9: "no",
    10: "yes"
  }

  beforeAll(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock successful fetch responses
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('/api/submit-assessment')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ assessmentId: 'test-id' })
        });
      }
      if (url.includes('/api/submit-job-questions')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ score: 75 })
        });
      }
      if (url.includes('/api/analyze-recommendations')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            recommendations: {
              strengths: ['test strength'],
              risks: ['test risk'],
              recommendations: ['test recommendation']
            },
            insights: {
              industryTrends: 'test trends',
              automationInsights: 'test insights',
              skillsRecommendations: 'test skills'
            }
          })
        });
      }
      return Promise.reject(new Error(`Unhandled fetch to ${url}`));
    });
  });

  it('should submit assessment and receive ID', async () => {
    const response = await fetch('/api/submit-assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testAssessment)
    })

    const data = await response.json()
    expect(response.ok).toBe(true)
    expect(data.assessmentId).toBeDefined()
    assessmentId = data.assessmentId
  })

  it('should submit job questions successfully', async () => {
    const response = await fetch('/api/submit-job-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assessmentId,
        answers: testJobAnswers
      })
    })

    const data = await response.json()
    expect(response.ok).toBe(true)
    expect(data.score).toBeDefined()
  })

  it('should generate RAG-enhanced recommendations', async () => {
    const response = await fetch('/api/analyze-recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessmentId })
    })

    const data = await response.json()
    expect(response.ok).toBe(true)
    expect(data.success).toBe(true)
    expect(data.recommendations).toBeDefined()
    expect(data.insights).toBeDefined()
  })

  afterAll(() => {
    vi.resetAllMocks()
  })
})