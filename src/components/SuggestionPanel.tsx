
import { Button } from "@/components/ui/button";
import { Check, X, AlertCircle, AlertTriangle, Info, MessageCircle } from "lucide-react";

interface SuggestionProps {
  issues: any[];
  onApplySuggestion: (id: string, replacement: string) => void;
  onDismissSuggestion: (id: string) => void;
}

const SuggestionPanel = ({
  issues,
  onApplySuggestion,
  onDismissSuggestion,
}: SuggestionProps) => {
  if (issues.length === 0) {
    return (
      <div className="border rounded-lg p-6 text-center">
        <MessageCircle className="w-12 h-12 text-linguapolish-light mx-auto mb-3" />
        <h3 className="text-lg font-medium mb-2">No Suggestions</h3>
        <p className="text-gray-500">
          Type or paste text in the editor to receive suggestions.
        </p>
      </div>
    );
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "grammar":
        return <AlertCircle className="w-5 h-5 text-[hsl(var(--error))]" />;
      case "style":
        return <AlertTriangle className="w-5 h-5 text-[hsl(var(--warning))]" />;
      case "clarity":
        return <Info className="w-5 h-5 text-[hsl(var(--info))]" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getCardClass = (type: string) => {
    switch (type) {
      case "grammar":
        return "suggestion-card error";
      case "style":
        return "suggestion-card warning";
      case "clarity":
        return "suggestion-card info";
      default:
        return "suggestion-card";
    }
  };

  const getIssueName = (type: string) => {
    switch (type) {
      case "grammar":
        return "Grammar Issue";
      case "style":
        return "Style Suggestion";
      case "clarity":
        return "Clarity Improvement";
      default:
        return "Suggestion";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg mb-4">Suggestions ({issues.length})</h2>
      
      <div className="space-y-4 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
        {issues.map((issue) => (
          <div key={issue.id} className={getCardClass(issue.type)}>
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                {getIssueIcon(issue.type)}
                <div className="ml-3">
                  <h4 className="font-medium">{getIssueName(issue.type)}</h4>
                  <p className="text-sm text-gray-600 mt-1">{issue.message}</p>
                </div>
              </div>
            </div>
            
            {issue.suggestions && issue.suggestions.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Suggestion:</p>
                <div className="bg-linguapolish-light/30 rounded p-2 text-sm">
                  {issue.suggestions[0]}
                </div>
              </div>
            )}
            
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDismissSuggestion(issue.id)}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Dismiss
              </Button>
              {issue.suggestions && issue.suggestions.length > 0 && (
                <Button
                  size="sm"
                  onClick={() => onApplySuggestion(issue.id, issue.suggestions[0])}
                  className="text-xs bg-linguapolish-primary hover:bg-linguapolish-secondary"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Apply
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionPanel;
