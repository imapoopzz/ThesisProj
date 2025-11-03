import { useState } from 'react';
import { ArrowLeft, Download, CreditCard, Mail, Phone, MapPin, Building, Calendar, User, FileText, DollarSign, Heart, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { generateMockMembers } from './mock-data';

interface MemberProfileProps {
  memberId: string | null;
  onBack: () => void;
}

export function MemberProfile({ memberId, onBack }: MemberProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get member data
  const allMembers = generateMockMembers(150);
  const member = allMembers.find(m => m.id === memberId);
  
  if (!member) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Members
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <p>Member not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'default',
      'Pending Review': 'secondary',
      'Approved': 'default',
      'Rejected': 'destructive',
      'Inactive': 'outline',
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Members
          </Button>
          <div>
            <h1>{member.fullName}</h1>
            <p className="text-muted-foreground">{member.memberID}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button>
            <CreditCard className="mr-2 h-4 w-4" />
            Issue Digital ID
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={member.photoURL} />
              <AvatarFallback className="text-lg">
                {member.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-xl font-semibold">{member.fullName}</h2>
                {getStatusBadge(member.status)}
                <Badge variant="outline">{member.duesStatus}</Badge>
                <Badge variant={member.idStatus === 'Issued' ? 'default' : 'secondary'}>
                  {member.idStatus}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{member.mobile}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{member.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {member.registeredDate}</span>
                </div>
              </div>
            </div>
            
            {member.digitalID && (
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                  <div className="text-xs">QR Code</div>
                </div>
                <p className="text-xs text-muted-foreground">Digital ID</p>
                <p className="text-xs font-mono">{member.digitalID}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
          <TabsTrigger value="dues">Dues & Payments</TabsTrigger>
          <TabsTrigger value="id-history">ID History</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <p>{member.dateOfBirth}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gender</label>
                    <p>{member.gender}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <p>{member.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
                  <p>{member.emergencyContact}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Employment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Company</label>
                  <p>{member.company}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <p>{member.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Position</label>
                    <p>{member.position}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Years Employed</label>
                  <p>{member.yearsEmployed} years</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Union Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Union Affiliation</label>
                  <p>{member.unionAffiliation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Union Position</label>
                  <p>{member.unionPosition}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle>Registration Form Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Basic Information</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                        <p>{member.fullName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Member ID</label>
                        <p className="font-mono">{member.memberID}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                        <p>{member.registeredDate}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Contact Information</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p>{member.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                        <p>{member.mobile}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Address</label>
                        <p>{member.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-4">Uploaded Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Registration Form</p>
                      <p className="text-xs text-muted-foreground">PDF, 2.3 MB</p>
                      <Button variant="outline" size="sm" className="mt-2">View</Button>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">ID Photo</p>
                      <p className="text-xs text-muted-foreground">JPG, 1.1 MB</p>
                      <Button variant="outline" size="sm" className="mt-2">View</Button>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Employment Proof</p>
                      <p className="text-xs text-muted-foreground">PDF, 0.8 MB</p>
                      <Button variant="outline" size="sm" className="mt-2">View</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dues">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Dues & Payment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">₱2,400</p>
                        <p className="text-sm text-muted-foreground">Total Paid</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">₱0</p>
                        <p className="text-sm text-muted-foreground">Outstanding</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">₱200</p>
                        <p className="text-sm text-muted-foreground">Monthly Dues</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Payment History</h4>
                  <div className="space-y-2">
                    {[
                      { date: '2024-09-01', amount: '₱200', method: 'Payroll Deduction', status: 'Paid' },
                      { date: '2024-08-01', amount: '₱200', method: 'Bank Transfer', status: 'Paid' },
                      { date: '2024-07-01', amount: '₱200', method: 'Payroll Deduction', status: 'Paid' },
                      { date: '2024-06-01', amount: '₱200', method: 'Cash', status: 'Paid' },
                    ].map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{payment.date}</p>
                          <p className="text-xs text-muted-foreground">{payment.method}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{payment.amount}</p>
                          <Badge variant="default" className="text-xs">{payment.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="id-history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                ID & Card History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Digital ID</h4>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Current Digital ID</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">ID: {member.digitalID}</p>
                      <p className="text-sm text-muted-foreground mb-3">Issued: 2024-01-16</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View ID</Button>
                        <Button size="sm" variant="outline">Download PDF</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Physical Card</h4>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Card Status</span>
                        <Badge variant={member.cardRequested ? 'default' : 'outline'}>
                          {member.cardRequested ? member.cardStatus : 'Not Requested'}
                        </Badge>
                      </div>
                      {member.cardRequested && (
                        <>
                          <p className="text-sm text-muted-foreground mb-2">Requested: 2024-01-20</p>
                          <p className="text-sm text-muted-foreground mb-3">Payment: ₱150 - Paid</p>
                        </>
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          {member.cardRequested ? 'Track Card' : 'Request Card'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents & Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Registration Form', type: 'PDF', size: '2.3 MB', date: '2024-01-15' },
                  { name: 'ID Photo', type: 'JPG', size: '1.1 MB', date: '2024-01-15' },
                  { name: 'Employment Certificate', type: 'PDF', size: '0.8 MB', date: '2024-01-15' },
                  { name: 'Union Membership Form', type: 'PDF', size: '1.5 MB', date: '2024-01-15' },
                ].map((doc, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.type}, {doc.size}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">Uploaded: {doc.date}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: '2024-09-20 14:30', action: 'Profile viewed', user: 'Admin User', details: 'Viewed member profile' },
                  { date: '2024-09-15 10:15', action: 'Dues payment recorded', user: 'Finance Admin', details: 'Monthly dues payment - ₱200' },
                  { date: '2024-08-01 09:00', action: 'ID card shipped', user: 'System', details: 'Physical ID card shipped via courier' },
                  { date: '2024-07-25 16:45', action: 'Card payment processed', user: 'Finance Admin', details: 'Physical card payment - ₱150' },
                  { date: '2024-01-20 11:30', action: 'Physical card requested', user: 'Member', details: 'Requested physical ID card' },
                  { date: '2024-01-16 14:20', action: 'Digital ID issued', user: 'Admin User', details: 'Digital ID generated and issued' },
                  { date: '2024-01-15 16:10', action: 'Registration approved', user: 'Admin User', details: 'Member registration approved' },
                  { date: '2024-01-15 09:30', action: 'Registration submitted', user: 'Member', details: 'Initial registration form submitted' },
                ].map((entry, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">{entry.action}</p>
                        <p className="text-xs text-muted-foreground">{entry.date}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{entry.details}</p>
                      <p className="text-xs text-muted-foreground">by {entry.user}</p>
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