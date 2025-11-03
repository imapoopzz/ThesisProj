import { Check, X, Edit, Clock } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ProponentCardProps {
  proponent: {
    id: string;
    name: string;
    role: string;
    department: string;
    avatar?: string;
  };
  ticketId: string;
  memberPseudonym: string;
  suggestedResponse: string;
  dueDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'editing';
  onApprove?: () => void;
  onReject?: () => void;
  onEdit?: () => void;
  className?: string;
}

export function ProponentCard({
  proponent,
  ticketId,
  memberPseudonym,
  suggestedResponse,
  dueDate,
  status,
  onApprove,
  onReject,
  onEdit,
  className = ""
}: ProponentCardProps) {
  const getStatusBadge = () => {
    const variants = {
      pending: { variant: 'secondary' as const, label: 'Pending Review' },
      approved: { variant: 'default' as const, label: 'Approved' },
      rejected: { variant: 'destructive' as const, label: 'Rejected' },
      editing: { variant: 'outline' as const, label: 'In Edit' }
    };
    
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const isDueSoon = () => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24 && diffHours > 0;
  };

  const isOverdue = () => {
    const due = new Date(dueDate);
    const now = new Date();
    return due.getTime() < now.getTime();
  };

  return (
    <Card className={`${className} ${isOverdue() ? 'border-red-300' : isDueSoon() ? 'border-amber-300' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-sm">
                {proponent.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm">{proponent.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{proponent.role} • {proponent.department}</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ticket Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Ticket ID</p>
            <p className="font-mono">{ticketId}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Member</p>
            <p>{memberPseudonym}</p>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Due:</span>
          <span className={`font-medium ${isOverdue() ? 'text-red-600' : isDueSoon() ? 'text-amber-600' : ''}`}>
            {new Date(dueDate).toLocaleDateString()}
          </span>
          {(isOverdue() || isDueSoon()) && (
            <Badge variant={isOverdue() ? 'destructive' : 'secondary'} className="text-xs">
              {isOverdue() ? 'Overdue' : 'Due Soon'}
            </Badge>
          )}
        </div>

        {/* Suggested Response Preview */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Suggested Response</p>
          <div className="p-3 bg-gray-50 border rounded-lg">
            <p className="text-sm line-clamp-3">{suggestedResponse}</p>
          </div>
        </div>

        {/* Actions */}
        {status === 'pending' && (
          <div className="flex gap-2">
            <Button size="sm" onClick={onApprove} className="flex-1">
              <Check className="mr-1 h-3 w-3" />
              Approve
            </Button>
            <Button size="sm" variant="outline" onClick={onEdit} className="flex-1">
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={onReject}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {status === 'editing' && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              Continue Editing
            </Button>
          </div>
        )}

        {(status === 'approved' || status === 'rejected') && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {status === 'approved' ? 'Sent to Admin for final approval' : 'Response rejected'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}