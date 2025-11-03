import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Users, CheckCircle, XCircle, Clock, Search, Eye, UserCheck, Filter } from 'lucide-react';

interface AdminApprovalProps {
  onNavigate: (screen: string) => void;
}

type ApprovalStatus = 'pending' | 'approved' | 'rejected';

interface PendingMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  unionPosition: string;
  applicationDate: string;
  status: ApprovalStatus;
  documents: {
    membershipForm: boolean;
    idPhoto: boolean;
    employmentProof: boolean;
  };
}

export function AdminApproval({ onNavigate }: AdminApprovalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'all'>('all');
  const [selectedMember, setSelectedMember] = useState<PendingMember | null>(null);

  // Mock data for pending members
  const [pendingMembers, setPendingMembers] = useState<PendingMember[]>([
    {
      id: '2024-001',
      firstName: 'Maria',
      lastName: 'Santos',
      email: 'maria.santos@bdo.com.ph',
      phone: '+63 917 234 5678',
      company: 'BDO Unibank Inc.',
      position: 'Bank Officer',
      unionPosition: 'Member',
      applicationDate: '2024-03-01',
      status: 'pending',
      documents: {
        membershipForm: true,
        idPhoto: true,
        employmentProof: false
      }
    },
    {
      id: '2024-002',
      firstName: 'Jose',
      lastName: 'Rizal',
      email: 'jose.rizal@metrobank.com.ph',
      phone: '+63 917 345 6789',
      company: 'Metrobank',
      position: 'Senior Analyst',
      unionPosition: 'Member',
      applicationDate: '2024-03-02',
      status: 'pending',
      documents: {
        membershipForm: true,
        idPhoto: true,
        employmentProof: true
      }
    },
    {
      id: '2024-003',
      firstName: 'Ana',
      lastName: 'Cruz',
      email: 'ana.cruz@bdo.com.ph',
      phone: '+63 917 456 7890',
      company: 'BDO Unibank Inc.',
      position: 'Branch Manager',
      unionPosition: 'Board Member',
      applicationDate: '2024-02-28',
      status: 'approved',
      documents: {
        membershipForm: true,
        idPhoto: true,
        employmentProof: true
      }
    }
  ]);

  const handleApprove = (memberId: string) => {
    setPendingMembers(prev =>
      prev.map(member =>
        member.id === memberId
          ? { ...member, status: 'approved' as const }
          : member
      )
    );
    setSelectedMember(null);
  };

  const handleReject = (memberId: string) => {
    setPendingMembers(prev =>
      prev.map(member =>
        member.id === memberId
          ? { ...member, status: 'rejected' as const }
          : member
      )
    );
    setSelectedMember(null);
  };

  const filteredMembers = pendingMembers.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: ApprovalStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const stats = {
    total: pendingMembers.length,
    pending: pendingMembers.filter(m => m.status === 'pending').length,
    approved: pendingMembers.filter(m => m.status === 'approved').length,
    rejected: pendingMembers.filter(m => m.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-lg font-semibold">Member Approval System</h1>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-4 gap-2">
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="text-lg font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs text-gray-600">Total</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="text-lg font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="text-lg font-bold text-green-600">{stats.approved}</div>
              <div className="text-xs text-gray-600">Approved</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3">
              <div className="text-lg font-bold text-red-600">{stats.rejected}</div>
              <div className="text-xs text-gray-600">Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Members List */}
        <div className="space-y-3">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm">{member.firstName} {member.lastName}</h3>
                    <p className="text-xs text-gray-600">{member.company}</p>
                  </div>
                  <Badge className={getStatusColor(member.status)}>
                    {getStatusIcon(member.status)}
                    <span className="ml-1 capitalize">{member.status}</span>
                  </Badge>
                </div>
                
                <div className="space-y-2 text-xs text-gray-600">
                  <p><strong>Position:</strong> {member.position}</p>
                  <p><strong>Union Role:</strong> {member.unionPosition}</p>
                  <p><strong>Applied:</strong> {new Date(member.applicationDate).toLocaleDateString()}</p>
                  
                  {/* Document Status */}
                  <div className="flex items-center space-x-2 pt-2">
                    <span className="text-xs text-gray-500">Documents:</span>
                    <div className="flex space-x-1">
                      <Badge variant={member.documents.membershipForm ? "default" : "secondary"} className="text-xs">
                        Form
                      </Badge>
                      <Badge variant={member.documents.idPhoto ? "default" : "secondary"} className="text-xs">
                        Photo
                      </Badge>
                      <Badge variant={member.documents.employmentProof ? "default" : "secondary"} className="text-xs">
                        Employment
                      </Badge>
                    </div>
                  </div>
                </div>

                {member.status === 'pending' && (
                  <div className="flex space-x-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedMember(member)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Review
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleApprove(member.id)}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(member.id)}
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No members found matching your criteria</p>
            </CardContent>
          </Card>
        )}

        {/* Member Detail Modal */}
        {selectedMember && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Member Review</span>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserCheck className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold">{selectedMember.firstName} {selectedMember.lastName}</h3>
                  <p className="text-sm text-gray-600">{selectedMember.email}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <strong>Phone:</strong>
                      <p className="text-gray-600">{selectedMember.phone}</p>
                    </div>
                    <div>
                      <strong>Company:</strong>
                      <p className="text-gray-600">{selectedMember.company}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <strong>Position:</strong>
                      <p className="text-gray-600">{selectedMember.position}</p>
                    </div>
                    <div>
                      <strong>Union Role:</strong>
                      <p className="text-gray-600">{selectedMember.unionPosition}</p>
                    </div>
                  </div>

                  <div>
                    <strong>Application Date:</strong>
                    <p className="text-gray-600">{new Date(selectedMember.applicationDate).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <strong>Document Status:</strong>
                    <div className="space-y-1 mt-2">
                      <div className="flex justify-between items-center">
                        <span>Membership Form:</span>
                        {selectedMember.documents.membershipForm ? 
                          <CheckCircle className="w-4 h-4 text-green-600" /> : 
                          <XCircle className="w-4 h-4 text-red-600" />
                        }
                      </div>
                      <div className="flex justify-between items-center">
                        <span>ID Photo:</span>
                        {selectedMember.documents.idPhoto ? 
                          <CheckCircle className="w-4 h-4 text-green-600" /> : 
                          <XCircle className="w-4 h-4 text-red-600" />
                        }
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Employment Proof:</span>
                        {selectedMember.documents.employmentProof ? 
                          <CheckCircle className="w-4 h-4 text-green-600" /> : 
                          <XCircle className="w-4 h-4 text-red-600" />
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedMember(null)}
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(selectedMember.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleReject(selectedMember.id)}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}