import { useState } from 'react';
import { Check, X, User, AlertTriangle, FileText, Eye, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

const pendingRegistrations = [
  {
    id: '1',
    fullName: 'Maria Santos',
    email: 'maria.santos@sm.com.ph',
    company: 'SM Investments Corp',
    department: 'Human Resources',
    position: 'Manager',
    unionAffiliation: 'SM Workers Union',
    submittedDate: '2024-09-20',
    status: 'Pending Review',
    priority: 'Normal',
    duplicateFlag: false,
    validationChecks: {
      emailValid: true,
      phoneValid: true,
      documentsComplete: true,
      companyVerified: true,
      noDuplicates: true,
    },
  },
  {
    id: '2',
    fullName: 'Carlos Mendoza',
    email: 'carlos.mendoza@ayala.com.ph',
    company: 'Ayala Corporation',
    department: 'Finance',
    position: 'Senior Analyst',
    unionAffiliation: 'Ayala Employees Association',
    submittedDate: '2024-09-19',
    status: 'Under Review',
    priority: 'High',
    duplicateFlag: true,
    validationChecks: {
      emailValid: true,
      phoneValid: true,
      documentsComplete: false,
      companyVerified: true,
      noDuplicates: false,
    },
  },
  {
    id: '3',
    fullName: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@jollibee.com.ph',
    company: 'Jollibee Foods Corporation',
    department: 'Operations',
    position: 'Store Manager',
    unionAffiliation: 'Fast Food Workers Union',
    submittedDate: '2024-09-18',
    status: 'Pending Review',
    priority: 'Normal',
    duplicateFlag: false,
    validationChecks: {
      emailValid: true,
      phoneValid: false,
      documentsComplete: true,
      companyVerified: true,
      noDuplicates: true,
    },
  },
];

export function RegistrationReview() {
  const [selectedRegistration, setSelectedRegistration] = useState<string | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const getValidationIcon = (isValid: boolean) => {
    return isValid ? (
      <Check className="h-4 w-4 text-green-600" />
    ) : (
      <X className="h-4 w-4 text-red-600" />
    );
  };

  const handleApprove = (registrationId: string) => {
    toast.success('Registration approved successfully. Digital ID will be generated.');
    setShowApprovalDialog(false);
  };

  const handleReject = (registrationId: string) => {
    toast.error('Registration rejected. Notification sent to member.');
    setShowRejectionDialog(false);
    setRejectionReason('');
    setCustomReason('');
  };

  const rejectionReasons = [
    'Incomplete documentation',
    'Invalid company information',
    'Duplicate registration detected',
    'Invalid contact information',
    'Photo quality issues',
    'Employment verification failed',
    'Other (specify below)',
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Registration Review</h1>
          <p className="text-muted-foreground">
            Review and approve pending member registrations ({pendingRegistrations.length} pending)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Bulk Actions
          </Button>
          <Button variant="outline">
            Export Queue
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Queue */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Review Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingRegistrations.map((registration) => (
                <div
                  key={registration.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedRegistration === registration.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedRegistration(registration.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {registration.fullName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{registration.fullName}</p>
                        <p className="text-xs text-muted-foreground">{registration.company}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={registration.priority === 'High' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {registration.priority}
                      </Badge>
                      {registration.duplicateFlag && (
                        <Badge variant="outline" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Duplicate
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Submitted {registration.submittedDate}</span>
                    <span>{registration.status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Registration Details */}
        <div className="lg:col-span-2">
          {selectedRegistration ? (
            <RegistrationDetails
              registration={pendingRegistrations.find(r => r.id === selectedRegistration)!}
              onApprove={() => setShowApprovalDialog(true)}
              onReject={() => setShowRejectionDialog(true)}
              getValidationIcon={getValidationIcon}
            />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Select a Registration</h3>
                <p className="text-muted-foreground">
                  Choose a registration from the queue to review details and take action.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Registration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to approve this registration? This will:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Generate a digital ID for the member</li>
              <li>Send approval notification via email</li>
              <li>Activate the member account</li>
              <li>Add member to the active directory</li>
            </ul>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleApprove(selectedRegistration!)}>
                Approve Registration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Registration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Select value={rejectionReason} onValueChange={setRejectionReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {rejectionReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {rejectionReason === 'Other (specify below)' && (
              <div>
                <Label htmlFor="custom-reason">Custom Reason</Label>
                <Textarea
                  id="custom-reason"
                  placeholder="Please specify the reason for rejection..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                />
              </div>
            )}
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReject(selectedRegistration!)}
                disabled={!rejectionReason}
              >
                Reject Registration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RegistrationDetails({
  registration,
  onApprove,
  onReject,
  getValidationIcon,
}: {
  registration: any;
  onApprove: () => void;
  onReject: () => void;
  getValidationIcon: (isValid: boolean) => JSX.Element;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback>
                {registration.fullName.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div>{registration.fullName}</div>
              <div className="text-sm text-muted-foreground">{registration.email}</div>
            </div>
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onReject}>
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button onClick={onApprove}>
              <Check className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Company</Label>
                <p>{registration.company}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                <p>{registration.department}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Position</Label>
                <p>{registration.position}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Union Affiliation</Label>
                <p>{registration.unionAffiliation}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Submitted Date</Label>
                <p>{registration.submittedDate}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <Badge variant="secondary">{registration.status}</Badge>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="validation" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>Email Address Valid</span>
                {getValidationIcon(registration.validationChecks.emailValid)}
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>Phone Number Valid</span>
                {getValidationIcon(registration.validationChecks.phoneValid)}
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>Documents Complete</span>
                {getValidationIcon(registration.validationChecks.documentsComplete)}
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>Company Verified</span>
                {getValidationIcon(registration.validationChecks.companyVerified)}
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span>No Duplicates Found</span>
                {getValidationIcon(registration.validationChecks.noDuplicates)}
              </div>
            </div>
            
            {registration.duplicateFlag && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-orange-800">Potential Duplicate Detected</span>
                  </div>
                  <p className="text-sm text-orange-700">
                    Similar member found: Carlos Mendez (ALU-2023-0156) - Same company and email domain
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Similar Member
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Registration Form</p>
                    <p className="text-sm text-muted-foreground">PDF, 2.1 MB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  View Document
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">ID Photo</p>
                    <p className="text-sm text-muted-foreground">JPG, 1.3 MB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  View Photo
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Employment Certificate</p>
                    <p className="text-sm text-muted-foreground">PDF, 0.9 MB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  View Certificate
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Union Form</p>
                    <p className="text-sm text-muted-foreground">PDF, 1.1 MB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  View Form
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}