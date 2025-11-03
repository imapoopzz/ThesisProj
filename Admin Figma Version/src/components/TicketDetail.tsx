import { useState } from 'react';
import { X, Eye, EyeOff, Download, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, Send, UserX } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { AIBadge } from './ai/AIBadge';
import { ConfidenceBar } from './ai/ConfidenceBar';
import { RedactionStrip } from './ai/RedactionStrip';
import { AuditRow } from './ai/AuditRow';
import { mockAuditEntries, type AITicket } from './ai/mock-ai-data';

interface TicketDetailProps {
  ticket: AITicket;
  onClose: () => void;
  onAcceptSuggestion: (ticketId: string, assignee: string) => void;
  onOverride: (ticketId: string, assignee: string, reason: string) => void;
  onSendToProponent: (ticketId: string) => void;
}

export function TicketDetail({
  ticket,
  onClose,
  onAcceptSuggestion,
  onOverride,
  onSendToProponent
}: TicketDetailProps) {
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [overrideAssignee, setOverrideAssignee] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [showDetailedReasoning, setShowDetailedReasoning] = useState(false);
  const [showAuditConfirm, setShowAuditConfirm] = useState(false);
  const [auditReason, setAuditReason] = useState('');

  const handleAcceptSuggestion = () => {
    onAcceptSuggestion(ticket.ticketId, ticket.suggestion.suggestedAssignee);
  };

  const handleOverrideSubmit = () => {
    if (!overrideAssignee || !overrideReason.trim() || overrideReason.length < 10) {
      return;
    }
    onOverride(ticket.ticketId, overrideAssignee, overrideReason);
    setShowOverrideForm(false);
  };

  const handleViewOriginal = () => {
    if (!auditReason.trim()) {
      return;
    }
    // Log audit entry and show original content
    console.log('Viewing original content:', ticket.ticketId, auditReason);
    setShowAuditConfirm(false);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'auto-resolved': { variant: 'outline' as const, label: 'Auto-Resolved' },
      'auto-assigned': { variant: 'default' as const, label: 'Auto-Assigned' },
      'needs-assignment': { variant: 'secondary' as const, label: 'Needs Assignment' },
      'in-progress': { variant: 'outline' as const, label: 'In Progress' },
      'resolved': { variant: 'default' as const, label: 'Resolved' },
      'review_required': { variant: 'secondary' as const, label: 'Review Required' },
      'pending': { variant: 'outline' as const, label: 'Pending' },
      'approved': { variant: 'default' as const, label: 'Approved' },
      'rejected': { variant: 'destructive' as const, label: 'Rejected' }
    };
    
    const config = variants[status as keyof typeof variants];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const ticketAuditEntries = mockAuditEntries.filter(entry => entry.ticketId === ticket.ticketId);

  const renderStatusSpecificContent = () => {
    switch (ticket.status) {
      case 'auto-resolved':
        return (
          <div className="space-y-4">
            <h3 className="font-medium">AI Auto-Response</h3>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Status:</strong> Automatically resolved by AI system
              </p>
              <p className="text-sm text-green-700 mt-2">
                {ticket.aiResponse || 'Standard FAQ response provided to member.'}
              </p>
            </div>
          </div>
        );

      case 'auto-assigned':
      case 'needs-assignment':
        return (
          <div className="space-y-4">
            <h3 className="font-medium">AI Draft Response</h3>
            {ticket.aiDraft && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">Proposed Message to Department:</p>
                <p className="text-sm text-blue-700">{ticket.aiDraft}</p>
              </div>
            )}
            
            {ticket.suggestedResponse && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-medium text-amber-800 mb-2">Suggested Response for Department:</p>
                <p className="text-sm text-amber-700">{ticket.suggestedResponse}</p>
              </div>
            )}
          </div>
        );

      case 'in-progress':
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Progress Details</h3>
            {ticket.progressDetails && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-blue-800">Status:</p>
                    <p className="text-blue-700">{ticket.progressDetails.status}</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">Assigned By:</p>
                    <p className="text-blue-700">{ticket.progressDetails.assignedBy}</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">Next Action:</p>
                    <p className="text-blue-700">{ticket.progressDetails.nextAction}</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">Est. Completion:</p>
                    <p className="text-blue-700">
                      {new Date(ticket.progressDetails.estimatedCompletion).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Progress Notes:</p>
                  <p className="text-blue-700">{ticket.progressDetails.notes}</p>
                </div>
                <div className="text-xs text-blue-600">
                  Last updated: {new Date(ticket.progressDetails.lastUpdate).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        );

      case 'resolved':
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Resolution Details</h3>
            {ticket.resolutionDetails && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-green-800">Resolved By:</p>
                    <p className="text-green-700">{ticket.resolutionDetails.resolvedBy}</p>
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Resolution Date:</p>
                    <p className="text-green-700">
                      {new Date(ticket.resolutionDetails.resolutionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Final Action:</p>
                    <p className="text-green-700">{ticket.resolutionDetails.finalAction}</p>
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Member Notified:</p>
                    <p className="text-green-700">
                      {ticket.resolutionDetails.memberNotified ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-green-800">Outcome:</p>
                  <p className="text-green-700">{ticket.resolutionDetails.outcome}</p>
                </div>
                {ticket.resolutionDetails.followUpRequired && (
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm font-medium text-yellow-800">Follow-up Required</p>
                  </div>
                )}
                <div>
                  <p className="font-medium text-green-800">Resolution Notes:</p>
                  <p className="text-green-700">{ticket.resolutionDetails.notes}</p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <DialogTitle>{ticket.ticketId}</DialogTitle>
              <DialogDescription className="sr-only">
                Ticket details for {ticket.title} - {ticket.memberName}
              </DialogDescription>
              {getStatusBadge(ticket.status)}
              <Badge variant="outline">Source: {ticket.source}</Badge>
              <Badge variant={ticket.consentGiven ? 'default' : 'destructive'}>
                Consent: {ticket.consentGiven ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {new Date(ticket.submittedDate).toLocaleString()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAuditConfirm(true)}
                disabled={!ticket.consentGiven}
              >
                <Eye className="mr-1 h-3 w-3" />
                View original (audit only)
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 overflow-hidden">
          {/* Left Column - Content */}
          <div className="col-span-2 space-y-6 overflow-hidden">
            <ScrollArea className="h-[500px] pr-4">
              {/* Consent Warning */}
              {!ticket.consentGiven && (
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Member has not provided consent. Original content and attachments are disabled.
                    <Button variant="outline" size="sm" className="ml-2">
                      Request Consent
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Redacted Content */}
              <div className="space-y-4">
                <h3 className="font-medium">Request Details</h3>
                <RedactionStrip
                  text={ticket.redactedDescription}
                  redactionSummary={ticket.redactionSummary}
                  canViewOriginal={ticket.consentGiven}
                  onViewOriginal={() => setShowAuditConfirm(true)}
                />
              </div>

              {/* Attachments */}
              {ticket.attachments.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-medium">Attachments</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {ticket.attachments.map((attachment) => (
                      <div 
                        key={attachment.id}
                        className={`p-3 border rounded-lg ${!ticket.consentGiven || attachment.redacted ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                            📄
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{attachment.name}</p>
                            {attachment.redacted && (
                              <p className="text-xs text-red-600">Redacted</p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={!ticket.consentGiven || attachment.redacted}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status-Specific Content */}
              {renderStatusSpecificContent()}

              {/* Activity Timeline */}
              <div className="space-y-4">
                <h3 className="font-medium">Activity & Audit Trail</h3>
                <div className="space-y-2">
                  {ticketAuditEntries.map((entry) => (
                    <AuditRow 
                      key={entry.id} 
                      entry={entry} 
                      compact={true}
                    />
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Right Column - AI Suggestion */}
          <div className="space-y-6 overflow-hidden">
            <ScrollArea className="h-[500px]">
              {/* AI Suggestion Card */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">AI Suggestion</h3>
                  <AIBadge />
                </div>

                <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                  {/* Confidence Meter */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Confidence</span>
                      <span className="text-sm font-mono">
                        {(ticket.suggestion.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <ConfidenceBar confidence={ticket.suggestion.confidence} showNumeric={false} />
                  </div>

                  <Separator />

                  {/* Suggestion Details */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Category</label>
                      <p className="text-sm">{ticket.suggestion.category}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Priority</label>
                      <div className="mt-1">
                        <Badge variant={ticket.suggestion.priority === 'Critical' ? 'destructive' : 'secondary'}>
                          {ticket.suggestion.priority}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Suggested Assignee</label>
                      <p className="text-sm font-medium">{ticket.suggestion.suggestedAssignee}</p>
                    </div>

                    {/* Extracted Entities */}
                    {ticket.suggestion.extractedEntities.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Extracted Entities</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {ticket.suggestion.extractedEntities.map((entity, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {entity.type}: {entity.value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Explanation */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Explanation</label>
                    <p className="text-sm mt-1">{ticket.suggestion.explanation}</p>
                  </div>

                  {/* Detailed Reasoning */}
                  <Collapsible open={showDetailedReasoning} onOpenChange={setShowDetailedReasoning}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between p-2">
                        <span className="text-sm">Detailed reasoning</span>
                        {showDetailedReasoning ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2">
                      <div className="p-3 border rounded bg-white text-xs">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(ticket.suggestion.detailedReasoning, null, 2)}
                        </pre>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {!showOverrideForm ? (
                    <>
                      <Button
                        className="w-full"
                        onClick={handleAcceptSuggestion}
                        disabled={ticket.suggestion.confidence < 0.6}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accept suggestion & assign
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowOverrideForm(true)}
                      >
                        Override suggestion
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => onSendToProponent(ticket.ticketId)}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send to proponent for approval
                      </Button>
                      
                      <Button
                        variant="secondary"
                        className="w-full"
                      >
                        <UserX className="mr-2 h-4 w-4" />
                        Request human triage
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-3 p-3 border rounded-lg">
                      <h4 className="font-medium text-sm">Override Assignment</h4>
                      
                      <div>
                        <Label htmlFor="override-assignee">Alternative Assignee</Label>
                        <Select value={overrideAssignee} onValueChange={setOverrideAssignee}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose alternative assignee" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Medical Team">Medical Team</SelectItem>
                            <SelectItem value="Legal Team">Legal Team</SelectItem>
                            <SelectItem value="Education Team">Education Team</SelectItem>
                            <SelectItem value="Emergency Team">Emergency Team</SelectItem>
                            <SelectItem value="Senior Management">Senior Management</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="override-reason">Reason (required, min 10 chars)</Label>
                        <Textarea
                          id="override-reason"
                          placeholder="Explain why you're overriding the AI suggestion..."
                          value={overrideReason}
                          onChange={(e) => setOverrideReason(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {overrideReason.length < 10 && overrideReason.length > 0 && (
                            <span className="text-red-600">Minimum 10 characters required</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleOverrideSubmit}
                          disabled={!overrideAssignee || overrideReason.length < 10}
                          className="flex-1"
                        >
                          Submit Override
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowOverrideForm(false);
                            setOverrideAssignee('');
                            setOverrideReason('');
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                      
                      <div className="text-xs text-muted-foreground bg-amber-50 p-2 rounded">
                        💡 Will be used for model training when active learning is enabled
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* View Original Audit Confirmation */}
        <Dialog open={showAuditConfirm} onOpenChange={setShowAuditConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm override and provide reason</DialogTitle>
              <DialogDescription>
                This action will allow you to view the original unredacted content and will be logged for audit purposes.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Alert>
                <EyeOff className="h-4 w-4" />
                <AlertDescription>
                  Viewing original content requires audit permission and will be logged in the audit trail.
                </AlertDescription>
              </Alert>
              
              <div>
                <Label htmlFor="audit-reason">Reason for viewing original content</Label>
                <Textarea
                  id="audit-reason"
                  placeholder="Enter reason for audit access..."
                  value={auditReason}
                  onChange={(e) => setAuditReason(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowAuditConfirm(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleViewOriginal}
                  disabled={!auditReason.trim()}
                >
                  Confirm & View Original
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}