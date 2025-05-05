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
  const [isApplyingSuggestion, setIsApplyingSuggestion] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<{ node: Node | null; offset: number } | null>(null);
  
  // Apply highlighting when issues change
  useEffect(() => {
    if (!isApplyingSuggestion && text) {
      applyHighlighting();
    }
  }, [issues, isApplyingSuggestion]);

  // When text changes, notify parent
  useEffect(() => {
    if (!isApplyingHighlights && !isApplyingSuggestion) {
      onTextChange(text);
    }
  }, [text, isApplyingHighlights, isApplyingSuggestion]);

  const handleTextChange = (e: React.FormEvent<HTMLDivElement>) => {
    if (isApplyingHighlights) return;
    
    // Save cursor position before updating text
    saveCursorPosition();
    
    const newText = e.currentTarget.innerText || "";
    setText(newText);
  };
  
  // Save the current cursor position
  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      if (editorRef.current.contains(range.startContainer)) {
        setCursorPosition({
          node: range.startContainer,
          offset: range.startOffset
        });
      }
    }
  };

  const handleClear = () => {
    setText("");
    if (editorRef.current) {
      editorRef.current.innerText = "";
    }
    onTextChange("");
    setCursorPosition(null);
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
      
      const { position, length } = issue;
      if (position !== undefined && length !== undefined) {
        const actualLength = length === 0 ? 0 : length;
        
        const before = text.substring(0, position);
        const after = text.substring(position + actualLength);
        const newText = before + replacement + after;
        
        setText(newText);
        editorRef.current.innerText = newText;
        
        if (onApplySuggestion) {
          onApplySuggestion(id, replacement);
        }

        toast({
          title: "Correction applied",
          description: `Fixed: "${issue.text}" → "${replacement}"`,
        });
        
        // After applying suggestion, set cursor to the end of the replacement
        setCursorPosition(null); // Reset saved position to prevent conflicts
      }
    } finally {
      setTimeout(() => {
        setIsApplyingSuggestion(false);
      }, 50);
    }
  };

  const applyHighlighting = () => {
    if (!editorRef.current || !text || isApplyingSuggestion) return;

    try {
      setIsApplyingHighlights(true);
      
      // Capture text content before modification to calculate accurate position mapping
      const plainText = text;
      
      // Create HTML with highlights
      let html = plainText;
      const sortedIssues = [...issues].sort((a, b) => b.position - a.position);

      for (const issue of sortedIssues) {
        const { position, length, type, id } = issue;
        if (position !== undefined && length !== undefined && 
            position >= 0 && position + length <= html.length) {
          
          const before = html.substring(0, position);
          const highlight = html.substring(position, position + length);
          const after = html.substring(position + length);

          let className = "";
          switch (type) {
            case "grammar": className = "grammar-error"; break;
            case "style": className = "style-suggestion"; break;
            case "clarity": className = "clarity-suggestion"; break;
            case "punctuation": className = "punctuation-error"; break;
            case "capitalization": className = "capitalization-error"; break;
          }

          html = `${before}<span class="${className}" data-issue-id="${id}" title="${issue.message}">${highlight}</span>${after}`;
        }
      }

      if (editorRef.current) {
        // Apply the new HTML
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
            if (issue?.suggestions?.length > 0) {
              applySuggestion(issue.id, issue.suggestions[0]);
            }
          });
        });
      }

      // Restore cursor position if we have one saved
      if (editorRef.current) {
        try {
          const selection = window.getSelection();
          if (selection) {
            // If we don't have a saved position or we can't restore it, just place cursor at the beginning
            if (!cursorPosition) {
              placeCursorAtBeginning();
              return;
            }
            
            const range = document.createRange();
            let textNode = findFirstTextNode(editorRef.current);
            
            if (textNode) {
              // Set to beginning of first text node as a reasonable default
              range.setStart(textNode, 0);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            } else {
              // Fallback if no text nodes
              placeCursorAtBeginning();
            }
          }
        } catch (error) {
          console.error("Error restoring cursor position:", error);
          // If restoring cursor fails, place it at the beginning as a fallback
          placeCursorAtBeginning();
        }
      }
    } finally {
      setIsApplyingHighlights(false);
    }
  };
  
  // Helper function to find the first text node in the editor
  const findFirstTextNode = (node: Node): Node | null => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node;
    }
    
    if (node.hasChildNodes()) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const found = findFirstTextNode(node.childNodes[i]);
        if (found) return found;
      }
    }
    
    return null;
  };
  
  // Place cursor at the beginning of the editor
  const placeCursorAtBeginning = () => {
    if (!editorRef.current) return;
    
    try {
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        
        if (editorRef.current.firstChild) {
          if (editorRef.current.firstChild.nodeType === Node.TEXT_NODE) {
            range.setStart(editorRef.current.firstChild, 0);
          } else {
            range.setStart(editorRef.current, 0);
          }
        } else {
          range.setStart(editorRef.current, 0);
        }
        
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } catch (error) {
      console.error("Error placing cursor:", error);
    }
  };

  const correctAllIssues = () => {
    if (issues.length === 0) return;
    
    const sortedIssues = [...issues].sort((a, b) => b.position - a.position);
    let count = 0;
    
    sortedIssues.forEach(issue => {
      if (issue.suggestions?.length > 0) {
        count++;
        setTimeout(() => {
          applySuggestion(issue.id, issue.suggestions[0]);
        }, 0);
      }
    });
    
    if (count > 0) {
      toast({
        title: "Auto-correction complete",
        description: `Applied ${count} corrections`,
      });
    }
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
        className="text-editor w-full p-4 border rounded-md min-h-[300px] focus:outline-none focus:ring-2 focus:ring-linguapolish-primary focus:border-transparent"
        contentEditable
        onInput={handleTextChange}
        spellCheck={false}
        data-placeholder="Start typing or paste your text here..."
      ></div>
      
      {!text && (
        <div className="absolute top-[60px] left-8 text-gray-400 pointer-events-none">
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
