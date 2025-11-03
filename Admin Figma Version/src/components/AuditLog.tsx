import { useState } from 'react';
import { Search, Filter, Download, Calendar, Eye, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DatePicker } from './ui/date-picker';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { AuditRow } from './ai/AuditRow';
import { TicketDetail } from './TicketDetail';
import { mockAuditEntries, mockAITickets, type AuditEntry } from './ai/mock-ai-data';

export function AuditLog() {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>(mockAuditEntries);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    actor: 'all',
    action: 'all',
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined
  });

  const filteredEntries = auditEntries.filter(entry => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        entry.ticketId?.toLowerCase().includes(searchLower) ||
        entry.actorName.toLowerCase().includes(searchLower) ||
        entry.action.toLowerCase().includes(searchLower) ||
        entry.reason?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Actor filter
    if (filters.actor !== 'all' && entry.actor !== filters.actor) return false;

    // Action filter
    if (filters.action !== 'all' && entry.action !== filters.action) return false;

    // Date filters
    const entryDate = new Date(entry.timestamp);
    if (filters.dateFrom && entryDate < filters.dateFrom) return false;
    if (filters.dateTo && entryDate > filters.dateTo) return false;

    return true;
  });

  const handleViewTicket = (ticketId: string) => {
    const ticket = mockAITickets.find(t => t.ticketId === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      setShowTicketDetail(true);
    }
  };

  const handleExportAuditLog = () => {
    // Simulate export functionality
    const csvContent = [
      'Timestamp,Actor,Actor Name,Action,Ticket ID,Reason,Metadata',
      ...filteredEntries.map(entry => [
        entry.timestamp,
        entry.actor,
        entry.actorName,
        entry.action,
        entry.ticketId || '',
        entry.reason || '',
        JSON.stringify(entry.metadata || {})
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getActionStats = () => {
    const stats = {
      'auto-assign': filteredEntries.filter(e => e.action === 'auto-assign').length,
      'override': filteredEntries.filter(e => e.action === 'override').length,
      'view-original': filteredEntries.filter(e => e.action === 'view-original').length,
      'settings-change': filteredEntries.filter(e => e.action === 'settings-change').length
    };
    return stats;
  };

  const stats = getActionStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Audit Log</h1>
          <p className="text-muted-foreground">
            Comprehensive audit trail for all AI automation activities
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportAuditLog}>
            <Download className="mr-2 h-4 w-4" />
            Export Log
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">AI</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Auto-assigns</p>
                <p className="text-2xl font-bold">{stats['auto-assign']}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <span className="text-amber-600 font-bold text-sm">OR</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overrides</p>
                <p className="text-2xl font-bold">{stats['override']}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">View Original</p>
                <p className="text-2xl font-bold">{stats['view-original']}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 font-bold text-sm">SY</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Settings</p>
                <p className="text-2xl font-bold">{stats['settings-change']}</p>
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
                    placeholder="Ticket ID, actor, action..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <Separator />

              {/* Actor Filter */}
              <div>
                <label className="text-sm font-medium">Actor</label>
                <Select value={filters.actor} onValueChange={(value) => setFilters(prev => ({ ...prev, actor: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actors</SelectItem>
                    <SelectItem value="AI">AI System</SelectItem>
                    <SelectItem value="admin">Admin Users</SelectItem>
                    <SelectItem value="proponent">Proponents</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Filter */}
              <div>
                <label className="text-sm font-medium">Action</label>
                <Select value={filters.action} onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="auto-assign">Auto-assign</SelectItem>
                    <SelectItem value="override">Override</SelectItem>
                    <SelectItem value="view-original">View Original</SelectItem>
                    <SelectItem value="model-call">Model Call</SelectItem>
                    <SelectItem value="approve">Approve</SelectItem>
                    <SelectItem value="reject">Reject</SelectItem>
                    <SelectItem value="settings-change">Settings Change</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div>
                <label className="text-sm font-medium">Date Range</label>
                <div className="space-y-2">
                  <DatePicker
                    date={filters.dateFrom}
                    setDate={(date) => setFilters(prev => ({ ...prev, dateFrom: date }))}
                    placeholder="From date"
                  />
                  <DatePicker
                    date={filters.dateTo}
                    setDate={(date) => setFilters(prev => ({ ...prev, dateTo: date }))}
                    placeholder="To date"
                  />
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setFilters({
                  search: '',
                  actor: 'all',
                  action: 'all',
                  dateFrom: undefined,
                  dateTo: undefined
                })}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Audit Log */}
        <div className="col-span-9">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Audit Entries</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{filteredEntries.length} entries</span>
                  <Badge variant="outline">Live updates</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[700px]">
                <div className="space-y-2">
                  {filteredEntries.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No audit entries found matching your filters</p>
                    </div>
                  ) : (
                    filteredEntries.map((entry) => (
                      <AuditRow
                        key={entry.id}
                        entry={entry}
                        onViewTicket={handleViewTicket}
                        compact={false}
                      />
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
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