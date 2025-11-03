import { useState } from 'react';
import { Heart, FileText, User, Clock, CheckCircle, XCircle, Mail, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';

const assistanceRequests = [
  {
    id: '1',
    ticketId: 'AST-2024-001',
    memberName: 'Pedro Reyes',
    memberID: 'ALU-2024-0003',
    type: 'Legal Consultation',
    category: 'Labor Dispute',
    description: 'Assistance needed for wrongful termination case',
    submittedDate: '2024-09-18',
    status: 'Under Review',
    priority: 'High',
    assignedTo: 'Legal Team',
  },
  {
    id: '2',
    ticketId: 'AST-2024-002',
    memberName: 'Maria Santos',
    memberID: 'ALU-2024-0002',
    type: 'Medical Assistance',
    category: 'Emergency Medical',
    description: 'Financial assistance for emergency surgery',
    submittedDate: '2024-09-17',
    status: 'Approved',
    priority: 'Critical',
    assignedTo: 'Medical Team',
    approvedAmount: '₱50,000',
  },
  {
    id: '3',
    ticketId: 'AST-2024-003',
    memberName: 'Juan dela Cruz',
    memberID: 'ALU-2024-0001',
    type: 'Educational Scholarship',
    category: 'Child Education',
    description: 'Scholarship application for child\'s college tuition',
    submittedDate: '2024-09-15',
    status: 'Pending Documentation',
    priority: 'Normal',
    assignedTo: 'Education Team',
  },
];

const benefitPrograms = [
  {
    id: '1',
    name: 'Legal Aid Program',
    description: 'Free legal consultation and representation',
    eligibility: 'All active members',
    budget: '₱2,000,000',
    utilized: '₱450,000',
    beneficiaries: 89,
  },
  {
    id: '2',
    name: 'Medical Assistance Fund',
    description: 'Emergency medical and hospitalization support',
    eligibility: 'Members with 6+ months membership',
    budget: '₱5,000,000',
    utilized: '₱1,230,000',
    beneficiaries: 156,
  },
  {
    id: '3',
    name: 'Educational Scholarship',
    description: 'Scholarship grants for members\' children',
    eligibility: 'Members with 1+ year membership',
    budget: '₱3,000,000',
    utilized: '₱890,000',
    beneficiaries: 78,
  },
];

export function BenefitsAssistance() {
  const [activeTab, setActiveTab] = useState('requests');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

  const getStatusBadge = (status: string) => {
    const variants = {
      'Under Review': 'secondary',
      'Approved': 'default',
      'Rejected': 'destructive',
      'Pending Documentation': 'outline',
      'Completed': 'default',
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'Critical': 'destructive',
      'High': 'destructive',
      'Normal': 'secondary',
      'Low': 'outline',
    } as const;
    
    return <Badge variant={variants[priority as keyof typeof variants] || 'outline'}>{priority}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Benefits & Assistance</h1>
          <p className="text-muted-foreground">
            Manage member benefit programs and assistance requests
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Requests</p>
                <p className="text-2xl font-bold">47</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Approved This Month</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Beneficiaries</p>
                <p className="text-2xl font-bold">323</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Funds Disbursed</p>
                <p className="text-2xl font-bold">₱2.57M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requests">Assistance Requests</TabsTrigger>
          <TabsTrigger value="programs">Benefit Programs</TabsTrigger>
          <TabsTrigger value="letters">Letters & Documents</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Assistance Request Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assistanceRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-sm">{request.ticketId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-sm">
                              {request.memberName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{request.memberName}</div>
                            <div className="text-sm text-muted-foreground">{request.memberID}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>{request.category}</TableCell>
                      <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{request.assignedTo}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          <Button size="sm">
                            Process
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {benefitPrograms.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{program.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{program.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Budget Utilization</span>
                      <span>{program.utilized} / {program.budget}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(parseInt(program.utilized.replace(/[₱,]/g, '')) / parseInt(program.budget.replace(/[₱,]/g, ''))) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{program.beneficiaries}</p>
                      <p className="text-xs text-muted-foreground">Beneficiaries</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {Math.round((parseInt(program.utilized.replace(/[₱,]/g, '')) / parseInt(program.budget.replace(/[₱,]/g, ''))) * 100)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Utilized</p>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Eligibility</p>
                    <p className="text-sm">{program.eligibility}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="letters" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Letter Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Approval Letter - Medical Assistance', usage: 23 },
                  { name: 'Approval Letter - Legal Aid', usage: 18 },
                  { name: 'Approval Letter - Educational Scholarship', usage: 12 },
                  { name: 'Rejection Letter - Insufficient Documentation', usage: 8 },
                  { name: 'Request for Additional Documents', usage: 15 },
                ].map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{template.name}</p>
                      <p className="text-xs text-muted-foreground">Used {template.usage} times this month</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Use</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Document Generation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label>Letter Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select letter type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approval">Approval Letter</SelectItem>
                        <SelectItem value="rejection">Rejection Letter</SelectItem>
                        <SelectItem value="request-docs">Request Documents</SelectItem>
                        <SelectItem value="follow-up">Follow-up Letter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Member</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pedro">Pedro Reyes (ALU-2024-0003)</SelectItem>
                        <SelectItem value="maria">Maria Santos (ALU-2024-0002)</SelectItem>
                        <SelectItem value="juan">Juan dela Cruz (ALU-2024-0001)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Additional Notes</Label>
                    <Textarea placeholder="Add any specific notes or instructions..." />
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <input type="checkbox" id="use-ai-draft" className="rounded" />
                    <Label htmlFor="use-ai-draft" className="text-sm">
                      Use AI draft response
                    </Label>
                    <div className="ml-auto">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        AI-suggested
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Letter
                    </Button>
                    <Button variant="outline">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Generated Documents History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Generated By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { date: '2024-09-20', type: 'Approval Letter - Medical', member: 'Maria Santos', generatedBy: 'Admin User', status: 'Sent' },
                    { date: '2024-09-19', type: 'Request Documents', member: 'Pedro Reyes', generatedBy: 'Legal Team', status: 'Sent' },
                    { date: '2024-09-18', type: 'Approval Letter - Education', member: 'Juan dela Cruz', generatedBy: 'Education Team', status: 'Draft' },
                  ].map((doc, index) => (
                    <TableRow key={index}>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{doc.member}</TableCell>
                      <TableCell>{doc.generatedBy}</TableCell>
                      <TableCell>
                        <Badge variant={doc.status === 'Sent' ? 'default' : 'secondary'}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View</Button>
                          <Button size="sm" variant="outline">Download</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <p className="text-2xl font-bold">247</p>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-xs text-green-600">+18% vs last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">89%</p>
                <p className="text-sm text-muted-foreground">Approval Rate</p>
                <p className="text-xs text-green-600">+5% vs last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">3.2</p>
                <p className="text-sm text-muted-foreground">Avg. Days to Process</p>
                <p className="text-xs text-green-600">-0.8 days improved</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold">₱2.57M</p>
                <p className="text-sm text-muted-foreground">Total Disbursed</p>
                <p className="text-xs text-blue-600">YTD 2024</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: 'Medical Assistance', count: 156, percentage: 45, color: 'bg-red-500' },
                    { type: 'Legal Aid', count: 89, percentage: 26, color: 'bg-blue-500' },
                    { type: 'Educational Scholarship', count: 78, percentage: 22, color: 'bg-green-500' },
                    { type: 'Emergency Support', count: 24, percentage: 7, color: 'bg-yellow-500' },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.type}</span>
                        <span className="text-muted-foreground">{item.count} requests</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full`} 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { month: 'September', requests: 47, approved: 42, amount: '₱890K' },
                    { month: 'August', requests: 52, approved: 46, amount: '₱1.2M' },
                    { month: 'July', requests: 38, approved: 34, amount: '₱670K' },
                    { month: 'June', requests: 44, approved: 39, amount: '₱980K' },
                  ].map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{month.month}</p>
                        <p className="text-xs text-muted-foreground">
                          {month.requests} requests, {month.approved} approved
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{month.amount}</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((month.approved / month.requests) * 100)}% approval
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}