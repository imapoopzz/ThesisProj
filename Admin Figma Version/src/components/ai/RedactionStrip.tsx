import { Eye, EyeOff } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface RedactionStripProps {
  text: string;
  redactionSummary: {
    names: number;
    ids: number;
    addresses: number;
    phones?: number;
    emails?: number;
  };
  canViewOriginal?: boolean;
  onViewOriginal?: () => void;
  className?: string;
}

export function RedactionStrip({ 
  text, 
  redactionSummary, 
  canViewOriginal = false,
  onViewOriginal,
  className = ""
}: RedactionStripProps) {
  // Simulate redacted text with markers
  const renderRedactedText = (text: string) => {
    // Replace common patterns with redaction markers
    let redacted = text
      .replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, '[REDACTED: NAME]')
      .replace(/\b\d{4}-\d{4}-\d{4}\b/g, '[REDACTED: ID]')
      .replace(/\b\d{1,4} [A-Z][a-z]+ (Street|St|Avenue|Ave|Road|Rd)\b/g, '[REDACTED: ADDRESS]')
      .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[REDACTED: PHONE]')
      .replace(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, '[REDACTED: EMAIL]');

    // Split text and highlight redaction markers
    const parts = redacted.split(/(\[REDACTED: [^\]]+\])/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('[REDACTED:')) {
        return (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="destructive" className="mx-1 text-xs cursor-help">
                  {part}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redacted for privacy — view requires audit permission</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const getTotalRedactions = () => {
    const { names, ids, addresses, phones = 0, emails = 0 } = redactionSummary;
    return names + ids + addresses + phones + emails;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Redaction Summary */}
      <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center gap-2">
          <EyeOff className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">
            {getTotalRedactions()} items redacted for privacy
          </span>
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(redactionSummary).map(([type, count]) => 
            count > 0 && (
              <Badge key={type} variant="outline" className="text-xs">
                {count} {type}
              </Badge>
            )
          )}
          {canViewOriginal && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onViewOriginal}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors"
                  >
                    <Eye className="h-3 w-3" />
                    View original
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Requires audit permission and will be logged</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Redacted Text */}
      <div className="p-4 bg-gray-50 border rounded-lg">
        <div className="text-sm leading-relaxed">
          {renderRedactedText(text)}
        </div>
      </div>
    </div>
  );
}