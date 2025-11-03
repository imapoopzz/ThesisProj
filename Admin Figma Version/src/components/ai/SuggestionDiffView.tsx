import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface SuggestionDiffViewProps {
  aiSuggestion: string;
  proponentEdit: string;
  title?: string;
  showDiff?: boolean;
  className?: string;
}

export function SuggestionDiffView({
  aiSuggestion,
  proponentEdit,
  title = "Response Comparison",
  showDiff = true,
  className = ""
}: SuggestionDiffViewProps) {
  const [viewMode, setViewMode] = useState<'diff' | 'side-by-side'>('diff');
  
  // Simple diff implementation - highlights changes between two texts
  const generateDiff = (original: string, edited: string) => {
    const originalWords = original.split(/(\s+)/);
    const editedWords = edited.split(/(\s+)/);
    
    const diff = [];
    let i = 0, j = 0;
    
    while (i < originalWords.length || j < editedWords.length) {
      if (i >= originalWords.length) {
        // Remaining words are additions
        diff.push({ type: 'addition', text: editedWords[j] });
        j++;
      } else if (j >= editedWords.length) {
        // Remaining words are deletions
        diff.push({ type: 'deletion', text: originalWords[i] });
        i++;
      } else if (originalWords[i] === editedWords[j]) {
        // Words match
        diff.push({ type: 'unchanged', text: originalWords[i] });
        i++;
        j++;
      } else {
        // Look ahead to find matches
        let foundMatch = false;
        for (let k = j + 1; k < Math.min(j + 5, editedWords.length); k++) {
          if (originalWords[i] === editedWords[k]) {
            // Found a match - mark as addition
            for (let l = j; l < k; l++) {
              diff.push({ type: 'addition', text: editedWords[l] });
            }
            diff.push({ type: 'unchanged', text: originalWords[i] });
            i++;
            j = k + 1;
            foundMatch = true;
            break;
          }
        }
        
        if (!foundMatch) {
          // No match found, treat as substitution
          diff.push({ type: 'deletion', text: originalWords[i] });
          diff.push({ type: 'addition', text: editedWords[j] });
          i++;
          j++;
        }
      }
    }
    
    return diff;
  };

  const renderDiffText = () => {
    const diff = generateDiff(aiSuggestion, proponentEdit);
    
    return (
      <div className="text-sm leading-relaxed">
        {diff.map((item, index) => {
          switch (item.type) {
            case 'addition':
              return (
                <span key={index} className="bg-green-100 text-green-800 px-1 rounded">
                  {item.text}
                </span>
              );
            case 'deletion':
              return (
                <span key={index} className="bg-red-100 text-red-800 px-1 rounded line-through">
                  {item.text}
                </span>
              );
            default:
              return <span key={index}>{item.text}</span>;
          }
        })}
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {showDiff && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={viewMode === 'diff' ? 'default' : 'outline'}
                onClick={() => setViewMode('diff')}
              >
                <Eye className="mr-1 h-3 w-3" />
                Diff
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'side-by-side' ? 'default' : 'outline'}
                onClick={() => setViewMode('side-by-side')}
              >
                <EyeOff className="mr-1 h-3 w-3" />
                Side by Side
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'diff' && showDiff ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                <span>Added</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                <span>Removed</span>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50">
              {renderDiffText()}
            </div>
          </div>
        ) : (
          <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai">AI Suggestion</TabsTrigger>
              <TabsTrigger value="proponent">Proponent Edit</TabsTrigger>
            </TabsList>
            <TabsContent value="ai" className="space-y-3">
              <div className="p-4 border rounded-lg bg-blue-50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-700">Original AI Suggestion</span>
                </div>
                <p className="text-sm leading-relaxed">{aiSuggestion}</p>
              </div>
            </TabsContent>
            <TabsContent value="proponent" className="space-y-3">
              <div className="p-4 border rounded-lg bg-green-50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">Proponent Edit</span>
                </div>
                <p className="text-sm leading-relaxed">{proponentEdit}</p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}