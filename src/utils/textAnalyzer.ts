
// Sample issues for demonstration
const sampleIssues: Record<string, any[]> = {
  "en-us": [
    {
      id: "1",
      type: "grammar",
      message: "Subject-verb agreement error",
      text: "they was",
      position: 0,
      length: 8,
      suggestions: ["they were"],
      explanation: "Use 'were' with plural subjects like 'they'."
    },
    {
      id: "2",
      type: "style",
      message: "Passive voice detected",
      text: "mistakes were made",
      position: 0,
      length: 16,
      suggestions: ["I made mistakes", "We made mistakes"],
      explanation: "Active voice is generally clearer and more direct."
    },
    {
      id: "3",
      type: "clarity",
      message: "Wordy phrase",
      text: "in order to",
      position: 0,
      length: 10,
      suggestions: ["to"],
      explanation: "Simplify for clearer, more concise writing."
    },
    {
      id: "4",
      type: "grammar",
      message: "Missing comma in compound sentence",
      text: "I went to the store and I bought milk",
      position: 0,
      length: 35,
      suggestions: ["I went to the store, and I bought milk"],
      explanation: "Use a comma before coordinating conjunctions that join independent clauses."
    },
    {
      id: "5",
      type: "style",
      message: "Redundant phrase",
      text: "absolutely essential",
      position: 0,
      length: 19,
      suggestions: ["essential"],
      explanation: "'Essential' already means absolutely necessary."
    }
  ],
  "en-gb": [
    {
      id: "1",
      type: "grammar",
      message: "Incorrect spelling for UK English",
      text: "color",
      position: 0,
      length: 5,
      suggestions: ["colour"],
      explanation: "The British spelling uses 'ou' instead of 'o'."
    },
    {
      id: "2",
      type: "grammar",
      message: "Incorrect spelling for UK English",
      text: "organization",
      position: 0,
      length: 12,
      suggestions: ["organisation"],
      explanation: "The British spelling uses 's' instead of 'z'."
    }
  ],
  "es": [
    {
      id: "1",
      type: "grammar",
      message: "Error de concordancia de género",
      text: "el casa",
      position: 0,
      length: 7,
      suggestions: ["la casa"],
      explanation: "'Casa' es femenino y requiere el artículo 'la'."
    }
  ],
  "fr": [
    {
      id: "1",
      type: "grammar",
      message: "Erreur d'accord de genre",
      text: "le table",
      position: 0,
      length: 8,
      suggestions: ["la table"],
      explanation: "'Table' est féminin et nécessite l'article 'la'."
    }
  ]
};

// Default issues for languages without specific sample data
const defaultIssues = [
  {
    id: "default-1",
    type: "grammar",
    message: "Grammar issue detected",
    text: "Sample text",
    position: 0,
    length: 11,
    suggestions: ["Corrected sample text"],
    explanation: "Grammar rules specific to this language."
  },
  {
    id: "default-2",
    type: "style",
    message: "Style improvement suggested",
    text: "Sample text",
    position: 0,
    length: 11,
    suggestions: ["Better sample text"],
    explanation: "This alternative is more appropriate for formal writing."
  }
];

// Sample function to mimic text analysis
export const analyzeText = (text: string, language: string): any[] => {
  // If text is empty, return no issues
  if (!text.trim()) return [];

  // Get language-specific issues or default to English (US)
  const issueSet = sampleIssues[language] || sampleIssues["en-us"] || defaultIssues;
  
  const foundIssues: any[] = [];
  
  // Simple pattern matching for demo purposes
  issueSet.forEach(issue => {
    const lowerText = text.toLowerCase();
    const lowerIssueText = issue.text.toLowerCase();
    
    let position = lowerText.indexOf(lowerIssueText);
    while (position !== -1) {
      // Create a copy of the issue with updated position
      const newIssue = {
        ...issue,
        id: `${issue.id}-${position}`, // Make ID unique based on position
        position,
        text: text.substring(position, position + issue.length)
      };
      
      foundIssues.push(newIssue);
      position = lowerText.indexOf(lowerIssueText, position + 1);
    }
  });
  
  // If we have text but found no issues based on exact matches, add a random issue
  // This is just to make the demo more interactive
  if (foundIssues.length === 0 && text.length > 20) {
    // Pick a random position in the text for the issue
    const randomPosition = Math.floor(Math.random() * (text.length - 10));
    const randomLength = Math.min(Math.floor(Math.random() * 10) + 3, text.length - randomPosition);
    const randomText = text.substring(randomPosition, randomPosition + randomLength);
    
    // Pick a random issue type
    const types = ["grammar", "style", "clarity"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    // Pick a random message based on type
    let message = "Issue detected";
    let suggestion = `Suggested replacement for "${randomText}"`;
    
    if (randomType === "grammar") {
      message = "Possible grammar issue";
      suggestion = randomText.charAt(0).toUpperCase() + randomText.slice(1);
    } else if (randomType === "style") {
      message = "Style could be improved";
      suggestion = randomText + " (improved)";
    } else {
      message = "This could be clearer";
      suggestion = "Clearer " + randomText;
    }
    
    foundIssues.push({
      id: `random-${Date.now()}`,
      type: randomType,
      message,
      text: randomText,
      position: randomPosition,
      length: randomLength,
      suggestions: [suggestion],
      explanation: "This is a demonstration issue."
    });
  }
  
  return foundIssues;
};
