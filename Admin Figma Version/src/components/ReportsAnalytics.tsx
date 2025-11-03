import { useState } from 'react';
import { BarChart3, Download, Calendar, Filter, TrendingUp, Users, DollarSign, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DatePicker } from './ui/date-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const memberGrowthData = [
  { month: 'Jan', members: 17500, newMembers: 234 },
  { month: 'Feb', members: 17890, newMembers: 390 },
  { month: 'Mar', members: 18123, newMembers: 233 },
  { month: 'Apr', members: 18456, newMembers: 333 },
  { month: 'May', members: 18789, newMembers: 333 },
  { month: 'Jun', members: 19045, newMembers: 256 },
  { month: 'Jul', members: 19203, newMembers: 158 },
  { month: 'Aug', members: 19247, newMembers: 44 },
];

const companyDistribution = [
  { name: 'BDO', value: 4250, color: '#3b82f6' },
  { name: 'SM Corp', value: 2890, color: '#ef4444' },
  { name: 'Ayala Corp', value: 2340, color: '#10b981' },
  { name: 'PLDT', value: 1890, color: '#f59e0b' },
  { name: 'Jollibee', value: 1567, color: '#8b5cf6' },
  { name: 'Others', value: 6310, color: '#6b7280' },
];

const duesCollectionData = [
  { month: 'Jan', collected: 850000, target: 900000 },
  { month: 'Feb', collected: 920000, target: 900000 },
  { month: 'Mar', collected: 780000, target: 900000 },
  { month: 'Apr', collected: 940000, target: 900000 },
  { month: 'May', collected: 890000, target: 900000 },
  { month: 'Jun', collected: 960000, target: 900000 },
  { month: 'Jul', collected: 925000, target: 900000 },
  { month: 'Aug', collected: 1020000, target: 950000 },
];

export function ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [selectedCompany, setSelectedCompany] = useState('all');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights and reporting for ALUzon operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Custom Filter
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Members</p>
                    <p className="text-2xl font-bold">19,247</p>
                    <p className="text-xs text-green-600">+0.2% this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue (YTD)</p>
                    <p className="text-2xl font-bold">₱7.3M</p>
                    <p className="text-xs text-green-600">+15% vs last year</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Collection Rate</p>
                    <p className="text-2xl font-bold">94.6%</p>
                    <p className="text-xs text-green-600">Above target</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Active Companies</p>
                    <p className="text-2xl font-bold">58</p>
                    <p className="text-xs text-blue-600">All paying dues</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Member Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Member Growth Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={memberGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'members' ? value.toLocaleString() : value,
                      name === 'members' ? 'Total Members' : 'New Members'
                    ]} />
                    <Line type="monotone" dataKey="members" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="newMembers" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Company Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Member Distribution by Company</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={companyDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {companyDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Membership Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Active Members</span>
                      <span className="font-medium">18,203 (94.6%)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>New Registrations (30d)</span>
                      <span className="font-medium">47</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Retention Rate</span>
                      <span className="font-medium text-green-600">97.8%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Financial Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Monthly Collections</span>
                      <span className="font-medium">₱1.02M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Outstanding Dues</span>
                      <span className="font-medium text-red-600">₱890K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Collection Efficiency</span>
                      <span className="font-medium text-green-600">107%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Operations</h4>
                  <div className="space-y-2">

                    <div className="flex justify-between text-sm">
                      <span>Physical Cards</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Assistance Requests</span>
                      <span className="font-medium">47 active</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="membership" className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 3 months</SelectItem>
                <SelectItem value="year">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All companies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                <SelectItem value="bdo">Banco de Oro (BDO)</SelectItem>
                <SelectItem value="sm">SM Investments Corp</SelectItem>
                <SelectItem value="ayala">Ayala Corporation</SelectItem>
                <SelectItem value="pldt">PLDT Inc.</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">44</p>
                <p className="text-sm text-muted-foreground">New Members (30d)</p>
                <p className="text-xs text-green-600">+12% vs prev month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-red-600">1,044</p>
                <p className="text-sm text-muted-foreground">Inactive Members</p>
                <p className="text-xs text-red-600">5.4% of total</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-green-600">97.8%</p>
                <p className="text-sm text-muted-foreground">Retention Rate</p>
                <p className="text-xs text-green-600">Above industry avg</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Membership Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">By Union Position</h4>
                  {[
                    { position: 'Member', count: 16789, percentage: 87 },
                    { position: 'Board Member', count: 1234, percentage: 6 },
                    { position: 'Treasurer', count: 567, percentage: 3 },
                    { position: 'Secretary', count: 389, percentage: 2 },
                    { position: 'Vice President', count: 156, percentage: 1 },
                    { position: 'President', count: 112, percentage: 1 },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.position}</span>
                        <span className="font-medium">{item.count.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">By Years of Employment</h4>
                  {[
                    { range: '1-5 years', count: 7698, percentage: 40 },
                    { range: '6-10 years', count: 5774, percentage: 30 },
                    { range: '11-15 years', count: 3849, percentage: 20 },
                    { range: '16-20 years', count: 1540, percentage: 8 },
                    { range: '20+ years', count: 386, percentage: 2 },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.range}</span>
                        <span className="font-medium">{item.count.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-green-600">₱1.02M</p>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-xs text-green-600">+8% vs target</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">₱7.3M</p>
                <p className="text-sm text-muted-foreground">Year to Date</p>
                <p className="text-xs text-green-600">+15% vs last year</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-red-600">₱890K</p>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-xs text-red-600">1,832 members</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-purple-600">94.6%</p>
                <p className="text-sm text-muted-foreground">Collection Rate</p>
                <p className="text-xs text-green-600">Above target</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dues Collection Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={duesCollectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₱${(value as number).toLocaleString()}`, 'Amount']} />
                  <Bar dataKey="collected" fill="#3b82f6" name="Collected" />
                  <Bar dataKey="target" fill="#e5e7eb" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { company: 'Banco de Oro (BDO)', rate: 98, amount: '₱2.1M' },
                    { company: 'SM Investments Corp', rate: 95, amount: '₱1.8M' },
                    { company: 'Ayala Corporation', rate: 92, amount: '₱1.2M' },
                    { company: 'PLDT Inc.', rate: 88, amount: '₱890K' },
                    { company: 'Jollibee Foods Corp', rate: 85, amount: '₱650K' },
                  ].map((company, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{company.company}</p>
                        <p className="text-xs text-muted-foreground">{company.rate}% collection rate</p>
                      </div>
                      <p className="text-sm font-medium">{company.amount}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { method: 'Payroll Deduction', percentage: 65, amount: '₱4.7M' },
                    { method: 'Bank Transfer', percentage: 25, amount: '₱1.8M' },
                    { method: 'Check Payment', percentage: 8, amount: '₱580K' },
                    { method: 'Cash', percentage: 2, amount: '₱145K' },
                  ].map((method, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{method.method}</span>
                        <span className="text-muted-foreground">{method.amount}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${method.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-purple-600">1,247</p>
                <p className="text-sm text-muted-foreground">Physical Cards</p>
                <p className="text-xs text-blue-600">6.5% of members</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-green-600">323</p>
                <p className="text-sm text-muted-foreground">Assistance Beneficiaries</p>
                <p className="text-xs text-green-600">₱2.57M disbursed</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-orange-600">12</p>
                <p className="text-sm text-muted-foreground">Events This Year</p>
                <p className="text-xs text-green-600">87% avg attendance</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Registration Processing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Avg. Processing Time</span>
                    <span className="text-sm font-medium">2.3 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Approval Rate</span>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pending Reviews</span>
                    <span className="text-sm font-medium">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Duplicate Detections</span>
                    <span className="text-sm font-medium">3 (6.4%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Database Health</span>
                    <span className="text-sm font-medium text-green-600">98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">API Response Time</span>
                    <span className="text-sm font-medium">142ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Storage Usage</span>
                    <span className="text-sm font-medium">67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Uptime (30d)</span>
                    <span className="text-sm font-medium text-green-600">99.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          {/* AI Automation Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">67%</p>
                <p className="text-sm text-muted-foreground">Auto-assign Rate</p>
                <p className="text-xs text-green-600">+12% vs last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">84%</p>
                <p className="text-sm text-muted-foreground">Avg AI Confidence</p>
                <p className="text-xs text-green-600">+3% vs last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">15%</p>
                <p className="text-sm text-muted-foreground">Override Rate</p>
                <p className="text-xs text-green-600">-5% vs last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">2.3h</p>
                <p className="text-sm text-muted-foreground">Time Saved/Day</p>
                <p className="text-xs text-green-600">AI automation</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Builder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Report Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="membership">Membership Report</SelectItem>
                      <SelectItem value="financial">Financial Report</SelectItem>
                      <SelectItem value="attendance">Event Attendance</SelectItem>
                      <SelectItem value="assistance">Benefits & Assistance</SelectItem>
                      <SelectItem value="ai-analytics">AI Analytics Report</SelectItem>
                      <SelectItem value="audit-trail">AI Audit Trail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Date Range</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Last 7 days</SelectItem>
                      <SelectItem value="month">Last 30 days</SelectItem>
                      <SelectItem value="quarter">Last 3 months</SelectItem>
                      <SelectItem value="year">Last 12 months</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Filters</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Add filters" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company">By Company</SelectItem>
                      <SelectItem value="union">By Union Position</SelectItem>
                      <SelectItem value="status">By Status</SelectItem>
                      <SelectItem value="region">By Region</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Format</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                      <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                      <SelectItem value="csv">CSV File</SelectItem>
                      <SelectItem value="dashboard">Interactive Dashboard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Monthly Membership Summary', frequency: 'Monthly', nextRun: '2024-10-01', active: true },
                  { name: 'Weekly Collection Report', frequency: 'Weekly', nextRun: '2024-09-23', active: true },
                  { name: 'Quarterly Analytics', frequency: 'Quarterly', nextRun: '2024-12-31', active: true },
                  { name: 'Annual Comprehensive Report', frequency: 'Yearly', nextRun: '2024-12-31', active: false },
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{report.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {report.frequency} • Next: {report.nextRun}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        {report.active ? 'Pause' : 'Resume'}
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Export History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { report: 'Monthly Membership Report', date: '2024-09-01', format: 'PDF', size: '2.3 MB', status: 'Completed' },
                  { report: 'Financial Summary Q3', date: '2024-08-30', format: 'Excel', size: '1.8 MB', status: 'Completed' },
                  { report: 'Event Attendance Report', date: '2024-08-25', format: 'CSV', size: '0.9 MB', status: 'Completed' },
                  { report: 'Custom Benefits Report', date: '2024-08-20', format: 'PDF', size: '3.1 MB', status: 'Completed' },
                ].map((export_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{export_.report}</p>
                      <p className="text-xs text-muted-foreground">
                        {export_.date} • {export_.format} • {export_.size}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}