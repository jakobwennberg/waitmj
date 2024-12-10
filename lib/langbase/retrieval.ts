import { LANGBASE_API } from './config';

export async function retrieveRelevantDocuments(query: {
  industry?: string;
  jobTitle?: string;
  skills?: string[];
}) {
  try {
    const requestPayload = {
      messages: [
        {
          role: "user",
          content: `Analyze job automation risk with these details:
            Industry: ${query.industry}
            Job Title: ${query.jobTitle}
            Skills Profile: ${query.skills?.join(', ')}
            
            Please provide:
            1. Industry Trends
            2. Automation Insights
            3. Skills Recommendations`
        }
      ]
    };

    const url = `${LANGBASE_API.baseUrl}/pipes/run`;
    console.log('Making request to:', url);
    console.log('Making request with payload:', JSON.stringify(requestPayload, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LANGBASE_API.apiKey}`
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error(`Langbase API error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullResponse = '';

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const content = line.substring('data: '.length).trim();
            if (content === '[DONE]') continue;
            
            try {
              const json = JSON.parse(content);
              if (json.choices?.[0]?.delta?.content) {
                fullResponse += json.choices[0].delta.content;
              }
            } catch (e) {
              // Ignore parse errors for [DONE] messages
              if (!line.includes('[DONE]')) {
                console.error('Error parsing JSON from line:', line);
              }
            }
          }
        }
      }
    }

    console.log('Full response:', fullResponse);

    // Extract sections using regex
    const sections = fullResponse.split(/\d\.\s+\*\*[^:]+:\*\*/);
    
    // Remove any "Sources:" section at the end
    const cleanSections = sections
      .map(section => section.trim())
      .filter(section => section && !section.startsWith('Sources:'));

    return {
      industryTrends: [cleanSections[1] || ''],
      automationData: [cleanSections[2] || ''],
      skillsInsights: [cleanSections[3] || '']
    };

  } catch (error) {
    console.error('Error retrieving documents from Langbase:', error);
    return {
      industryTrends: [],
      automationData: [],
      skillsInsights: []
    };
  }
}