
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeText } from "@/utils/textAnalyzer";

interface TextEditorProps {
  language: string;
}

const TextEditor = ({ language }: TextEditorProps) => {
  const [text, setText] = useState("");
  const [issues, setIssues] = useState<any[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (text) {
      const analysisResults = analyzeText(text, language);
      setIssues(analysisResults);
    } else {
      setIssues([]);
    }
  }, [text, language]);

  const handleTextChange = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerText;
    setText(content);
  };

  const handleClear = () => {
    setText("");
    if (editorRef.current) {
      editorRef.current.innerText = "";
    }
    setIssues([]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Text copied!",
      description: "The text has been copied to your clipboard.",
    });
  };

  const applyHighlighting = () => {
    if (!editorRef.current || !text) return;

    const content = editorRef.current.innerText;
    let html = content;

    // Sort issues by their position in descending order to avoid position shifts
    const sortedIssues = [...issues].sort((a, b) => b.position - a.position);

    for (const issue of sortedIssues) {
      const { position, length, type } = issue;
      const before = html.substring(0, position);
      const highlight = html.substring(position, position + length);
      const after = html.substring(position + length);

      let className = "";
      if (type === "grammar") className = "grammar-error";
      else if (type === "style") className = "style-suggestion";
      else if (type === "clarity") className = "clarity-suggestion";

      html = `${before}<span class="${className}" data-issue-id="${issue.id}">${highlight}</span>${after}`;
    }

    // Set the HTML content
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const innerText = tempDiv.innerText;

    if (innerText === text) {
      editorRef.current.innerHTML = html;
    }
  };

  useEffect(() => {
    applyHighlighting();
  }, [issues]);

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-lg">Text Editor</h2>
        <div className="flex items-center space-x-2">
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
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-error mr-1"></span>
                <span className="mr-3">
                  {issues.filter(i => i.type === "grammar").length} grammar
                </span>
                <span className="inline-block w-3 h-3 rounded-full bg-warning mr-1"></span>
                <span className="mr-3">
                  {issues.filter(i => i.type === "style").length} style
                </span>
                <span className="inline-block w-3 h-3 rounded-full bg-info mr-1"></span>
                <span>
                  {issues.filter(i => i.type === "clarity").length} clarity
                </span>
              </div>
            ) : (
              <div className="flex items-center">
                <Check className="w-4 h-4 text-success mr-1" />
                <span className="text-success">No issues detected</span>
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
