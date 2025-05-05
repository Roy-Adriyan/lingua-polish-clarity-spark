
interface GeminiAnalysisResponse {
  issues: any[];
  suggestions: any[];
}

// For local development only - in production this should be handled through environment variables
// Replace this with your actual Gemini API key
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";

export const analyzeTextWithGemini = async (text: string, language: string): Promise<any[]> => {
  if (!text.trim()) {
    return [];
  }

  try {
    // Set up the API request
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze the following text for grammar, style, punctuation, capitalization, and clarity issues in ${language} language. 
                   Format your response as a JSON object with an array of issues. For each issue, include:
                   - id (a unique string)
                   - type (one of: "grammar", "style", "clarity", "punctuation", "capitalization")
                   - message (short description of the issue)
                   - text (the problematic text)
                   - position (number, where in the original text the issue occurs)
                   - length (number, the length of the problematic text)
                   - suggestions (array of strings with possible corrections)
                   
                   Here's the text to analyze: "${text}"`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024
        }
      })
    });

    if (!response.ok) {
      console.error('Gemini API error:', await response.text());
      return [];
    }

    const data = await response.json();
    
    // Extract JSON from the response text
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const responseText = data.candidates[0].content.parts[0].text;
      
      // Try to extract JSON from the response
      try {
        // Find JSON content in the response
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                        responseText.match(/\{[\s\S]*\}/);
                        
        if (jsonMatch) {
          const jsonStr = jsonMatch[1] || jsonMatch[0];
          const parsedResponse = JSON.parse(jsonStr);
          
          if (Array.isArray(parsedResponse.issues)) {
            return parsedResponse.issues;
          } else if (Array.isArray(parsedResponse)) {
            return parsedResponse;
          }
        }
      } catch (e) {
        console.error('Error parsing Gemini response:', e);
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return [];
  }
};
