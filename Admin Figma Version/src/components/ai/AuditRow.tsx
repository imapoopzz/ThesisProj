import { User, Bot, Eye, UserCheck, Settings } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface AuditRowProps {
  entry: {
    id: string;
    timestamp: string;
    actor: 'AI' | 'admin' | 'proponent' | 'system';
    actorName?: string;
    action: 'auto-assign' | 'override' | 'view-original' | 'model-call' | 'approve' | 'reject' | 'settings-change';
    ticketId?: string;
    reason?: string;
    metadata?: {
      confidence?: number;
      model?: string;
      assignedTo?: string;
      previousValue?: string;
      newValue?: string;
    };
  };
  onViewTicket?: (ticketId: string) => void;
  compact?: boolean;
  className?: string;
}

export function AuditRow({ entry, onViewTicket, compact = false, className = "" }: AuditRowProps) {
  const getActorIcon = () => {
    switch (entry.actor) {
      case 'AI':
        return <Bot className="h-4 w-4 text-blue-600" />;
      case 'admin':
        return <UserCheck className="h-4 w-4 text-green-600" />;
      case 'proponent':
        return <User className="h-4 w-4 text-purple-600" />;
      case 'system':
        return <Settings className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionDescription = () => {
    const { action, metadata, reason, ticketId, actorName } = entry;
    
    switch (action) {
      case 'auto-assign':
        return `auto-assigned Ticket: ${ticketId} to "${metadata?.assignedTo}" (confidence ${metadata?.confidence?.toFixed(2)})`;
      case 'override':
        return `overrode Ticket: ${ticketId} assignment to "${metadata?.assignedTo}"${reason ? ` — ${reason}` : ''}`;
      case 'view-original':
        return `viewed original content for Ticket: ${ticketId}${reason ? ` — ${reason}` : ''}`;
      case 'model-call':
        return `processed Ticket: ${ticketId} with ${metadata?.model} (confidence ${metadata?.confidence?.toFixed(2)})`;
      case 'approve':
        return `approved Ticket: ${ticketId}${reason ? ` — ${reason}` : ''}`;
      case 'reject':
        return `rejected Ticket: ${ticketId}${reason ? ` — ${reason}` : ''}`;
      case 'settings-change':
        return `changed ${metadata?.previousValue} to ${metadata?.newValue}`;
      default:
        return `performed ${action} on ${ticketId || 'system'}`;
    }
  };

  const getActionBadge = () => {
    const variants = {
      'auto-assign': 'default',
      'override': 'secondary',
      'view-original': 'outline',
      'model-call': 'secondary',
      'approve': 'default',
      'reject': 'destructive',
      'settings-change': 'outline'
    } as const;

    return (
      <Badge variant={variants[entry.action] || 'outline'} className="text-xs">
        {entry.action.replace('-', ' ')}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (compact) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-3 py-2 px-3 border-l-2 border-gray-200 hover:bg-gray-50 transition-colors ${className}`}>
        <div className="flex items-center gap-2 flex-shrink-0">
          {getActorIcon()}
          <span className="text-xs text-muted-foreground">{formatTimestamp(entry.timestamp)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate">
            <span className="font-medium">{entry.actorName || entry.actor}</span> {getActionDescription()}
          </p>
        </div>
        {entry.ticketId && onViewTicket && (
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onViewTicket(entry.ticketId!)}
            className="flex-shrink-0 h-6 px-2 text-xs"
          >
            View
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors ${className}`}>
      <div className="flex items-center gap-3 flex-shrink-0">
        {getActorIcon()}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">{formatTimestamp(entry.timestamp)}</p>
          {getActionBadge()}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-medium">{entry.actorName || entry.actor}</span> {getActionDescription()}
        </p>
        
        {entry.metadata && Object.keys(entry.metadata).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {entry.metadata.model && (
              <Badge variant="outline" className="text-xs">Model: {entry.metadata.model}</Badge>
            )}
            {entry.metadata.confidence && (
              <Badge variant="outline" className="text-xs">
                Confidence: {(entry.metadata.confidence * 100).toFixed(0)}%
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {entry.ticketId && onViewTicket && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onViewTicket(entry.ticketId!)}
          >
            <Eye className="mr-1 h-3 w-3" />
            View Ticket
          </Button>
        )}
      </div>
    </div>
  );
}