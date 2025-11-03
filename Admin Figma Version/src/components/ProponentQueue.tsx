import { useState } from 'react';
import { Clock, CheckCircle, X, Edit, AlertTriangle, Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner@2.0.3';
import { ProponentCard } from './ai/ProponentCard';
import { ConfidenceBar } from './ai/ConfidenceBar';
import { mockProponentTasks, type ProponentTask } from './ai/mock-ai-data';

export function ProponentQueue() {
  const [tasks, setTasks] = useState<ProponentTask[]>(mockProponentTasks);
  const [selectedTask, setSelectedTask] = useState<ProponentTask | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editedResponse, setEditedResponse] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    proponent: 'all',
    category: 'all',
    search: ''
  });

  const filteredTasks = tasks.filter(task => {
    if (filters.status !== 'all' && task.status !== filters.status) return false;
    if (filters.proponent !== 'all' && task.proponent.id !== filters.proponent) return false;
    if (filters.category !== 'all' && task.category !== filters.category) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        task.ticketId.toLowerCase().includes(searchLower) ||
        task.memberPseudonym.toLowerCase().includes(searchLower) ||
        task.category.toLowerCase().includes(searchLower) ||
        task.suggestedResponse.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const handleApprove = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'approved' as const }
        : task
    ));
    toast.success("Response approved and sent to Admin for final review");
  };

  const handleReject = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'rejected' as const }
        : task
    ));
    toast.success("Response rejected");
  };

  const handleStartEdit = (task: ProponentTask) => {
    setSelectedTask(task);
    setEditedResponse(task.suggestedResponse);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!selectedTask || !editedResponse.trim()) return;
    
    setTasks(prev => prev.map(task => 
      task.id === selectedTask.id 
        ? { ...task, suggestedResponse: editedResponse, status: 'editing' as const }
        : task
    ));
    
    setShowEditDialog(false);
    setSelectedTask(null);
    setEditedResponse('');
    toast.success("Response saved and sent to Admin for approval");
  };

  const getStatusStats = () => {
    const stats = {
      pending: filteredTasks.filter(t => t.status === 'pending').length,
      approved: filteredTasks.filter(t => t.status === 'approved').length,
      rejected: filteredTasks.filter(t => t.status === 'rejected').length,
      editing: filteredTasks.filter(t => t.status === 'editing').length
    };
    return stats;
  };

  const getOverdueCount = () => {
    const now = new Date();
    return filteredTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < now && task.status === 'pending';
    }).length;
  };

  const stats = getStatusStats();
  const overdueCount = getOverdueCount();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Proponent Queue</h1>
          <p className="text-muted-foreground">
            Review and approve AI-generated response proposals
          </p>
        </div>
        <Button variant="outline">
          View All Proposals
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
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
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Edit className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">In Edit</p>
                <p className="text-2xl font-bold">{stats.editing}</p>
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
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Filter Panel */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div>
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Ticket ID, member, category..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <Separator />

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="editing">In Edit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Medical Assistance">Medical Assistance</SelectItem>
                    <SelectItem value="Legal Consultation">Legal Consultation</SelectItem>
                    <SelectItem value="Educational Scholarship">Educational Scholarship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Proponent Filter */}
              <div>
                <label className="text-sm font-medium">Proponent</label>
                <Select value={filters.proponent} onValueChange={(value) => setFilters(prev => ({ ...prev, proponent: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Proponents</SelectItem>
                    <SelectItem value="prop-1">Dr. Ana Rodriguez</SelectItem>
                    <SelectItem value="prop-2">Atty. Carlos Mendoza</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-9">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Proposal Queue</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {filteredTasks.length} proposals
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {overdueCount > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      {overdueCount} overdue proposal{overdueCount > 1 ? 's' : ''} require immediate attention
                    </span>
                  </div>
                </div>
              )}

              <ScrollArea className="h-[600px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredTasks.map((task) => (
                    <ProponentCard
                      key={task.id}
                      proponent={task.proponent}
                      ticketId={task.ticketId}
                      memberPseudonym={task.memberPseudonym}
                      suggestedResponse={task.suggestedResponse}
                      dueDate={task.dueDate}
                      status={task.status}
                      onApprove={() => handleApprove(task.id)}
                      onReject={() => handleReject(task.id)}
                      onEdit={() => handleStartEdit(task)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Response Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Response - {selectedTask?.ticketId}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Member:</span>
                <span className="ml-2">{selectedTask?.memberPseudonym}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Category:</span>
                <span className="ml-2">{selectedTask?.category}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">AI Confidence:</span>
              <ConfidenceBar 
                confidence={selectedTask?.aiConfidence || 0} 
                size="sm"
                className="w-24"
              />
            </div>

            <Separator />

            <div>
              <Label htmlFor="response-edit">Response Text</Label>
              <Textarea
                id="response-edit"
                value={editedResponse}
                onChange={(e) => setEditedResponse(e.target.value)}
                className="min-h-[200px] mt-2"
                placeholder="Edit the AI-generated response..."
              />
              <div className="text-xs text-muted-foreground mt-1">
                This will be sent to Admin for final approval
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
                onClick={handleSaveEdit}
                disabled={!editedResponse.trim()}
              >
                Send to Admin for final approval
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}