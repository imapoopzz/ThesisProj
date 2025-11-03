import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ConfidenceBarProps {
  confidence: number; // 0.0 to 1.0
  showNumeric?: boolean;
  size?: 'sm' | 'md' | 'lg';
  model?: string;
  className?: string;
}

export function ConfidenceBar({ 
  confidence, 
  showNumeric = true, 
  size = 'md', 
  model = "OpenAI GPT-4",
  className = "" 
}: ConfidenceBarProps) {
  const percentage = Math.round(confidence * 100);
  
  // Color thresholds: >=85% green, 60-84% amber, <60% red
  const getColor = () => {
    if (confidence >= 0.85) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getTextColor = () => {
    if (confidence >= 0.85) return 'text-green-700';
    if (confidence >= 0.6) return 'text-amber-700';
    return 'text-red-700';
  };

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      {showNumeric && (
        <span className={`${textSizeClasses[size]} font-medium ${getTextColor()}`}>
          {percentage}%
        </span>
      )}
      <div className={`flex-1 bg-gray-200 rounded-full ${sizeClasses[size]} min-w-16`}>
        <div 
          className={`${getColor()} ${sizeClasses[size]} rounded-full transition-all duration-300`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p>Confidence: {confidence.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Model: {model}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}