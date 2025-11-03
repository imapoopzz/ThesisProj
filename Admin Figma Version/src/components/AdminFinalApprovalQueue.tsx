import { useState } from 'react';
import { CheckCircle, X, Eye, Clock, Send, ArrowLeft, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';
import { ConfidenceBar } from './ai/ConfidenceBar';
import { SuggestionDiffView } from './ai/SuggestionDiffView';

interface AdminApprovalItem {
  id: string;
  ticketId: string;
  memberPseudonym: string;
  category: string;
  proponent: {
    name: string;
    role: string;
    department: string;
  };
  originalAISuggestion: string;
  proponentResponse: string;
  aiConfidence: number;
  timesinceProponentApproval: string;
  status: 'pending_final_approval' | 'approved' | 'rejected' | 'returned';
  submittedDate: string;
}

const mockAdminApprovalItems: AdminApprovalItem[] = [
  {
    id: '1',
    ticketId: 'TCK-2025-0123',
    memberPseudonym: 'member-1973-ALU',
    category: 'Medical Assistance',
    proponent: {
      name: 'Dr. Ana Rodriguez',
      role: 'Medical Program Director',
      department: 'Benefits Administration'
    },
    originalAISuggestion: 'Dear Member, your medical assistance request has been reviewed and approved. We will process a payment of ₱85,000 to cover your emergency surgery costs. Please submit your hospital bills within 30 days for reimbursement processing.',
    proponentResponse: 'Dear Member, your medical assistance request has been thoroughly reviewed and approved by our medical team. We will process a payment of ₱85,000 to cover your emergency surgery costs. Please submit your original hospital bills and receipts within 30 days for reimbursement processing. Our office will contact you within 3 business days with payment details.',
    aiConfidence: 0.91,
    timesinceProponentApproval: '2 hours ago',
    status: 'pending_final_approval',
    submittedDate: '2025-09-29T08:30:00Z'
  },
  {
    id: '2',
    ticketId: 'TCK-2025-0127',
    memberPseudonym: 'member-4521-ALU',
    category: 'Legal Consultation',
    proponent: {
      name: 'Atty. Carlos Mendoza',
      role: 'Legal Affairs Head',
      department: 'Legal Services'
    },
    originalAISuggestion: 'We have received your legal consultation request regarding workplace discrimination. Our legal team will review your case and contact you within 5 business days to schedule a consultation.',
    proponentResponse: 'We have received and carefully reviewed your legal consultation request regarding workplace discrimination. Given the serious nature of your concerns, our senior legal counsel will personally handle your case. We will contact you within 24 hours to schedule an urgent consultation. Please prepare all relevant documentation and witness statements for our meeting.',
    aiConfidence: 0.78,
    timesinceProponentApproval: '4 hours ago',
    status: 'pending_final_approval',
    submittedDate: '2025-09-29T06:15:00Z'
  }
];

export function AdminFinalApprovalQueue() {
  const [items, setItems] = useState<AdminApprovalItem[]>(mockAdminApprovalItems);
  const [selectedItem, setSelectedItem] = useState<AdminApprovalItem | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editedResponse, setEditedResponse] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [showReturnDialog, setShowReturnDialog] = useState(false);

  const handleApproveAndSend = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, status: 'approved' as const }
        : item
    ));
    toast.success("Response approved and sent to member");
  };

  const handleReturnToProponent = (itemId: string, reason: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, status: 'returned' as const }
        : item
    ));
    setShowReturnDialog(false);
    setReturnReason('');
    toast.success("Response returned to proponent with feedback");
  };

  const handleEditAndSend = () => {
    if (!selectedItem || !editedResponse.trim()) return;
    
    setItems(prev => prev.map(item => 
      item.id === selectedItem.id 
        ? { ...item, status: 'approved' as const, proponentResponse: editedResponse }
        : item
    ));
    
    setShowEditDialog(false);
    setEditedResponse('');
    setSelectedItem(null);
    toast.success("Response edited and sent to member");
  };

  const handleReject = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, status: 'rejected' as const }
        : item
    ));
    toast.success("Response rejected");
  };

  const handleViewDetails = (item: AdminApprovalItem) => {
    setSelectedItem(item);
    setShowDetailDialog(true);
  };

  const handleStartEdit = (item: AdminApprovalItem) => {
    setSelectedItem(item);
    setEditedResponse(item.proponentResponse);
    setShowEditDialog(true);
  };

  const pendingItems = items.filter(item => item.status === 'pending_final_approval');
  const completedItems = items.filter(item => item.status !== 'pending_final_approval');

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending_final_approval': { variant: 'secondary' as const, label: 'Pending Final Approval' },
      'approved': { variant: 'default' as const, label: 'Approved & Sent' },
      'rejected': { variant: 'destructive' as const, label: 'Rejected' },
      'returned': { variant: 'outline' as const, label: 'Returned to Proponent' }
    };
    
    const config = variants[status as keyof typeof variants];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Admin Final Approval Queue</h1>
          <p className="text-muted-foreground">
            Review proponent-approved responses before sending to members
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Triage
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold">{pendingItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Approved Today</p>
                <p className="text-2xl font-bold">{completedItems.filter(i => i.status === 'approved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ArrowLeft className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Returned</p>
                <p className="text-2xl font-bold">{completedItems.filter(i => i.status === 'returned').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <X className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{completedItems.filter(i => i.status === 'rejected').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Final Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Proponent</TableHead>
                <TableHead>Response Preview</TableHead>
                <TableHead>AI Confidence</TableHead>
                <TableHead>Time Since Approval</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.ticketId}</TableCell>
                  <TableCell>{item.memberPseudonym}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {item.proponent.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{item.proponent.name}</div>
                        <div className="text-xs text-muted-foreground">{item.proponent.role}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm line-clamp-2">{item.proponentResponse}</p>
                  </TableCell>
                  <TableCell>
                    <ConfidenceBar confidence={item.aiConfidence} size="sm" />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.timesinceProponentApproval}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(item)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApproveAndSend(item.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail View Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Response Review - {selectedItem?.ticketId}</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6">
                {/* Header Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Member:</span>
                    <span className="ml-2 font-medium">{selectedItem.memberPseudonym}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <span className="ml-2">{selectedItem.category}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Proponent:</span>
                    <span className="ml-2 font-medium">{selectedItem.proponent.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time since approval:</span>
                    <span className="ml-2">{selectedItem.timesinceProponentApproval}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">AI Confidence:</span>
                  <ConfidenceBar confidence={selectedItem.aiConfidence} />
                </div>

                <Separator />

                {/* Response Comparison */}
                <SuggestionDiffView
                  aiSuggestion={selectedItem.originalAISuggestion}
                  proponentEdit={selectedItem.proponentResponse}
                  title="Response Comparison: AI vs Proponent"
                />

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedItem(selectedItem);
                      setReturnReason('');
                      setShowReturnDialog(true);
                    }}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Proponent
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleStartEdit(selectedItem)}
                  >
                    Edit & Send
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(selectedItem.id)}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApproveAndSend(selectedItem.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Approve & Send
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Response Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Response - {selectedItem?.ticketId}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Member:</span>
                <span className="ml-2">{selectedItem?.memberPseudonym}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Category:</span>
                <span className="ml-2">{selectedItem?.category}</span>
              </div>
            </div>

            <Separator />

            <div>
              <Label htmlFor="response-edit">Final Response Text</Label>
              <Textarea
                id="response-edit"
                value={editedResponse}
                onChange={(e) => setEditedResponse(e.target.value)}
                className="min-h-[200px] mt-2"
                placeholder="Edit the response before sending..."
              />
              <div className="text-xs text-muted-foreground mt-1">
                This will be the final response sent to the member
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEditAndSend}
                disabled={!editedResponse.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="mr-2 h-4 w-4" />
                Send to Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Return to Proponent Dialog */}
      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return to Proponent</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Returning response for ticket {selectedItem?.ticketId} to {selectedItem?.proponent.name}
              </p>
            </div>

            <div>
              <Label htmlFor="return-reason">Feedback for Proponent</Label>
              <Textarea
                id="return-reason"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Provide feedback on what needs to be changed..."
                className="mt-2"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowReturnDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => selectedItem && handleReturnToProponent(selectedItem.id, returnReason)}
                disabled={!returnReason.trim()}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Proponent
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}