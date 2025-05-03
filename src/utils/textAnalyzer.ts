
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
    },
    {
      id: "6",
      type: "punctuation",
      message: "Missing period at end of sentence",
      text: "The report is due tomorrow",
      position: 0,
      length: 25,
      suggestions: ["The report is due tomorrow."],
      explanation: "Sentences should end with proper punctuation."
    },
    {
      id: "7",
      type: "punctuation",
      message: "Missing question mark",
      text: "Where did you go",
      position: 0,
      length: 15,
      suggestions: ["Where did you go?"],
      explanation: "Questions should end with a question mark."
    },
    {
      id: "8",
      type: "capitalization",
      message: "Sentence should begin with a capital letter",
      text: "this is important",
      position: 0,
      length: 16,
      suggestions: ["This is important"],
      explanation: "Sentences should begin with a capital letter."
    },
    {
      id: "9",
      type: "capitalization",
      message: "Proper noun should be capitalized",
      text: "we visited london",
      position: 0,
      length: 17,
      suggestions: ["We visited London"],
      explanation: "Proper nouns like city names should be capitalized."
    },
    {
      id: "10",
      type: "grammar",
      message: "Double negative",
      text: "don't have no",
      position: 0,
      length: 12,
      suggestions: ["don't have any", "have no"],
      explanation: "Double negatives create confusion. Use a single negative for clarity."
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

// Text patterns to check for common issues
const commonErrors = {
  punctuation: [
    { pattern: /\w+$/, message: "Missing end punctuation", fix: (match: string) => `${match}.` },
    { pattern: /\w+\s+$/, message: "Missing end punctuation", fix: (match: string) => `${match.trim()}.` },
    { pattern: /(\w+)\s(\w+)\s*$/, message: "Missing end punctuation", fix: (match: string) => `${match.trim()}.` },
    { pattern: /\w+\?/, message: "Space before question mark", fix: (match: string) => match.replace('?', ' ?') }
  ],
  capitalization: [
    { pattern: /^[a-z]/, message: "Sentence should start with capital letter", fix: (match: string) => match.charAt(0).toUpperCase() + match.slice(1) },
    { pattern: /\.\s+[a-z]/, message: "New sentence should start with capital letter", fix: (match: string) => match.replace(/\.\s+[a-z]/, (s) => s.replace(/[a-z]/, (c) => c.toUpperCase())) }
  ],
  grammar: [
    { pattern: /they was/i, message: "Subject-verb agreement error", fix: () => "they were" },
    { pattern: /i is/i, message: "Subject-verb agreement error", fix: () => "I am" },
    { pattern: /you is/i, message: "Subject-verb agreement error", fix: () => "you are" }
  ]
};

// Enhanced text analysis function
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
      // Make sure we're not adding duplicate issues for the same text position
      if (!foundIssues.some(i => i.position === position && i.length === issue.text.length)) {
        // Create a copy of the issue with updated position
        const actualText = text.substring(position, position + issue.text.length);
        const newIssue = {
          ...issue,
          id: `${issue.id}-${position}`, // Make ID unique based on position
          position,
          length: issue.text.length,
          text: actualText // Use actual case from the text
        };
        
        foundIssues.push(newIssue);
      }
      position = lowerText.indexOf(lowerIssueText, position + 1);
    }
  });
  
  // Check for punctuation, capitalization, and grammar issues
  if (text.length > 3) {
    // Check for sentences without proper ending punctuation
    const sentences = text.split(/(?<=[.!?])\s+/);
    sentences.forEach((sentence, index) => {
      if (sentence.length > 0) {
        // Check for capitalization at start of sentence
        if (/^[a-z]/.test(sentence)) {
          const position = sentences.slice(0, index).join(' ').length + (index > 0 ? 1 : 0);
          foundIssues.push({
            id: `cap-${position}`,
            type: "capitalization",
            message: "Sentence should begin with a capital letter",
            text: sentence.substring(0, Math.min(20, sentence.length)),
            position: position,
            length: 1,
            suggestions: [sentence.charAt(0).toUpperCase() + sentence.slice(1)]
          });
        }
        
        // Check for missing punctuation at end of sentence
        const lastChar = sentence.trim().slice(-1);
        if (!/[.!?]/.test(lastChar) && sentence.trim().length > 0) {
          const position = text.indexOf(sentence) + sentence.length - 1;
          foundIssues.push({
            id: `punc-${position}`,
            type: "punctuation",
            message: "Missing end punctuation",
            text: sentence.substring(Math.max(0, sentence.length - 20)),
            position: position,
            length: 0,
            suggestions: [sentence.trim() + "."]
          });
        }
      }
    });
  }
  
  // If we have text but found no issues based on exact matches, add a random issue
  // This is just to make the demo more interactive
  if (foundIssues.length === 0 && text.length > 20) {
    // Create a more realistic random issue
    const randomSentenceStart = text.indexOf(' ');
    const randomWordBoundaries = [];
    
    // Find word boundaries to place realistic issues
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ' ' && i > 0 && i < text.length - 1) {
        randomWordBoundaries.push(i + 1);
      }
    }
    
    if (randomWordBoundaries.length > 0) {
      const randomPosition = randomWordBoundaries[Math.floor(Math.random() * randomWordBoundaries.length)];
      const nextSpacePos = text.indexOf(' ', randomPosition);
      const randomLength = nextSpacePos > randomPosition ? nextSpacePos - randomPosition : 5;
      const randomText = text.substring(randomPosition, randomPosition + randomLength);
      
      // Pick a random issue type with proper weighting
      const types = ["grammar", "punctuation", "capitalization", "style", "clarity"];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      let message = "Issue detected";
      let suggestion = `Suggested replacement for "${randomText}"`;
      
      if (randomType === "grammar") {
        message = "Possible grammar issue";
        suggestion = randomText.charAt(0).toUpperCase() + randomText.slice(1);
      } else if (randomType === "punctuation") {
        message = "Punctuation could be improved";
        suggestion = randomText + ".";
      } else if (randomType === "capitalization") {
        message = "Consider capitalizing this term";
        suggestion = randomText.charAt(0).toUpperCase() + randomText.slice(1);
      } else if (randomType === "style") {
        message = "Style could be improved";
        suggestion = randomText + " (improved wording)";
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
  }
  
  return foundIssues;
};
