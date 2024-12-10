// lib/langbase/documents.ts
export interface LangbaseResponse {
    content: string;
    metadata?: Record<string, any>;
  }
  
  export interface ProcessedResponse {
    industryTrends: Array<{ content: string }>;
    automationData: Array<{ content: string }>;
    skillsInsights: Array<{ content: string }>;
  }