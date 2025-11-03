import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CreditCard, CheckCircle, Clock, AlertTriangle, Calendar, Banknote, Shield } from 'lucide-react';
import { AppLayout } from './AppLayout';
import type { User as UserType, DuesRecord } from '../App';

interface DuesTrackingProps {
  user: UserType | null;
  dues: DuesRecord[];
  onNavigate: (screen: string) => void;
  onLogout?: () => void;
}

export function DuesTracking({ user, dues, onNavigate, onLogout }: DuesTrackingProps) {
  if (!user) return null;

  // If user is not approved, show restricted access message
  if (!user.isApproved) {
    return (
      <AppLayout
        currentScreen="dues"
        onNavigate={onNavigate}
        onLogout={onLogout}
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Dues History Not Available
            </h2>
            <p className="text-gray-600 mb-6">
              Your membership application is still under review. Dues tracking and payment history will be available once your membership is approved by ALU administrators.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-800">Application Status</span>
                <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>
              </div>
              <p className="text-xs text-yellow-700 mt-2">
                Membership dues will begin after approval
              </p>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={() => onNavigate('membershipForm')} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                View Application Status
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onNavigate('dashboard')} 
                className="w-full"
              >
                Back to Dashboard
              </Button>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Questions about dues? Contact ALU at (02) 8123-4567
              </p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const totalPaid = dues.filter(d => d.status === 'paid').reduce((sum, d) => sum + d.amount, 0);
  const totalPending = dues.filter(d => d.status === 'pending').reduce((sum, d) => sum + d.amount, 0);
  const totalOverdue = dues.filter(d => d.status === 'overdue').reduce((sum, d) => sum + d.amount, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <AppLayout
      currentScreen="history"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="px-4 py-6 max-w-md mx-auto lg:max-w-7xl">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-6 lg:space-y-0">
          {/* Left Column - Summary and Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">₱{totalPaid.toLocaleString()}</div>
                  <div className="text-xs text-green-600 mt-1">Paid</div>
                </CardContent>
              </Card>
              
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">₱{totalPending.toLocaleString()}</div>
                  <div className="text-xs text-yellow-600 mt-1">Pending</div>
                </CardContent>
              </Card>
              
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">₱{totalOverdue.toLocaleString()}</div>
                  <div className="text-xs text-red-600 mt-1">Overdue</div>
                </CardContent>
              </Card>
            </div>

            {/* Member Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  Monthly Dues Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Member:</span>
                  <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Company:</span>
                  <span className="text-sm font-medium">{user.company}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly Amount:</span>
                  <span className="text-sm font-medium">₱500.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment Method:</span>
                  <span className="text-sm font-medium">Payroll Deduction</span>
                </div>
              </CardContent>
            </Card>

            {/* Automatic Deduction Notice */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Banknote className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">Automatic Payroll Deduction</h3>
                    <p className="text-sm text-blue-700">
                      Your monthly union dues are automatically deducted from your payslip. 
                      Membership is automatically maintained as long as dues are reflected in your payroll.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dues History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dues.map((due) => (
                  <div key={due.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(due.status)}
                      <div>
                        <div className="font-medium text-sm">{due.month}</div>
                        <div className="text-xs text-gray-600">
                          {due.paymentDate 
                            ? `Paid on ${new Date(due.paymentDate).toLocaleDateString()}`
                            : due.status === 'pending' 
                              ? 'Via Payroll Deduction'
                              : 'Payment Required'
                          }
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">₱{due.amount.toLocaleString()}</div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(due.status)}`}
                      >
                        {due.status.charAt(0).toUpperCase() + due.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Desktop Only */}
          <div className="lg:col-span-1 space-y-6 hidden lg:block">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Banknote className="w-5 h-5 mr-2 text-purple-600" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{dues.filter(d => d.status === 'paid').length}</div>
                  <div className="text-sm text-blue-600">Payments Made</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">₱500</div>
                    <div className="text-xs text-green-600">Monthly</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">₱6,000</div>
                    <div className="text-xs text-purple-600">Yearly</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                  Payment Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-orange-800">Next Payment</span>
                    <span className="text-sm text-orange-600">May 5, 2024</span>
                  </div>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>• Automatic deduction on 5th of each month</p>
                  <p>• Processed through payroll system</p>
                  <p>• No manual payment required</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs text-gray-600 space-y-1">
                  <p className="font-medium">ALU Finance Department</p>
                  <p>📞 (02) 8123-4567</p>
                  <p>📧 finance@alu.org.ph</p>
                  <p>🕒 Mon-Fri, 8AM-5PM</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Payment Info - Mobile Only */}
        <div className="lg:hidden">
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Next Payment</h3>
                  <p className="text-sm text-gray-600">May 2024 • ₱500.00</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  Auto-deduction on May 5
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onNavigate('profile')}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Update Payment Information
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                For payment issues, contact ALU Finance Department
              </p>
              <p className="text-xs text-gray-500">
                📞 (02) 8123-4567 | 📧 finance@alu.org.ph
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}