import { Users, UserCheck, Clock, CreditCard, DollarSign, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const kpiData = [
  {
    title: 'Total Members',
    value: '19,247',
    change: '+124 this month',
    icon: Users,
    color: 'text-blue-600',
  },
  {
    title: 'Pending Registrations',
    value: '47',
    change: 'Requires review',
    icon: UserCheck,
    color: 'text-orange-600',
  },
  {
    title: 'Active Members',
    value: '18,203',
    change: '94.6% active rate',
    icon: TrendingUp,
    color: 'text-green-600',
  },
  {
    title: 'Dues Overdue',
    value: '1,832',
    change: '9.5% of total',
    icon: AlertTriangle,
    color: 'text-red-600',
  },
  {
    title: 'ID Issuance Queue',
    value: '156',
    change: 'Processing time: 2-3 days',
    icon: CreditCard,
    color: 'text-purple-600',
  },
  {
    title: 'Card Requests',
    value: '89',
    change: '23 paid, 66 pending',
    icon: FileText,
    color: 'text-indigo-600',
  },
];

const quickActions = [
  { label: 'Approve Registrations', action: 'registration-review', count: 47 },
  { label: 'Bulk Import Excel', action: 'members', count: null },
  { label: 'Reconcile Dues', action: 'dues-finance', count: 23 },
  { label: 'Export Reports', action: 'reports-analytics', count: null },
];

const recentActivity = [
  {
    action: 'Member Registration Approved',
    member: 'Juan dela Cruz - BDO Makati',
    time: '5 minutes ago',
    type: 'approval',
  },
  {
    action: 'Bulk Payment Imported',
    member: '47 payments from Metrobank',
    time: '1 hour ago',
    type: 'payment',
  },
  {
    action: 'ID Cards Printed',
    member: 'Batch #2024-001 (25 cards)',
    time: '2 hours ago',
    type: 'id',
  },
  {
    action: 'Member Registration Submitted',
    member: 'Maria Santos - SM Corp',
    time: '3 hours ago',
    type: 'registration',
  },
  {
    action: 'Assistance Request',
    member: 'Legal consultation - Pedro Reyes',
    time: '4 hours ago',
    type: 'assistance',
  },
];

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to ALUzon Admin. Manage TUCP ALU members and operations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onNavigate('members')}>
            View All Members
          </Button>
          <Button variant="outline" onClick={() => onNavigate('registration-review')}>
            Review Pending
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {kpi.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground">
                  {kpi.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <div
                key={action.label}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => onNavigate(action.action)}
              >
                <span>{action.label}</span>
                {action.count && (
                  <Badge variant="secondary">{action.count}</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'approval' ? 'bg-green-500' :
                  activity.type === 'payment' ? 'bg-blue-500' :
                  activity.type === 'id' ? 'bg-purple-500' :
                  activity.type === 'registration' ? 'bg-orange-500' :
                  'bg-gray-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.member}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Database Health</span>
            <div className="flex items-center gap-2">
              <Progress value={98} className="w-20" />
              <span className="text-sm text-green-600">98%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>API Response Time</span>
            <div className="flex items-center gap-2">
              <Progress value={85} className="w-20" />
              <span className="text-sm text-green-600">142ms</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Storage Usage</span>
            <div className="flex items-center gap-2">
              <Progress value={67} className="w-20" />
              <span className="text-sm text-yellow-600">67%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}