import { useState } from 'react';
import { Calendar, Plus, Edit, Eye, ExternalLink, Image, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { ImageWithFallback } from './figma/ImageWithFallback';

const events = [
  {
    id: '1',
    title: 'Annual General Assembly 2024',
    description: 'Join us for our yearly gathering of all TUCP ALU members to discuss achievements, future plans, and important union matters.',
    category: 'assembly',
    date: '2024-11-15',
    time: '09:00 AM',
    venue: 'SMX Convention Center, Pasay City',
    thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    externalLink: 'https://registration.aluevents.com/aga2024',
    hasExternalLink: true,
    status: 'Published',
    createdAt: '2024-09-20',
  },
  {
    id: '2',
    title: 'Labor Rights & Safety Seminar',
    description: 'Educational seminar focusing on current labor laws, workplace safety protocols, and member rights protection.',
    category: 'seminar',
    date: '2024-10-20',
    time: '02:00 PM',
    venue: 'Manila Hotel, Ermita',
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop',
    externalLink: '',
    hasExternalLink: false,
    status: 'Published',
    createdAt: '2024-09-15',
  },
  {
    id: '3',
    title: 'Health & Wellness Fair',
    description: 'Comprehensive information fair showcasing member benefits, wellness programs, and health services available to all ALU members.',
    category: 'wellness',
    date: '2024-12-05',
    time: '10:00 AM',
    venue: 'Quezon City Hall',
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    externalLink: 'https://wellness.aluevents.com',
    hasExternalLink: true,
    status: 'Draft',
    createdAt: '2024-09-18',
  },
];

const categories = [
  { value: 'assembly', label: 'General Assembly' },
  { value: 'seminar', label: 'Seminar/Training' },
  { value: 'wellness', label: 'Health & Wellness' },
  { value: 'social', label: 'Social Event' },
  { value: 'meeting', label: 'Union Meeting' },
  { value: 'other', label: 'Other' },
];

export function EventManagement() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    const variants = {
      'Published': 'default',
      'Draft': 'secondary',
      'Archived': 'outline',
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowCreateDialog(true);
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setShowCreateDialog(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Event Management</h1>
          <p className="text-muted-foreground">
            Create and manage events that appear in the ALUzon mobile app
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleCreateEvent}>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Event Title *</Label>
                  <Input 
                    placeholder="Enter event title" 
                    defaultValue={editingEvent?.title || ''}
                  />
                </div>
                <div>
                  <Label>Category *</Label>
                  <Select defaultValue={editingEvent?.category || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Event Description *</Label>
                <Textarea 
                  placeholder="Provide a detailed description that will appear in the mobile app" 
                  rows={4}
                  defaultValue={editingEvent?.description || ''}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Event Date *</Label>
                  <Input 
                    type="date" 
                    defaultValue={editingEvent?.date || ''}
                  />
                </div>
                <div>
                  <Label>Event Time *</Label>
                  <Input 
                    type="time" 
                    defaultValue={editingEvent?.time || ''}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select defaultValue={editingEvent?.status || 'Draft'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Venue/Location *</Label>
                <Input 
                  placeholder="Complete venue address or location details" 
                  defaultValue={editingEvent?.venue || ''}
                />
              </div>

              <div>
                <Label>Event Thumbnail Image URL</Label>
                <Input 
                  placeholder="https://example.com/image.jpg (recommended: 800x400px)" 
                  defaultValue={editingEvent?.thumbnail || ''}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This image will be displayed as the event card thumbnail in the mobile app
                </p>
              </div>

              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      External Link Redirect
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      When enabled, tapping the event card will redirect users to an external website
                    </p>
                  </div>
                  <Switch defaultChecked={editingEvent?.hasExternalLink || false} />
                </div>
                
                <div>
                  <Label>External Link URL</Label>
                  <Input 
                    placeholder="https://registration.example.com" 
                    defaultValue={editingEvent?.externalLink || ''}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Users will be redirected to this URL when they tap the event card
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowCreateDialog(false)}>
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Published Events</p>
                <p className="text-2xl font-bold">
                  {events.filter(e => e.status === 'Published').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ExternalLink className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">With External Links</p>
                <p className="text-2xl font-bold">
                  {events.filter(e => e.hasExternalLink).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Directory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Events Directory
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            These events will appear as cards in the ALUzon mobile app's Events tab
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Preview</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>External Link</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                        {event.thumbnail ? (
                          <ImageWithFallback
                            src={event.thumbnail}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-48">
                          {event.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar className="h-3 w-3" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Created: {event.createdAt}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getCategoryLabel(event.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{event.date}</div>
                      <div className="text-muted-foreground">{event.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {event.hasExternalLink ? (
                      <div className="flex items-center gap-1 text-sm">
                        <ExternalLink className="h-3 w-3" />
                        <span className="text-blue-600">Yes</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditEvent(event)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* How Events Appear in Mobile App */}
      <Card>
        <CardHeader>
          <CardTitle>Mobile App Preview</CardTitle>
          <p className="text-sm text-muted-foreground">
            This is how events will appear in the ALUzon mobile app
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="aspect-video bg-muted relative">
                  {event.thumbnail ? (
                    <ImageWithFallback
                      src={event.thumbnail}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  {event.hasExternalLink && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Link
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-2 line-clamp-2">{event.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}