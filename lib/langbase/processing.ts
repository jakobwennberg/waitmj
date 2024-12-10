export const processingPipeline = {
    process: async (response: any) => {
      try {
        // Process the Langbase API response
        const content = response.content || response.response || '';
        const sections = content.split(/\d\.\s+/); // Split by numbered list
  
        return {
          industryTrends: sections[1] ? [{ content: sections[1].trim(), summary: sections[1].trim() }] : [],
          automationData: sections[2] ? [{ content: sections[2].trim(), summary: sections[2].trim() }] : [],
          skillsInsights: sections[3] ? [{ content: sections[3].trim(), summary: sections[3].trim() }] : []
        };
      } catch (error) {
        console.error('Error processing Langbase response:', error);
        return {
          industryTrends: [],
          automationData: [],
          skillsInsights: []
        };
      }
    }
  };