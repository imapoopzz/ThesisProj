import { useState } from 'react';
import { DollarSign, Upload, Download, CreditCard, Building, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const duesData = [
  { month: 'Jan', collected: 850000, target: 900000 },
  { month: 'Feb', collected: 920000, target: 900000 },
  { month: 'Mar', collected: 780000, target: 900000 },
  { month: 'Apr', collected: 940000, target: 900000 },
  { month: 'May', collected: 890000, target: 900000 },
  { month: 'Jun', collected: 960000, target: 900000 },
];

const paymentRecords = [
  {
    id: '1',
    date: '2024-09-20',
    company: 'Banco de Oro (BDO)',
    amount: '₱1,250,000',
    method: 'Bank Transfer',
    status: 'Processed',
    members: 625,
    reference: 'BDO-092024-001',
  },
  {
    id: '2',
    date: '2024-09-19',
    company: 'SM Investments Corp',
    amount: '₱890,000',
    method: 'Check',
    status: 'Pending',
    members: 445,
    reference: 'CHK-092024-002',
  },
  {
    id: '3',
    date: '2024-09-18',
    company: 'Ayala Corporation',
    amount: '₱670,000',
    method: 'Payroll Deduction',
    status: 'Processed',
    members: 335,
    reference: 'AYALA-092024-003',
  },
];

const overdueAccounts = [
  {
    memberName: 'Carlos Rodriguez',
    memberID: 'ALU-2024-0123',
    company: 'PLDT Inc.',
    overdueAmount: '₱600',
    monthsOverdue: 3,
    lastPayment: '2024-06-15',
  },
  {
    memberName: 'Lisa Wong',
    memberID: 'ALU-2024-0087',
    company: 'Globe Telecom',
    overdueAmount: '₱400',
    monthsOverdue: 2,
    lastPayment: '2024-07-20',
  },
  {
    memberName: 'Miguel Santos',
    memberID: 'ALU-2024-0234',
    company: 'Jollibee Foods Corp',
    overdueAmount: '₱800',
    monthsOverdue: 4,
    lastPayment: '2024-05-10',
  },
];

export function DuesFinance() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const getStatusBadge = (status: string) => {
    const variants = {
      'Processed': 'default',
      'Pending': 'secondary',
      'Failed': 'destructive',
      'Reconciled': 'default',
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Dues & Finance Management</h1>
          <p className="text-muted-foreground">
            Track member dues, process payments, and manage financial records
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Payments
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <CreditCard className="mr-2 h-4 w-4" />
            Reconcile
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Collected</p>
                <p className="text-2xl font-bold">₱5.34M</p>
                <p className="text-xs text-green-600">+12% vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold">₱890K</p>
                <p className="text-xs text-red-600">1,832 members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Collection Rate</p>
                <p className="text-2xl font-bold">94.6%</p>
                <p className="text-xs text-blue-600">Above target</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Companies</p>
                <p className="text-2xl font-bold">58</p>
                <p className="text-xs text-purple-600">Active remitters</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payment Records</TabsTrigger>
          <TabsTrigger value="overdue">Overdue Accounts</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Collection Trends</CardTitle>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Monthly</SelectItem>
                      <SelectItem value="quarter">Quarterly</SelectItem>
                      <SelectItem value="year">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={duesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₱${(value as number).toLocaleString()}`, 'Amount']} />
                    <Bar dataKey="collected" fill="#3b82f6" />
                    <Bar dataKey="target" fill="#e5e7eb" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { company: 'Banco de Oro (BDO)', rate: 98, amount: '₱2.1M' },
                  { company: 'SM Investments Corp', rate: 95, amount: '₱1.8M' },
                  { company: 'Ayala Corporation', rate: 92, amount: '₱1.2M' },
                  { company: 'PLDT Inc.', rate: 88, amount: '₱890K' },
                  { company: 'Jollibee Foods Corp', rate: 85, amount: '₱650K' },
                ].map((company, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{company.company}</span>
                      <span className="text-muted-foreground">{company.amount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={company.rate} className="flex-1" />
                      <span className="text-sm font-medium">{company.rate}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: '2 hours ago', action: 'BDO bulk payment processed', amount: '₱1,250,000', status: 'success' },
                  { time: '4 hours ago', action: 'SM Corp check payment pending', amount: '₱890,000', status: 'pending' },
                  { time: '6 hours ago', action: 'Ayala payroll deduction reconciled', amount: '₱670,000', status: 'success' },
                  { time: '1 day ago', action: 'PLDT payment file imported', amount: '₱445,000', status: 'success' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{activity.amount}</p>
                      <Badge variant={activity.status === 'success' ? 'default' : 'secondary'}>
                        {activity.status === 'success' ? 'Processed' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.company}</TableCell>
                      <TableCell className="font-medium">{record.amount}</TableCell>
                      <TableCell>{record.method}</TableCell>
                      <TableCell>{record.members}</TableCell>
                      <TableCell className="font-mono text-sm">{record.reference}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View</Button>
                          <Button size="sm" variant="outline">Reconcile</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Overdue Accounts ({overdueAccounts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Overdue Amount</TableHead>
                    <TableHead>Months Overdue</TableHead>
                    <TableHead>Last Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overdueAccounts.map((account, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{account.memberName}</div>
                          <div className="text-sm text-muted-foreground">{account.memberID}</div>
                        </div>
                      </TableCell>
                      <TableCell>{account.company}</TableCell>
                      <TableCell className="font-medium text-red-600">{account.overdueAmount}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{account.monthsOverdue} months</Badge>
                      </TableCell>
                      <TableCell>{account.lastPayment}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Send Notice</Button>
                          <Button size="sm" variant="outline">Payment Plan</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconciliation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bank File Import</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">Drop bank files here</p>
                  <p className="text-xs text-muted-foreground">Supports CSV, Excel, and PDF formats</p>
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Import BDO Payments
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Metrobank Payments
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Check Payments
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Auto-Match Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Match by Member ID</p>
                      <p className="text-xs text-muted-foreground">Auto-match using ALU ID in reference</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Company Payroll Deduction</p>
                      <p className="text-xs text-muted-foreground">Match bulk company payments</p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Amount + Date Range</p>
                      <p className="text-xs text-muted-foreground">Match by amount within date range</p>
                    </div>
                    <Badge variant="outline">Inactive</Badge>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Configure Rules
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reconciliation Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Pending Reconciliations</h3>
                <p className="text-muted-foreground mb-4">
                  All recent payments have been reconciled. Import new payment files to begin reconciliation.
                </p>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Payment File
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Monthly Collection Report', description: 'Detailed collection summary by month', format: 'PDF, Excel' },
                  { name: 'Company Remittance Report', description: 'Payment breakdown by company', format: 'PDF, Excel' },
                  { name: 'Overdue Accounts Report', description: 'List of members with overdue payments', format: 'PDF, Excel' },
                  { name: 'Payment Method Analysis', description: 'Analysis of payment channels', format: 'PDF, Excel' },
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.description}</p>
                      <p className="text-xs text-muted-foreground">{report.format}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Generate
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Weekly Summary', frequency: 'Every Monday', nextRun: '2024-09-23' },
                  { name: 'Monthly Collection', frequency: 'First of month', nextRun: '2024-10-01' },
                  { name: 'Quarterly Analysis', frequency: 'End of quarter', nextRun: '2024-12-31' },
                ].map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{schedule.name}</p>
                      <p className="text-xs text-muted-foreground">{schedule.frequency}</p>
                      <p className="text-xs text-muted-foreground">Next: {schedule.nextRun}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}