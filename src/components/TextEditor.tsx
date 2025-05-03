
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Copy, Check, SpellCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TextEditorProps {
  language: string;
  onTextChange: (text: string) => void;
  issues: any[];
  onApplySuggestion?: (id: string, replacement: string) => void;
}

const TextEditor = ({ language, onTextChange, issues, onApplySuggestion }: TextEditorProps) => {
  const [text, setText] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isApplyingHighlights, setIsApplyingHighlights] = useState(false);
  
  // Track if we're applying a suggestion to prevent re-analysis
  const [isApplyingSuggestion, setIsApplyingSuggestion] = useState(false);
  const [lastAppliedSuggestion, setLastAppliedSuggestion] = useState<string | null>(null);
  
  // Apply highlighting when issues change
  useEffect(() => {
    applyHighlighting();
  }, [issues]);

  // When text changes, notify parent
  useEffect(() => {
    if (!isApplyingHighlights && !isApplyingSuggestion) {
      onTextChange(text);
    }
  }, [text, isApplyingHighlights, isApplyingSuggestion]);

  const handleTextChange = (e: React.FormEvent<HTMLDivElement>) => {
    if (isApplyingHighlights || isApplyingSuggestion) return;
    
    const content = e.currentTarget.innerText;
    setText(content);
  };

  const handleClear = () => {
    setText("");
    if (editorRef.current) {
      editorRef.current.innerText = "";
    }
    onTextChange("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Text copied!",
      description: "The text has been copied to your clipboard.",
    });
  };

  // Method to apply a suggestion to the text
  const applySuggestion = (id: string, replacement: string) => {
    const issue = issues.find(i => i.id === id);
    if (!issue || !editorRef.current) return;
    
    try {
      setIsApplyingSuggestion(true);
      setLastAppliedSuggestion(id);
      
      const { position, length } = issue;
      if (position !== undefined && length !== undefined) {
        // For cases where we're adding something at the end (length = 0)
        const actualLength = length === 0 ? 0 : length;
        
        const before = text.substring(0, position);
        const after = text.substring(position + actualLength);
        const newText = before + replacement + after;
        
        // Update the text
        setText(newText);
        
        // Update the editor content
        editorRef.current.innerText = newText;
        
        // Notify parent component to update issues
        if (onApplySuggestion) {
          onApplySuggestion(id, replacement);
        }

        // Show toast confirmation
        toast({
          title: "Correction applied",
          description: `Fixed: "${issue.text}" → "${replacement}"`,
        });
      }
    } finally {
      // Ensure we reset this flag
      setTimeout(() => {
        setIsApplyingSuggestion(false);
        setLastAppliedSuggestion(null);
      }, 50);
    }
  };

  const applyHighlighting = () => {
    if (!editorRef.current || !text) return;

    try {
      setIsApplyingHighlights(true);
      
      // Store current cursor position
      const selection = window.getSelection();
      let cursorPosition = 0;
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (editorRef.current.contains(range.startContainer)) {
          cursorPosition = range.startOffset;
        }
      }

      // Create HTML with highlights
      let html = text;
      
      // Sort issues by their position in descending order to avoid position shifts
      const sortedIssues = [...issues].sort((a, b) => b.position - a.position);

      for (const issue of sortedIssues) {
        const { position, length, type, id } = issue;
        if (position !== undefined && length !== undefined && 
            position >= 0 && position + length <= html.length) {
          
          const before = html.substring(0, position);
          const highlight = html.substring(position, position + length);
          const after = html.substring(position + length);

          let className = "";
          if (type === "grammar") className = "grammar-error";
          else if (type === "style") className = "style-suggestion";
          else if (type === "clarity") className = "clarity-suggestion";
          else if (type === "punctuation") className = "punctuation-error";
          else if (type === "capitalization") className = "capitalization-error";

          html = `${before}<span class="${className}" data-issue-id="${id}" title="${issue.message}">${highlight}</span>${after}`;
        }
      }

      // Apply the HTML
      if (editorRef.current) {
        editorRef.current.innerHTML = html;
      }

      // Add click handlers to highlighted spans
      if (editorRef.current) {
        const spans = editorRef.current.querySelectorAll('span[data-issue-id]');
        spans.forEach(span => {
          span.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const issueId = span.getAttribute('data-issue-id');
            const issue = issues.find(i => i.id === issueId);
            if (issue && issue.suggestions && issue.suggestions.length > 0) {
              applySuggestion(issue.id, issue.suggestions[0]);
            }
          });
        });
      }

      // Restore cursor position
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        // Try to position cursor approximately where it was before
        const newPosition = Math.min(cursorPosition, editorRef.current.innerText.length);
        
        // Find the text node to place the cursor in
        const textNodes: Node[] = [];
        const findTextNodes = (node: Node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(node);
          } else {
            for (let i = 0; i < node.childNodes.length; i++) {
              findTextNodes(node.childNodes[i]);
            }
          }
        };
        
        findTextNodes(editorRef.current);
        
        if (textNodes.length > 0) {
          let currentLength = 0;
          let targetNode = textNodes[0];
          let targetOffset = newPosition;
          
          // Find the target text node and offset
          for (const node of textNodes) {
            if (currentLength + node.textContent!.length >= newPosition) {
              targetNode = node;
              targetOffset = newPosition - currentLength;
              break;
            }
            currentLength += node.textContent!.length;
          }
          
          // Set the cursor position
          range.setStart(targetNode, targetOffset);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    } finally {
      setIsApplyingHighlights(false);
    }
  };

  const correctAllIssues = () => {
    // Apply all suggestions in reverse order to avoid position shifting
    const sortedIssues = [...issues].sort((a, b) => b.position - a.position);
    
    sortedIssues.forEach(issue => {
      if (issue.suggestions && issue.suggestions.length > 0) {
        // Delay between applications to ensure they all apply correctly
        setTimeout(() => {
          applySuggestion(issue.id, issue.suggestions[0]);
        }, 0);
      }
    });
    
    toast({
      title: "Auto-correction complete",
      description: `Applied ${sortedIssues.length} corrections`,
    });
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-lg">Text Editor</h2>
        <div className="flex items-center space-x-2">
          {issues.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={correctAllIssues}
              className="flex items-center"
            >
              <SpellCheck className="w-4 h-4 mr-1" />
              Auto-correct All
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!text}
            className="flex items-center"
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={!text}
            className="flex items-center"
          >
            <Eraser className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>
      
      <div
        ref={editorRef}
        className="text-editor w-full focus:outline-none min-h-[300px]"
        contentEditable
        onInput={handleTextChange}
        spellCheck={false}
        data-placeholder="Start typing or paste your text here..."
      ></div>
      
      {!text && (
        <div className="absolute top-[60px] left-4 text-gray-400 pointer-events-none">
          Start typing or paste your text here...
        </div>
      )}
      
      <div className="mt-2 text-sm text-gray-500">
        {text ? (
          <div className="flex items-center justify-between">
            <div>
              {text.length} characters | {text.split(/\s+/).filter(Boolean).length} words
            </div>
            {issues.length > 0 ? (
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
                <span className="inline-flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-[hsl(var(--error))] mr-1"></span>
                  <span>
                    {issues.filter(i => i.type === "grammar").length} grammar
                  </span>
                </span>
                <span className="inline-flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-[hsl(var(--error))] mr-1"></span>
                  <span>
                    {issues.filter(i => i.type === "punctuation").length} punctuation
                  </span>
                </span>
                <span className="inline-flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-[hsl(var(--warning))] mr-1"></span>
                  <span>
                    {issues.filter(i => i.type === "capitalization").length} capitalization
                  </span>
                </span>
                <span className="inline-flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-[hsl(var(--warning))] mr-1"></span>
                  <span>
                    {issues.filter(i => i.type === "style").length} style
                  </span>
                </span>
                <span className="inline-flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-[hsl(var(--info))] mr-1"></span>
                  <span>
                    {issues.filter(i => i.type === "clarity").length} clarity
                  </span>
                </span>
              </div>
            ) : (
              <div className="flex items-center">
                <Check className="w-4 h-4 text-[hsl(var(--success))] mr-1" />
                <span className="text-[hsl(var(--success))]">No issues detected</span>
              </div>
            )}
          </div>
        ) : (
          "0 characters | 0 words"
        )}
      </div>
    </div>
  );
};

export default TextEditor;
