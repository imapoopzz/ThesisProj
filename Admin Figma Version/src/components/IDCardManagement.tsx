import { CreditCard, Printer, Download, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarFallback } from './ui/avatar';

const cardRequests = [
  {
    id: '1',
    memberName: 'Ana Garcia',
    memberID: 'ALU-2024-0004',
    requestDate: '2024-09-10',
    paymentStatus: 'Paid',
    cardStatus: 'Processing',
    branchAddress: '321 BGC, Taguig City',
  },
  {
    id: '2',
    memberName: 'Roberto Lopez',
    memberID: 'ALU-2024-0005',
    requestDate: '2024-09-08',
    paymentStatus: 'Paid',
    cardStatus: 'Ready for Pickup',
    branchAddress: '654 Makati Ave, Makati City',
  },
  {
    id: '3',
    memberName: 'Carlos Mendoza',
    memberID: 'ALU-2024-0006',
    requestDate: '2024-09-12',
    paymentStatus: 'Pending',
    cardStatus: 'Awaiting Payment',
    branchAddress: '789 Quezon Ave, Quezon City',
  },
];

export function IDCardManagement() {
  const getStatusBadge = (status: string) => {
    const variants = {
      'Processing': 'secondary',
      'Ready for Pickup': 'default',
      'Awaiting Payment': 'destructive',
      'Paid': 'default',
      'Pending': 'secondary',
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>ID & Card Management</h1>
          <p className="text-muted-foreground">
            Manage physical card requests and printing
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Printer className="mr-2 h-4 w-4" />
            Bulk Print Cards
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Card Requests</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Printer className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Ready for Pickup</p>
                <p className="text-2xl font-bold">89</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Physical Card Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Card Status</TableHead>
                <TableHead>Branch Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cardRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-sm">
                          {request.memberName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{request.memberName}</div>
                        <div className="text-sm text-muted-foreground">{request.memberID}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>
                    {getStatusBadge(request.paymentStatus)}
                  </TableCell>
                  <TableCell>{getStatusBadge(request.cardStatus)}</TableCell>
                  <TableCell className="max-w-48">
                    <p className="text-sm truncate">{request.branchAddress}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Print Physical Card
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="mr-2 h-4 w-4" />
                        Notify
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}