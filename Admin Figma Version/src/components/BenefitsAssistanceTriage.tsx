import { useState, useMemo } from 'react';
import { Heart, CheckCircle, Clock, BarChart3, Shield, Search, Eye, UserCheck, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AIBadge } from './ai/AIBadge';
import { ConfidenceBar } from './ai/ConfidenceBar';
import { mockAITickets, aiAnalytics, type AITicket } from './ai/mock-ai-data';
import { TicketDetail } from './TicketDetail';

interface BenefitsAssistanceTriageProps {
  onNavigate?: (page: string) => void;
}

export function BenefitsAssistanceTriage({ onNavigate }: BenefitsAssistanceTriageProps) {
  const [selectedTicket, setSelectedTicket] = useState<AITicket | null>(null);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [activeTab, setActiveTab] = useState('auto-resolved');
  const [filters, setFilters] = useState({
    category: 'all',
    priority: 'all',
    company: 'all',
    assignedTo: 'all',
    confidenceRange: 'all',
    search: ''
  });

  // Helper function to get confidence range
  const getConfidenceRange = (confidenceFilter: string): [number, number] => {
    switch (confidenceFilter) {
      case 'very-high': return [90, 100];
      case 'high': return [80, 89];
      case 'medium': return [50, 79];
      case 'low': return [0, 49];
      default: return [0, 100];
    }
  };

  // Filter tickets based on current filters and active tab
  const filteredTickets = useMemo(() => {
    let baseTickets = mockAITickets;
    
    // Filter by tab first
    if (activeTab === 'auto-resolved') {
      baseTickets = baseTickets.filter(ticket => ticket.status === 'auto-resolved');
    } else if (activeTab === 'auto-assigned') {
      baseTickets = baseTickets.filter(ticket => ticket.status === 'auto-assigned');
    } else if (activeTab === 'needs-assignment') {
      baseTickets = baseTickets.filter(ticket => ticket.status === 'needs-assignment');
    } else if (activeTab === 'in-progress') {
      baseTickets = baseTickets.filter(ticket => ticket.status === 'in-progress');
    } else if (activeTab === 'resolved') {
      baseTickets = baseTickets.filter(ticket => ticket.status === 'resolved');
    }
    
    return baseTickets.filter(ticket => {
      if (filters.category !== 'all' && ticket.category !== filters.category) return false;
      if (filters.priority !== 'all' && ticket.priority !== filters.priority) return false;
      if (filters.assignedTo !== 'all' && ticket.assignedTo !== filters.assignedTo) return false;
      
      const confidence = ticket.suggestion.confidence * 100;
      const [minConfidence, maxConfidence] = getConfidenceRange(filters.confidenceRange);
      if (confidence < minConfidence || confidence > maxConfidence) return false;
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          ticket.ticketId.toLowerCase().includes(searchLower) ||
          ticket.memberName.toLowerCase().includes(searchLower) ||
          ticket.category.toLowerCase().includes(searchLower) ||
          ticket.description.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [filters, activeTab]);

  const getStatusBadge = (status: string) => {
    const variants = {
      'auto-resolved': { variant: 'outline' as const, label: 'Auto-Resolved' },
      'auto-assigned': { variant: 'default' as const, label: 'Auto-Assigned' },
      'needs-assignment': { variant: 'secondary' as const, label: 'Needs Assignment' },
      'in-progress': { variant: 'outline' as const, label: 'In Progress' },
      'resolved': { variant: 'default' as const, label: 'Resolved' }
    };
    
    const config = variants[status as keyof typeof variants];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'Critical': { variant: 'destructive' as const, color: 'text-red-600' },
      'High': { variant: 'secondary' as const, color: 'text-orange-600' },
      'Normal': { variant: 'outline' as const, color: 'text-blue-600' },
      'Low': { variant: 'outline' as const, color: 'text-gray-600' }
    };
    
    const config = variants[priority as keyof typeof variants];
    return <Badge variant={config.variant}>{priority}</Badge>;
  };

  const handleQuickAssign = (ticketId: string, assignee: string) => {
    // Simulate API call
    console.log(`Quick assigning ${ticketId} to ${assignee}`);
    // Would update ticket status and create audit entry
  };

  const handleReviewAssign = (ticketId: string, department: string) => {
    // For tickets that need review, assign to specific department
    console.log(`Assigning ${ticketId} to ${department} for review`);
    // Would update ticket status and create audit entry
  };

  const handleViewTicket = (ticket: AITicket) => {
    setSelectedTicket(ticket);
    setShowTicketDetail(true);
  };

  const renderTicketList = (tickets: AITicket[]) => {
    return (
      <ScrollArea className="h-[700px]">
        <div className="space-y-4 p-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`p-6 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedTicket?.id === ticket.id 
                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                  : 'bg-white hover:bg-gray-50'
              }`}
              onClick={() => setSelectedTicket(ticket)}
            >
              {/* Header Section */}
              <div className="flex items-start justify-between gap-6 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium text-blue-600">{ticket.ticketId}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="text-muted-foreground">{ticket.memberName}</span>
                    {ticket.hasSensitiveContent && (
                      <Shield className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <AIBadge showTooltip={false} />
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(ticket.status)}
                </div>
              </div>

              {/* Category and Priority Tags */}
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline">{ticket.type}</Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {ticket.category}
                </Badge>
                {getPriorityBadge(ticket.priority)}
              </div>

              {/* Description */}
              <div className="mb-5">
                <p className="text-muted-foreground leading-relaxed line-clamp-2">
                  {ticket.description}
                </p>
              </div>

              {/* AI Suggestion Section */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">AI Confidence:</span>
                    <ConfidenceBar 
                      confidence={ticket.suggestion.confidence} 
                      size="sm"
                      className="w-32"
                    />

                  </div>
                  {ticket.suggestion.suggestedAssignee && (
                    <Badge variant="secondary" className="text-xs font-medium">
                      → {ticket.suggestion.suggestedAssignee}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions Section */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-xs text-muted-foreground">
                  Submitted {new Date(ticket.submittedDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewTicket(ticket);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  
                  {ticket.status === 'needs-assignment' ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="default">
                          <UserCheck className="h-4 w-4 mr-1" />
                          Assign Department
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleReviewAssign(ticket.ticketId, 'Medical Department')}>
                          Medical Department
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReviewAssign(ticket.ticketId, 'Legal Department')}>
                          Legal Department
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReviewAssign(ticket.ticketId, 'Education Department')}>
                          Education Department
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReviewAssign(ticket.ticketId, 'Emergency Support')}>
                          Emergency Support
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReviewAssign(ticket.ticketId, 'Finance Department')}>
                          Finance Department
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <UserCheck className="h-4 w-4 mr-1" />
                          Quick Assign
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleQuickAssign(ticket.ticketId, 'Medical Team')}>
                          Medical Team
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleQuickAssign(ticket.ticketId, 'Legal Team')}>
                          Legal Team
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleQuickAssign(ticket.ticketId, 'Education Team')}>
                          Education Team
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Mark as sensitive
                    }}
                    className="text-muted-foreground hover:text-amber-600"
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Benefits & Assistance</h1>
          <p className="text-muted-foreground">
            AI-powered assistance request processing and assignment system
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onNavigate?.('proponent-queue')}>
            Proponent Queue
          </Button>
          <Button variant="outline" onClick={() => onNavigate?.('admin-approval-queue')}>
            Admin Approval
          </Button>
          <Button variant="outline" onClick={() => onNavigate?.('audit-log')}>
            Audit Log
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Requests</p>
                <p className="text-2xl font-bold">{filteredTickets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-sm text-muted-foreground">Needs Assignment</p>
                <p className="text-2xl font-bold">
                  {mockAITickets.filter(t => t.status === 'needs-assignment').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Auto-assigned (7d)</p>
                <p className="text-2xl font-bold">{aiAnalytics.autoAssignRate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg AI Confidence</p>
                <p className="text-2xl font-bold">{(aiAnalytics.avgConfidence * 100).toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Sensitive Content</p>
                <p className="text-2xl font-bold">
                  {filteredTickets.filter(t => t.hasSensitiveContent).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Horizontal Filters */}
      <Card>
        <CardContent className="pt-6">
          {/* Search - Full Width */}
          <div className="mb-4">
            <label className="text-sm font-medium">Search</label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ticket ID, member, category..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          {/* Other Filters - Below Search */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Medical Assistance">Medical Assistance</SelectItem>
                  <SelectItem value="Legal Consultation">Legal Consultation</SelectItem>
                  <SelectItem value="Educational Scholarship">Educational Scholarship</SelectItem>
                  <SelectItem value="Emergency Support">Emergency Support</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assigned To Filter */}
            <div>
              <label className="text-sm font-medium">Assigned To</label>
              <Select value={filters.assignedTo} onValueChange={(value) => setFilters(prev => ({ ...prev, assignedTo: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="Medical Team">Medical Team</SelectItem>
                  <SelectItem value="Legal Team">Legal Team</SelectItem>
                  <SelectItem value="Education Team">Education Team</SelectItem>
                  <SelectItem value="Emergency Team">Emergency Team</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* AI Confidence Filter */}
            <div>
              <label className="text-sm font-medium">AI Confidence</label>
              <Select value={filters.confidenceRange} onValueChange={(value) => setFilters(prev => ({ ...prev, confidenceRange: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Confidence (0-100%)</SelectItem>
                  <SelectItem value="very-high">Very High (90-100%)</SelectItem>
                  <SelectItem value="high">High (80-89%)</SelectItem>
                  <SelectItem value="medium">Medium (50-79%)</SelectItem>
                  <SelectItem value="low">Low (0-49%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main: Tickets with Tabs */}
      <div>
          <Card>
            <CardHeader>
              <CardTitle>Tickets</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-6 pt-4">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="auto-resolved">
                      Auto-Resolved ({mockAITickets.filter(t => t.status === 'auto-resolved').length})
                    </TabsTrigger>
                    <TabsTrigger value="auto-assigned">
                      Auto-Assigned ({mockAITickets.filter(t => t.status === 'auto-assigned').length})
                    </TabsTrigger>
                    <TabsTrigger value="needs-assignment">
                      Needs Assignment ({mockAITickets.filter(t => t.status === 'needs-assignment').length})
                    </TabsTrigger>
                    <TabsTrigger value="in-progress">
                      In Progress ({mockAITickets.filter(t => t.status === 'in-progress').length})
                    </TabsTrigger>
                    <TabsTrigger value="resolved">
                      Resolved ({mockAITickets.filter(t => t.status === 'resolved').length})
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                {/* Auto-Resolved Tab */}
                <TabsContent value="auto-resolved" className="mt-0">
                  <ScrollArea className="h-[700px]">
                    <div className="space-y-4 p-6">
                      {filteredTickets.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">No auto-resolved tickets found</p>
                        </div>
                      ) : (
                        filteredTickets.map((ticket) => (
                          <div
                            key={ticket.id}
                            className={`p-6 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                              selectedTicket?.id === ticket.id 
                                ? 'bg-green-50 border-green-200 shadow-sm' 
                                : 'bg-white hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedTicket(ticket)}
                          >
                          {/* Header Section */}
                          <div className="flex items-start justify-between gap-6 mb-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-3">
                                <span className="font-mono font-medium text-blue-600">{ticket.ticketId}</span>
                                <Separator orientation="vertical" className="h-4" />
                                <span className="text-muted-foreground">{ticket.memberName}</span>
                                {ticket.hasSensitiveContent && (
                                  <Shield className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-xs text-green-600 font-medium">Auto-Resolved</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(ticket.status)}
                            </div>
                          </div>

                          {/* Category and Priority Tags */}
                          <div className="flex items-center gap-3 mb-4">
                            <Badge variant="outline">{ticket.type}</Badge>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {ticket.category}
                            </Badge>
                            {getPriorityBadge(ticket.priority)}
                          </div>

                          {/* Content Preview */}
                          <div className="space-y-3 mb-4">
                            <h4 className="font-medium text-foreground">{ticket.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{ticket.redactedDescription}</p>
                          </div>

                          {/* AI Auto-Response Preview */}
                          <div className="bg-green-50 rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">AI Auto-Response Sent</span>
                            </div>
                            {ticket.aiResponse && (
                              <p className="text-sm text-green-700 line-clamp-3">{ticket.aiResponse}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-green-600">
                                Confidence: {Math.round(ticket.suggestion.confidence * 100)}%
                              </span>
                              <Separator orientation="vertical" className="h-3" />
                              <span className="text-xs text-green-600">
                                {new Date(ticket.submittedDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewTicket(ticket);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Response
                            </Button>
                          </div>
                        </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="auto-assigned" className="mt-0">
                  <ScrollArea className="h-[700px]">
                    <div className="space-y-4 p-6">
                      {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`p-6 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedTicket?.id === ticket.id 
                          ? 'bg-blue-50 border-blue-200 shadow-sm' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      {/* Header Section */}
                      <div className="flex items-start justify-between gap-6 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-medium text-blue-600">{ticket.ticketId}</span>
                            <Separator orientation="vertical" className="h-4" />
                            <span className="text-muted-foreground">{ticket.memberName}</span>
                            {ticket.hasSensitiveContent && (
                              <Shield className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <AIBadge showTooltip={false} />
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(ticket.status)}
                        </div>
                      </div>

                      {/* Category and Priority Tags */}
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="outline">{ticket.type}</Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {ticket.category}
                        </Badge>
                        {getPriorityBadge(ticket.priority)}
                      </div>

                      {/* Description */}
                      <div className="mb-5">
                        <p className="text-muted-foreground leading-relaxed line-clamp-2">
                          {ticket.description}
                        </p>
                      </div>

                      {/* AI Suggestion Section */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">AI Confidence:</span>
                            <ConfidenceBar 
                              confidence={ticket.suggestion.confidence} 
                              size="sm"
                              className="w-32"
                            />
                            <span className="text-xs text-muted-foreground">
                              {Math.round(ticket.suggestion.confidence * 100)}%
                            </span>
                          </div>
                          {ticket.suggestion.suggestedAssignee && (
                            <Badge variant="secondary" className="text-xs font-medium">
                              → {ticket.suggestion.suggestedAssignee}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions Section */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-xs text-muted-foreground">
                          Submitted {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewTicket(ticket);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <UserCheck className="h-4 w-4 mr-1" />
                                Quick Assign
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleQuickAssign(ticket.ticketId, 'Medical Team')}>
                                Medical Team
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleQuickAssign(ticket.ticketId, 'Legal Team')}>
                                Legal Team
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleQuickAssign(ticket.ticketId, 'Education Team')}>
                                Education Team
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Mark as sensitive
                            }}
                            className="text-muted-foreground hover:text-amber-600"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="need-review" className="mt-0">
              <ScrollArea className="h-[700px]">
                <div className="space-y-4 p-6">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`p-6 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedTicket?.id === ticket.id 
                          ? 'bg-blue-50 border-blue-200 shadow-sm' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      {/* Header Section */}
                      <div className="flex items-start justify-between gap-6 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-medium text-blue-600">{ticket.ticketId}</span>
                            <Separator orientation="vertical" className="h-4" />
                            <span className="text-muted-foreground">{ticket.memberName}</span>
                            {ticket.hasSensitiveContent && (
                              <Shield className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <AIBadge showTooltip={false} />
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(ticket.status)}
                        </div>
                      </div>

                      {/* Category and Priority Tags */}
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="outline">{ticket.type}</Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {ticket.category}
                        </Badge>
                        {getPriorityBadge(ticket.priority)}
                      </div>

                      {/* Description */}
                      <div className="mb-5">
                        <p className="text-muted-foreground leading-relaxed line-clamp-2">
                          {ticket.description}
                        </p>
                      </div>

                      {/* AI Suggestion Section */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">AI Confidence:</span>
                            <ConfidenceBar 
                              confidence={ticket.suggestion.confidence} 
                              size="sm"
                              className="w-32"
                            />
                            <span className="text-xs text-muted-foreground">
                              {Math.round(ticket.suggestion.confidence * 100)}%
                            </span>
                          </div>
                          {ticket.suggestion.suggestedAssignee && (
                            <Badge variant="secondary" className="text-xs font-medium">
                              → {ticket.suggestion.suggestedAssignee}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions Section for Review Required */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-xs text-muted-foreground">
                          Submitted {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewTicket(ticket);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="default">
                                <UserCheck className="h-4 w-4 mr-1" />
                                Assign Department
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleReviewAssign(ticket.ticketId, 'Medical Department')}>
                                Medical Department
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReviewAssign(ticket.ticketId, 'Legal Department')}>
                                Legal Department
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReviewAssign(ticket.ticketId, 'Education Department')}>
                                Education Department
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReviewAssign(ticket.ticketId, 'Emergency Support')}>
                                Emergency Support
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReviewAssign(ticket.ticketId, 'Finance Department')}>
                                Finance Department
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Needs Assignment Tab */}
            <TabsContent value="needs-assignment" className="mt-0">
              <ScrollArea className="h-[700px]">
                <div className="space-y-4 p-6">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`p-6 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedTicket?.id === ticket.id 
                          ? 'bg-blue-50 border-blue-200 shadow-sm' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      {/* Header Section */}
                      <div className="flex items-start justify-between gap-6 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-medium text-blue-600">{ticket.ticketId}</span>
                            <Separator orientation="vertical" className="h-4" />
                            <span className="text-muted-foreground">{ticket.memberName}</span>
                            {ticket.hasSensitiveContent && (
                              <Shield className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <AIBadge showTooltip={false} />
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(ticket.status)}
                        </div>
                      </div>

                      {/* Category and Priority Tags */}
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="outline">{ticket.type}</Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {ticket.category}
                        </Badge>
                        {getPriorityBadge(ticket.priority)}
                      </div>

                      {/* Content Preview */}
                      <div className="space-y-3 mb-4">
                        <h4 className="font-medium text-foreground">{ticket.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{ticket.redactedDescription}</p>
                      </div>

                      {/* AI Suggestion Section */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">AI Confidence:</span>
                            <ConfidenceBar 
                              confidence={ticket.suggestion.confidence} 
                              size="sm"
                              className="w-32"
                            />
                          </div>
                          {ticket.suggestion.suggestedAssignee && (
                            <Badge variant="secondary" className="text-xs font-medium">
                              → {ticket.suggestion.suggestedAssignee}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{ticket.suggestion.explanation}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTicket(ticket);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="default">
                              <UserCheck className="h-4 w-4 mr-1" />
                              Assign Department
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleReviewAssign(ticket.ticketId, 'Medical Department')}>
                              Medical Department
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReviewAssign(ticket.ticketId, 'Legal Department')}>
                              Legal Department
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReviewAssign(ticket.ticketId, 'Education Department')}>
                              Education Department
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReviewAssign(ticket.ticketId, 'Emergency Support')}>
                              Emergency Support
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReviewAssign(ticket.ticketId, 'Finance Department')}>
                              Finance Department
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* In Progress Tab */}
            <TabsContent value="in-progress" className="mt-0">
              <ScrollArea className="h-[700px]">
                <div className="space-y-4 p-6">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`p-6 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedTicket?.id === ticket.id 
                          ? 'bg-blue-50 border-blue-200 shadow-sm' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      {/* Header Section */}
                      <div className="flex items-start justify-between gap-6 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-medium text-blue-600">{ticket.ticketId}</span>
                            <Separator orientation="vertical" className="h-4" />
                            <span className="text-muted-foreground">{ticket.memberName}</span>
                            {ticket.hasSensitiveContent && (
                              <Shield className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <AIBadge showTooltip={false} />
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(ticket.status)}
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {ticket.assignedTo}
                          </Badge>
                        </div>
                      </div>

                      {/* Category and Priority Tags */}
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="outline">{ticket.type}</Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {ticket.category}
                        </Badge>
                        {getPriorityBadge(ticket.priority)}
                      </div>

                      {/* Content Preview */}
                      <div className="space-y-3 mb-4">
                        <h4 className="font-medium text-foreground">{ticket.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{ticket.redactedDescription}</p>
                      </div>

                      {/* Progress Status */}
                      {ticket.progressDetails && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-800">Progress Status</span>
                            <span className="text-xs text-blue-600">
                              Due: {new Date(ticket.progressDetails.estimatedCompletion).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-blue-700 mb-2">{ticket.progressDetails.status}</p>
                          <p className="text-xs text-blue-600">Next: {ticket.progressDetails.nextAction}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTicket(ticket);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Progress
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Resolved Tab */}
            <TabsContent value="resolved" className="mt-0">
              <ScrollArea className="h-[700px]">
                <div className="space-y-4 p-6">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`p-6 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedTicket?.id === ticket.id 
                          ? 'bg-green-50 border-green-200 shadow-sm' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      {/* Header Section */}
                      <div className="flex items-start justify-between gap-6 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-medium text-blue-600">{ticket.ticketId}</span>
                            <Separator orientation="vertical" className="h-4" />
                            <span className="text-muted-foreground">{ticket.memberName}</span>
                            {ticket.hasSensitiveContent && (
                              <Shield className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(ticket.status)}
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            {ticket.assignedTo}
                          </Badge>
                        </div>
                      </div>

                      {/* Category and Priority Tags */}
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="outline">{ticket.type}</Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {ticket.category}
                        </Badge>
                        {getPriorityBadge(ticket.priority)}
                      </div>

                      {/* Content Preview */}
                      <div className="space-y-3 mb-4">
                        <h4 className="font-medium text-foreground">{ticket.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{ticket.redactedDescription}</p>
                      </div>

                      {/* Resolution Summary */}
                      {ticket.resolutionDetails && (
                        <div className="bg-green-50 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-green-800">Resolution</span>
                            <span className="text-xs text-green-600">
                              {new Date(ticket.resolutionDetails.resolutionDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-green-700 mb-2">{ticket.resolutionDetails.finalAction}</p>
                          {ticket.resolutionDetails.followUpRequired && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Follow-up Required
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTicket(ticket);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Resolution
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>

      {/* Ticket Detail Modal */}
      {showTicketDetail && selectedTicket && (
        <TicketDetail
          ticket={selectedTicket}
          onClose={() => setShowTicketDetail(false)}
          onAcceptSuggestion={(ticketId, assignee) => {
            console.log('Accepting suggestion:', ticketId, assignee);
            setShowTicketDetail(false);
          }}
          onOverride={(ticketId, assignee, reason) => {
            console.log('Override:', ticketId, assignee, reason);
            setShowTicketDetail(false);
          }}
          onSendToProponent={(ticketId) => {
            console.log('Send to proponent:', ticketId);
            setShowTicketDetail(false);
          }}
        />
      )}
    </div>
  );
}