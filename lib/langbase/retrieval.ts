// lib/langbase/retrieval.ts

import { LANGBASE_API } from './config';

const MAX_RETRIES = 3;
const BASE_DELAY = 2000;

interface LangbaseQuery {
  industry?: string;
  jobTitle?: string;
  skills?: string[];
}

interface FormattedSection {
  title: string;
  bullets: string[];
}

interface ProcessedResponse {
  industryTrends: FormattedSection[];
  automationData: FormattedSection[];
  skillsInsights: FormattedSection[];
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function retrieveRelevantDocuments(query: LangbaseQuery): Promise<ProcessedResponse> {
  let attempt = 0;
  
  while (attempt < MAX_RETRIES) {
    try {
      if (attempt > 0) {
        const waitTime = BASE_DELAY * Math.pow(2, attempt - 1);
        console.log(`Waiting ${waitTime}ms before attempt ${attempt + 1} of ${MAX_RETRIES}`);
        await delay(waitTime);
      }

      const requestPayload = {
        messages: [
          {
            role: "user",
            content: `Analyze job automation risk with these details:
              Industry: ${query.industry}
              Job Title: ${query.jobTitle}
              Skills Profile: ${query.skills?.join(', ')}
              
              Provide a detailed analysis in the following format:
              
              1. Industry Trends:
              - Current technology adoption
              - Future predictions
              - Key market changes
              
              2. Automation Insights:
              - Automation risk factors
              - Areas of vulnerability
              - Technology impact
              
              3. Skills Recommendations:
              - Critical skills to develop
              - Emerging opportunities
              - Professional development paths`
          }
        ],
        stream: true
      };

      const response = await fetch(`${LANGBASE_API.baseUrl}/pipes/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LANGBASE_API.apiKey}`,
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        if (response.status === 429) {
          console.log('Rate limited, will retry...');
          attempt++;
          continue;
        }

        throw new Error(`Langbase API error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Unable to read response stream');
      }

      const decoder = new TextDecoder();
      let fullResponse = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(Boolean);

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const content = line.substring(6).trim();
              if (content === '[DONE]') continue;
              
              try {
                const json = JSON.parse(content);
                if (json.choices?.[0]?.delta?.content) {
                  fullResponse += json.choices[0].delta.content;
                }
              } catch (e) {
                if (!line.includes('[DONE]')) {
                  console.error('Error parsing JSON from chunk');
                }
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      // Split and clean the response
      const sections = fullResponse
        .split(/\d\.\s+/g)
        .filter(Boolean)
        .map(section => section.trim());

      if (sections.length < 3) {
        throw new Error('Incomplete response from Langbase');
      }

      const result: ProcessedResponse = {
        industryTrends: parseSection(sections[0]),
        automationData: parseSection(sections[1]),
        skillsInsights: parseSection(sections[2])
      };

      // Validate the response
      if (!result.industryTrends.length || !result.automationData.length || !result.skillsInsights.length) {
        throw new Error('Invalid response structure');
      }

      return result;

    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      
      if (attempt === MAX_RETRIES - 1) {
        throw error;
      }
      
      attempt++;
    }
  }

  throw new Error('Failed to get response after all retry attempts');
}

function parseSection(text: string): FormattedSection[] {
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('[') && !line.includes('Sources:'));

  const sections: FormattedSection[] = [];
  let currentSection: FormattedSection | null = null;

  for (const line of lines) {
    if (line.endsWith(':')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: line.replace(/^[*-]\s*|\s*:\s*$/g, ''),
        bullets: []
      };
    } else if (line.startsWith('-') && currentSection) {
      const bullet = line.substring(1)
        .trim()
        .replace(/^\*\*|\*\*$/g, '')
        .replace(/\[.*?\]/g, '')
        .trim();
      if (bullet) {
        currentSection.bullets.push(bullet);
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}