import { useState } from 'react';
import { Settings, Users, Building, Shield, Mail, Database, HardDrive, Bot, Edit, Lock, Eye, EyeOff } from 'lucide-react';
import { AISettings } from './AISettings';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Checkbox } from './ui/checkbox';

const adminUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@aluzon.org',
    role: 'Super Admin',
    status: 'Active',
    lastLogin: '2024-09-20 14:30',
    permissions: ['All Access'],
  },
  {
    id: '2',
    name: 'Finance Manager',
    email: 'finance@aluzon.org',
    role: 'Finance Admin',
    status: 'Active',
    lastLogin: '2024-09-20 09:15',
    permissions: ['Dues Management', 'Financial Reports'],
  },
  {
    id: '3',
    name: 'Registration Officer',
    email: 'registration@aluzon.org',
    role: 'Approver',
    status: 'Active',
    lastLogin: '2024-09-19 16:45',
    permissions: ['Member Registration', 'ID Issuance'],
  },
];

const companies = [
  { id: '1', name: 'Banco de Oro (BDO)', code: 'BDO', members: 4250, status: 'Active' },
  { id: '2', name: 'SM Investments Corp', code: 'SM', members: 2890, status: 'Active' },
  { id: '3', name: 'Ayala Corporation', code: 'AYALA', members: 2340, status: 'Active' },
  { id: '4', name: 'PLDT Inc.', code: 'PLDT', members: 1890, status: 'Active' },
  { id: '5', name: 'Jollibee Foods Corporation', code: 'JFC', members: 1567, status: 'Active' },
];

const unions = [
  { id: '1', name: 'BDO Employees Union', members: 4250, president: 'Juan Santos' },
  { id: '2', name: 'SM Workers Union', members: 2890, president: 'Maria Lopez' },
  { id: '3', name: 'Ayala Employees Association', members: 2340, president: 'Pedro Garcia' },
  { id: '4', name: 'Telecom Workers Union', members: 1890, president: 'Ana Rodriguez' },
  { id: '5', name: 'Fast Food Workers Union', members: 1567, president: 'Carlos Mendoza' },
];

const allPermissions = [
  { id: 'all_access', label: 'All Access', description: 'Complete system access and administration rights' },
  { id: 'user_management', label: 'User Management', description: 'Create, edit, and manage admin accounts' },
  { id: 'member_registration', label: 'Member Registration', description: 'Review and approve member registrations' },
  { id: 'id_issuance', label: 'ID Issuance', description: 'Generate and manage member IDs and cards' },
  { id: 'dues_management', label: 'Dues Management', description: 'Process payments and manage member dues' },
  { id: 'financial_reports', label: 'Financial Reports', description: 'Access and generate financial reports' },
  { id: 'payment_reconciliation', label: 'Payment Reconciliation', description: 'Reconcile payments and financial transactions' },
  { id: 'member_data_access', label: 'Member Data Access', description: 'View and edit member personal information' },
  { id: 'bulk_operations', label: 'Bulk Operations', description: 'Perform bulk member operations and imports' },
  { id: 'system_settings', label: 'System Settings', description: 'Configure system-wide settings and preferences' },
  { id: 'data_export', label: 'Data Export', description: 'Export member data and generate reports' },
  { id: 'audit_logs', label: 'Audit Logs', description: 'View system audit logs and activity reports' },
];

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState('users');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getRoleBadge = (role: string) => {
    const variants = {
      'Super Admin': 'destructive',
      'Finance Admin': 'default',
      'Approver': 'secondary',
      'Support': 'outline',
    } as const;
    
    return <Badge variant={variants[role as keyof typeof variants] || 'outline'}>{role}</Badge>;
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setIsAuthenticated(false);
    setAdminPassword('');
    setShowPermissionDialog(true);
  };

  const handleAuthenticateAdmin = () => {
    // In a real app, this would verify against the current admin's credentials
    if (adminPassword === 'admin123') { // Demo password
      setIsAuthenticated(true);
    } else {
      alert('Invalid password. Please try again.');
    }
  };

  const getUserPermissions = (userId: string) => {
    const user = adminUsers.find(u => u.id === userId);
    if (!user) return [];
    
    // Map user permissions to permission IDs
    if (user.permissions.includes('All Access')) {
      return allPermissions.map(p => p.id);
    }
    
    return user.permissions.map(permission => {
      const mapping: any = {
        'Dues Management': 'dues_management',
        'Financial Reports': 'financial_reports',
        'Member Registration': 'member_registration',
        'ID Issuance': 'id_issuance',
      };
      return mapping[permission] || permission.toLowerCase().replace(/ /g, '_');
    });
  };

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    if (!editingUser) return;
    
    // Handle permission changes - in real app, this would update the backend
    console.log(`${checked ? 'Granting' : 'Revoking'} permission ${permissionId} for user ${editingUser.name}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Admin Settings</h1>
          <p className="text-muted-foreground">
            Manage system configurations, users, and organizational data
          </p>
        </div>
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          System Backup
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="unions">Unions</TabsTrigger>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
          <TabsTrigger value="system">System Config</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="data">Data & Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Administrator Accounts</h3>
            <Button>Add New Admin</Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <Badge variant="default">{user.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.permissions.slice(0, 2).map((permission, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                          {user.permissions.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{user.permissions.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit & Permissions
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6">

            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                    </div>
                    <Switch checked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Login Attempt Limit</Label>
                      <p className="text-sm text-muted-foreground">Lock account after failed attempts</p>
                    </div>
                    <Select defaultValue="5">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                        <SelectItem value="10">10 attempts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Audit Logging</Label>
                      <p className="text-sm text-muted-foreground">Log all admin actions</p>
                    </div>
                    <Switch checked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Permissions Dialog */}
          <AlertDialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
            <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Edit User & Permissions: {editingUser?.name}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Security verification required to modify user permissions.
                </AlertDialogDescription>
              </AlertDialogHeader>

              {!isAuthenticated ? (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-amber-800">
                      <Lock className="h-4 w-4" />
                      <span className="font-medium">Security Verification Required</span>
                    </div>
                    <p className="text-sm text-amber-700 mt-1">
                      Please enter your admin password to proceed with permission changes.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Admin Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter your admin password"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Demo password: admin123
                    </p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={handleAuthenticateAdmin}>
                      <Lock className="mr-2 h-4 w-4" />
                      Authenticate
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* User Info */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Authentication Successful</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      You can now modify permissions for {editingUser?.name}.
                    </p>
                  </div>

                  {/* Basic User Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input defaultValue={editingUser?.name} />
                    </div>
                    <div>
                      <Label>Email Address</Label>
                      <Input defaultValue={editingUser?.email} />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Select defaultValue={editingUser?.role.toLowerCase().replace(' ', '_')}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                          <SelectItem value="finance_admin">Finance Admin</SelectItem>
                          <SelectItem value="approver">Approver</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select defaultValue={editingUser?.status.toLowerCase()}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div>
                    <h4 className="font-medium mb-4">System Permissions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {allPermissions.map((permission) => {
                        const userPermissions = getUserPermissions(editingUser?.id || '');
                        const hasPermission = userPermissions.includes(permission.id);
                        
                        return (
                          <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                            <Checkbox
                              id={permission.id}
                              checked={hasPermission}
                              onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked as boolean)}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor={permission.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {permission.label}
                              </label>
                              <p className="text-xs text-muted-foreground">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>
                      Save Changes
                    </AlertDialogAction>
                  </div>
                </div>
              )}
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        <TabsContent value="companies" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Registered Companies</h3>
            <Button>Add New Company</Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell className="font-mono">{company.code}</TableCell>
                      <TableCell>{company.members.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="default">{company.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">View Members</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add New Company</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Company Name</Label>
                  <Input placeholder="Enter company name" />
                </div>
                <div>
                  <Label>Company Code</Label>
                  <Input placeholder="Enter short code" />
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea placeholder="Enter company description" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Industry</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banking">Banking & Finance</SelectItem>
                      <SelectItem value="retail">Retail & Commerce</SelectItem>
                      <SelectItem value="telecom">Telecommunications</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select defaultValue="active">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button>Add Company</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Affiliated Unions</h3>
            <Button>Add New Union</Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Union Name</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>President</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unions.map((union) => (
                    <TableRow key={union.id}>
                      <TableCell className="font-medium">{union.name}</TableCell>
                      <TableCell>{union.members.toLocaleString()}</TableCell>
                      <TableCell>{union.president}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Officers</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Union Positions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  'President',
                  'Vice President', 
                  'Secretary',
                  'Treasurer',
                  'Auditor',
                  'Board Member',
                  'Member'
                ].map((position, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">{position}</span>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input placeholder="Add new position" className="flex-1" />
                <Button>Add Position</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <AISettings />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Organization Name</Label>
                  <Input defaultValue="TUCP ALU" />
                </div>
                
                <div>
                  <Label>System Name</Label>
                  <Input defaultValue="ALUzon" />
                </div>
                
                <div>
                  <Label>Contact Email</Label>
                  <Input defaultValue="admin@aluzon.org" />
                </div>
                
                <div>
                  <Label>Support Phone</Label>
                  <Input defaultValue="+63 2 1234 5678" />
                </div>
                
                <div>
                  <Label>Address</Label>
                  <Textarea defaultValue="123 Union Street, Manila, Philippines" />
                </div>
                
                <Button>Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>SMTP Server</Label>
                  <Input defaultValue="smtp.gmail.com" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Port</Label>
                    <Input defaultValue="587" />
                  </div>
                  <div>
                    <Label>Security</Label>
                    <Select defaultValue="tls">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Username</Label>
                  <Input defaultValue="notifications@aluzon.org" />
                </div>
                
                <div>
                  <Label>Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Email Notifications</Label>
                  <Switch checked />
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline">Test Connection</Button>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ID & Card Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Member ID Format</Label>
                  <Input defaultValue="ALU-{YEAR}-{NUMBER}" />
                  <p className="text-sm text-muted-foreground">Use {`{YEAR}`} and {`{NUMBER}`} placeholders</p>
                </div>
                
                <div>
                  <Label>Digital ID Format</Label>
                  <Input defaultValue="DID-{NUMBER}-{YEAR}" />
                </div>
                
                <div>
                  <Label>Card Price</Label>
                  <Input defaultValue="150" type="number" />
                  <p className="text-sm text-muted-foreground">Price in PHP for physical cards</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Auto-generate Digital IDs</Label>
                  <Switch checked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Require Photo Upload</Label>
                  <Switch checked />
                </div>
                
                <Button>Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Database Status</span>
                    <Badge variant="default">Healthy</Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Last Backup</span>
                    <span className="text-sm text-muted-foreground">2024-09-20 02:00</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Storage Used</span>
                    <span className="text-sm text-muted-foreground">2.4 GB / 10 GB</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Active Users</span>
                    <span className="text-sm text-muted-foreground">8 online</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">System Uptime</span>
                    <span className="text-sm text-muted-foreground">45 days</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Database className="mr-2 h-4 w-4" />
                    Backup Now
                  </Button>
                  <Button variant="outline" size="sm">
                    <HardDrive className="mr-2 h-4 w-4" />
                    System Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <h3 className="text-lg font-medium">Email & Document Templates</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Registration Approval', usage: 47 },
                  { name: 'Registration Rejection', usage: 12 },
                  { name: 'Payment Reminder', usage: 234 },
                  { name: 'ID Ready Notification', usage: 89 },
                  { name: 'Welcome Email', usage: 156 },
                ].map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{template.name}</p>
                      <p className="text-xs text-muted-foreground">Used {template.usage} times</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Preview</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Document Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Membership Certificate', type: 'PDF' },
                  { name: 'ID Card Layout', type: 'Image' },
                  { name: 'Approval Letter', type: 'PDF' },
                  { name: 'Payment Receipt', type: 'PDF' },
                  { name: 'Membership Form', type: 'PDF' },
                ].map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{template.name}</p>
                      <p className="text-xs text-muted-foreground">{template.type} Template</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Privacy Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Retention Period</Label>
                    <p className="text-sm text-muted-foreground">How long to keep inactive member data</p>
                  </div>
                  <Select defaultValue="7">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 years</SelectItem>
                      <SelectItem value="5">5 years</SelectItem>
                      <SelectItem value="7">7 years</SelectItem>
                      <SelectItem value="10">10 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-delete Logs</Label>
                    <p className="text-sm text-muted-foreground">Automatically delete old audit logs</p>
                  </div>
                  <Switch checked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Anonymous Analytics</Label>
                    <p className="text-sm text-muted-foreground">Collect anonymized usage data</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Data Encryption</Label>
                    <p className="text-sm text-muted-foreground">Encrypt sensitive member data</p>
                  </div>
                  <Switch checked disabled />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Export & Backup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Automatic Backups</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Backup Retention</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button className="w-full">
                    <Database className="mr-2 h-4 w-4" />
                    Create Full Backup
                  </Button>
                  <Button variant="outline" className="w-full">
                    <HardDrive className="mr-2 h-4 w-4" />
                    Export All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Data Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Handle member requests for data access, correction, or deletion
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-sm text-muted-foreground">Pending Data Requests</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">15</p>
                      <p className="text-sm text-muted-foreground">Processed This Month</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">2.1</p>
                      <p className="text-sm text-muted-foreground">Avg. Days to Process</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Button>View Data Requests</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}