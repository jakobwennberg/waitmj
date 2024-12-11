// lib/langbase/documents.ts

/**
 * Interface for the query sent to Langbase
 */
export interface LangbaseQuery {
  industry: string;
  jobTitle: string;
  skills: string[];
  context?: {
    complexTasks?: string;
    humanInteraction?: number;
    creativityLevel?: number;
    decisionMaking?: number;
  };
}

/**
 * Interface for the raw response from Langbase API
 */
export interface LangbaseResponse {
  content: string;
  metadata?: Record<string, any>;
}

/**
 * Interface for a single insight section
 */
export interface InsightSection {
  content: string;
  summary?: string;
  metadata?: Record<string, any>;
}

/**
 * Interface for the processed insights after parsing Langbase response
 */
export interface ProcessedInsights {
  industryTrends: InsightSection[];
  automationData: InsightSection[];
  skillsInsights: InsightSection[];
}

/**
 * Interface for the recommendations generated from insights
 */
export interface Recommendations {
  strengths: string[];
  risks: string[];
  recommendations: string[];
}

/**
 * Interface for the job analysis data stored in Supabase
 */
export interface JobAnalysis {
  id: string;
  assessment_id: string;
  answers: Record<string, string>;
  job_score: number;
  analyzed_at?: string;
  ai_recommendations?: Recommendations;
  retrieved_insights?: ProcessedInsights;
}

/**
 * Interface for the assessment data stored in Supabase
 */
export interface Assessment {
  id: string;
  created_at: string;
  age_range: string;
  gender?: string;
  education_level: string;
  industry: string;
  job_title: string;
  years_of_exp?: number;
  initial_score: number;
}

/**
 * Type for the streaming response chunk from Langbase
 */
export interface StreamChunk {
  choices?: Array<{
    delta?: {
      content?: string;
    };
  }>;
  done?: boolean;
}

/**
 * Enum for risk levels based on job score
 */
export enum RiskLevel {
  MINIMAL = 'MINIMAL',
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH'
}

/**
 * Function to determine risk level from score
 */
export function getRiskLevel(score: number): RiskLevel {
  if (score <= 25) return RiskLevel.MINIMAL;
  if (score <= 50) return RiskLevel.LOW;
  if (score <= 75) return RiskLevel.MODERATE;
  return RiskLevel.HIGH;
}

/**
 * Function to get risk level description
 */
export function getRiskDescription(level: RiskLevel): string {
  switch (level) {
    case RiskLevel.MINIMAL:
      return "Your job demonstrates strong resistance to AI automation.";
    case RiskLevel.LOW:
      return "Your role shows resilience to automation. Continue developing your unique skills.";
    case RiskLevel.MODERATE:
      return "Your job has some automation potential. Consider upskilling in key areas.";
    case RiskLevel.HIGH:
      return "High Risk: Your role shows significant potential for AI automation. Immediate action recommended.";
  }
}

/**
 * Error class for Langbase-specific errors
 */
export class LangbaseError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'LangbaseError';
  }
}