import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, Scale, Stethoscope, MapPin, Calendar, Phone, Mail, FileText, Download, AlertTriangle, X, Paperclip, Image, Trash2, Upload, Shield } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AppLayout } from './AppLayout';

interface BenefitsProps {
  onNavigate: (screen: string) => void;
  onLogout?: () => void;
  user?: any;
}

export function Benefits({ onNavigate, onLogout, user }: BenefitsProps) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showMyRequests, setShowMyRequests] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [mockRequests, setMockRequests] = useState([
    {
      id: 'TCK-2025-0125',
      title: 'Medical Assistance',
      category: 'medical',
      status: 'pending',
      priority: 'high',
      date: '2025-01-15',
      description: 'Emergency medical support request for hospitalization coverage',
      confidence: '91%',
      icon: Stethoscope
    },
    {
      id: 'TCK-2025-0118',
      title: 'Legal Support',
      category: 'legal',
      status: 'assigned',
      priority: 'normal',
      date: '2025-01-10',
      description: 'Legal advice needed for employment contract review',
      confidence: '84%',
      icon: Scale
    },
    {
      id: 'TCK-2025-0102',
      title: 'Educational Support',
      category: 'education',
      status: 'completed',
      priority: 'normal',
      date: '2025-01-02',
      description: 'Scholarship application assistance completed successfully',
      confidence: '88%',
      icon: Calendar
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'assigned': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const validFiles: File[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    
    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        alert(`File "${file.name}" is not a supported format. Please use images or PDF files.`);
        return;
      }
      
      // Check if file is already attached
      if (attachedFiles.some(f => f.name === file.name && f.size === file.size)) {
        alert(`File "${file.name}" is already attached.`);
        return;
      }
      
      validFiles.push(file);
    });
    
    if (attachedFiles.length + validFiles.length > 5) {
      alert('Maximum 5 files allowed per request.');
      return;
    }
    
    setAttachedFiles(prev => [...prev, ...validFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    return FileText;
  };
  const benefits = [
    {
      icon: Scale,
      title: 'Technical and Free Legal Assistance',
      description: 'Professional legal support for labor-related cases',
      details: [
        'Free consultation for employment disputes',
        'Representation in labor arbitration cases',
        'Assistance with NLRC filings',
        'Contract review and advice',
        'Workers\' rights education'
      ],
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 border-blue-200'
    },
    {
      icon: Stethoscope,
      title: 'Free Medical Services',
      description: 'Comprehensive healthcare benefits for members',
      details: [
        'Free laboratory tests',
        'X-Ray services',
        'Ultrasound examinations',
        'ECG (Electrocardiogram)',
        '2D Echo tests',
        'Complete dental services'
      ],
      color: 'bg-green-500',
      bgColor: 'bg-green-50 border-green-200'
    },
    {
      icon: MapPin,
      title: 'Discounted ALUzon Facilities',
      description: 'Special rates for union properties and amenities',
      details: [
        ' One Resort bookings at member rates',
        'Discounted hotel accommodations',
        'Conference room rentals',
        'Event venue bookings',
        'Recreation facility access'
      ],
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 border-purple-200'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Free Medical Mission',
      date: 'March 15, 2024',
      time: '8:00 AM - 5:00 PM',
      location: 'ALUzon Medical Center, Makati',
      services: ['Blood tests', 'X-Ray', 'Dental check-up']
    },
    {
      title: 'Legal Consultation Day',
      date: 'March 22, 2024',
      time: '9:00 AM - 4:00 PM',
      location: 'ALUzon Main Office, Quezon City',
      services: ['Labor law consultation', 'Contract review']
    },
    {
      title: 'Resort Weekend Promo',
      date: 'March 30 - 31, 2024',
      time: 'Check-in: 2:00 PM',
      location: 'ALUzon Beach Resort, Batangas',
      services: ['50% off room rates', 'Free breakfast']
    }
  ];

  // If user is not approved, show limited access
  if (user && !user.isApproved) {
    return (
      <AppLayout
        currentScreen="benefits"
        onNavigate={onNavigate}
        onLogout={onLogout}
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Benefits Not Available
            </h2>
            <p className="text-gray-600 mb-6">
              Your membership application is still under review. Member benefits and assistance requests will be available once your membership is approved.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-800">Application Status</span>
                <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>
              </div>
              <p className="text-xs text-yellow-700 mt-2">
                Submitted: {new Date(user.membershipDate).toLocaleDateString()}
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
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      currentScreen="benefits"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header - Mobile Only */}
      <div className="lg:hidden bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-lg font-semibold">Member Benefits</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Header - Desktop Only */}
      <div className="hidden lg:block bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-800">Member Benefits & Assistance</h1>
              <p className="text-sm text-gray-600">Access your comprehensive union benefits and request assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 lg:py-8 max-w-md mx-auto lg:max-w-6xl xl:max-w-7xl">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 space-y-6 lg:space-y-0">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            {/* Hero Section */}
            <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white shadow-2xl border-0 overflow-hidden">
              <CardContent className="p-6 lg:p-8 text-center relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-20 h-20 border border-white/20 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 border border-white/20 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/3 w-12 h-12 border border-white/20 rounded-full"></div>
                </div>
                
                <div className="relative z-10">
                  <h2 className="text-2xl lg:text-3xl font-bold mb-3">ALUzon Member Benefits</h2>
                  <p className="text-blue-100 mb-6 text-lg lg:text-xl max-w-2xl mx-auto">
                    Comprehensive support for your professional and personal needs
                  </p>
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1551260627-fd1b6daa6224?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5raW5nJTIwZmluYW5jaWFsJTIwc2VydmljZXN8ZW58MXx8fHwxNzU3MjA5MjMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Union Benefits"
                      className="w-full h-40 lg:h-48 object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request Assistance Section */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-xl border-2">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center text-lg lg:text-xl">
                  <FileText className="w-6 h-6 mr-3" />
                  Request Assistance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-green-800 mb-6 lg:text-lg">
                  Need help with benefits? Submit a request and our AI-powered system will route it to the right team for quick assistance.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[
                    { 
                      icon: Stethoscope, 
                      title: 'Medical Assistance', 
                      desc: 'Emergency medical support, consultations',
                      color: 'bg-red-500',
                      category: 'medical'
                    },
                    { 
                      icon: Scale, 
                      title: 'Legal Support', 
                      desc: 'Legal advice, representation, disputes',
                      color: 'bg-blue-500',
                      category: 'legal'
                    },
                    { 
                      icon: MapPin, 
                      title: 'Resort Booking', 
                      desc: 'Recreation facilities, reservations',
                      color: 'bg-green-500',
                      category: 'recreation'
                    },
                    { 
                      icon: Calendar, 
                      title: 'Educational Support', 
                      desc: 'Scholarships, training programs',
                      color: 'bg-purple-500',
                      category: 'education'
                    },
                    { 
                      icon: Phone, 
                      title: 'General Inquiry', 
                      desc: 'Questions about benefits, policies',
                      color: 'bg-gray-500',
                      category: 'general'
                    },
                    { 
                      icon: AlertTriangle, 
                      title: 'Emergency Support', 
                      desc: 'Urgent assistance needed',
                      color: 'bg-orange-500',
                      category: 'emergency'
                    }
                  ].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setShowRequestForm(true);
                        setSelectedCategory(item.category);
                      }}
                      className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-green-200 hover:border-green-400 text-left group"
                    >
                      <div className={`${item.color} rounded-full p-3 w-fit mb-3 group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Quick Submit</h4>
                  <div className="flex gap-3">
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                      onClick={() => setShowRequestForm(true)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Submit New Request
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-green-600 text-green-600 hover:bg-green-50"
                      onClick={() => setShowMyRequests(true)}
                    >
                      Track Requests
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* My Active Requests */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center justify-between text-lg lg:text-xl">
                  <div className="flex items-center">
                    <FileText className="w-6 h-6 mr-3 text-blue-600" />
                    My Active Requests
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {mockRequests.filter(r => r.status !== 'completed').length} Active
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {mockRequests.filter(r => r.status !== 'completed').length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No active requests. Submit a new request above to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockRequests.filter(r => r.status !== 'completed').map((request, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`${getStatusColor(request.status)} rounded-full p-2`}>
                              <request.icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{request.title}</h4>
                              <p className="text-sm text-gray-600">ID: {request.id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusBadgeColor(request.status)}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">{request.date}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{request.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Priority: {request.priority}</span>
                            <span>•</span>
                            <span>Confidence: {request.confidence}</span>
                          </div>
                          <Button size="sm" variant="outline" className="text-xs">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Main Benefits */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Your Benefits Package</h3>
                <p className="text-gray-600 lg:text-lg">Access comprehensive support services designed for ALU members</p>
              </div>
              
              <div className="grid gap-4 lg:gap-6">
                {benefits.map((benefit, index) => (
                  <Card 
                    key={index} 
                    className={`${benefit.bgColor} hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-0`}
                    onClick={() => {
                      // Add click handlers for different benefits
                      if (benefit.title.toLowerCase().includes('legal')) {
                        setSelectedCategory('legal');
                        setShowRequestForm(true);
                      } else if (benefit.title.toLowerCase().includes('medical')) {
                        setSelectedCategory('medical');
                        setShowRequestForm(true);
                      } else if (benefit.title.toLowerCase().includes('recreation')) {
                        setSelectedCategory('recreation');
                        setShowRequestForm(true);
                      }
                    }}
                  >
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-start lg:items-center text-base lg:text-lg">
                        <div className={`${benefit.color} rounded-full p-3 mr-4 shadow-lg`}>
                          <benefit.icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">{benefit.title}</h4>
                          <p className="text-sm lg:text-base text-gray-600 font-normal mt-1">{benefit.description}</p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-3">
                        {benefit.details.map((detail, idx) => (
                          <li key={idx} className="text-sm lg:text-base text-gray-700 flex items-start">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Button 
                          size="sm" 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (benefit.title.toLowerCase().includes('legal')) {
                              setSelectedCategory('legal');
                            } else if (benefit.title.toLowerCase().includes('medical')) {
                              setSelectedCategory('medical');
                            } else if (benefit.title.toLowerCase().includes('recreation')) {
                              setSelectedCategory('recreation');
                            }
                            setShowRequestForm(true);
                          }}
                        >
                          Request Assistance
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* How to Access Benefits */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center text-lg lg:text-xl">
                  <FileText className="w-6 h-6 mr-3 text-blue-600" />
                  How to Access Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  { num: '1', title: 'Submit Request Online', desc: 'Use our AI-powered system to submit assistance requests', action: () => setShowRequestForm(true) },
                  { num: '2', title: 'Present Your Digital ID', desc: 'Show your digital union ID or QR code for verification', action: () => onNavigate('digitalId') },
                  { num: '3', title: 'Track Your Request', desc: 'Monitor progress and receive real-time updates', action: () => setShowMyRequests(true) },
                  { num: '4', title: 'Verify Membership Status', desc: 'Ensure your dues are up to date for full benefits', action: () => onNavigate('dues') }
                ].map((step, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={step.action}
                  >
                    <Badge className="mt-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-base font-bold">{step.num}</Badge>
                    <div className="flex-1">
                      <h4 className="font-semibold text-base lg:text-lg text-gray-800">{step.title}</h4>
                      <p className="text-sm lg:text-base text-gray-600 mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI Assistance Status */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center text-lg">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  AI Assistance System
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-purple-800">System Status</span>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-purple-800">Avg Response Time</span>
                    <span className="text-sm text-purple-600">&lt; 2 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-purple-800">Auto-Assignment Rate</span>
                    <span className="text-sm text-purple-600">71%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-purple-800">AI Confidence</span>
                    <span className="text-sm text-purple-600">84%</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-700">
                    Our AI system automatically categorizes and routes your requests to the most qualified team members for faster resolution.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="w-5 h-5 mr-2 text-green-600" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div 
                    key={index} 
                    className="border-l-4 border-green-500 pl-4 py-3 hover:bg-gray-50 rounded-r-lg transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedCategory('general');
                      setShowRequestForm(true);
                    }}
                  >
                    <h4 className="font-semibold text-sm lg:text-base text-gray-800">{event.title}</h4>
                    <p className="text-xs lg:text-sm text-gray-600 mt-1">{event.date} • {event.time}</p>
                    <p className="text-xs lg:text-sm text-gray-600 flex items-center mt-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      {event.location}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {event.services.map((service, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center text-lg">
                  <Phone className="w-5 h-5 mr-2 text-blue-600" />
                  Quick Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {[
                  { icon: Phone, title: 'Legal Assistance', contact: '(02) 8123-4567 ext. 201', action: () => window.open('tel:(02)8123-4567', '_self') },
                  { icon: Stethoscope, title: 'Medical Services', contact: '(02) 8123-4567 ext. 202', action: () => window.open('tel:(02)8123-4567', '_self') },
                  { icon: MapPin, title: 'Resort Bookings', contact: '(02) 8123-4567 ext. 203', action: () => window.open('tel:(02)8123-4567', '_self') },
                  { icon: Mail, title: 'General Inquiries', contact: 'benefits@ALUzon.org.ph', action: () => window.open('mailto:benefits@ALUzon.org.ph', '_self') }
                ].map((contact, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    onClick={contact.action}
                  >
                    <contact.icon className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{contact.title}</p>
                      <p className="text-xs text-blue-600 hover:text-blue-800">{contact.contact}</p>
                    </div>
                  </div>
                ))}
                
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Office Hours: Monday - Friday, 8:00 AM - 5:00 PM
                  </p>
                  <p className="text-xs text-green-600 text-center mt-1 font-medium">
                    24/7 Emergency Support Available
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Important Notes */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
              <CardContent className="p-4">
                <h3 className="font-bold text-yellow-800 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Important Notes
                </h3>
                <ul className="text-sm text-yellow-700 space-y-2">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2 mt-2"></div>
                    All benefits require active membership with updated dues
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2 mt-2"></div>
                    Emergency requests are prioritized automatically
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2 mt-2"></div>
                    AI system routes requests to qualified specialists
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2 mt-2"></div>
                    Benefits are non-transferable and for members only
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons - Full Width */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 lg:mt-12">
          <Button 
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 py-3"
            onClick={() => setShowRequestForm(true)}
          >
            <FileText className="w-5 h-5 mr-2" />
            Request Assistance
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-center border-blue-600 text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 py-3"
            onClick={() => onNavigate('digitalId')}
          >
            <Download className="w-5 h-5 mr-2" />
            Show Digital ID
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-center border-purple-600 text-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 py-3"
            onClick={() => setShowMyRequests(true)}
          >
            <FileText className="w-5 h-5 mr-2" />
            Track Requests
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-center border-gray-600 text-gray-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 py-3"
            onClick={() => onNavigate('dashboard')}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Request Assistance Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-6 h-6 mr-3" />
                  Request Assistance
                </div>
                <button
                  onClick={() => {
                    setShowRequestForm(false);
                    setAttachedFiles([]);
                    setSelectedCategory('');
                  }}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form className="space-y-8">
                <div className="space-y-2">
                  <label className="text-gray-900 font-medium">Category</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Choose assistance type</option>
                    <option value="medical">Medical Assistance</option>
                    <option value="legal">Legal Support</option>
                    <option value="education">Educational Support</option>
                    <option value="general">General Inquiry</option>
                    <option value="emergency">Emergency Support</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-900 font-medium">Subject</label>
                  <input 
                    type="text"
                    placeholder="What do you need help with?"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-900 font-medium">Details</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe your request in detail. The more information you provide, the better we can assist you."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="space-y-3">
                  <label className="text-gray-900 font-medium">Attachments</label>
                  <div className="space-y-4">
                    {/* File Drop Zone */}
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 ${
                        dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('fileInput')?.click()}
                    >
                      <input
                        id="fileInput"
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e.target.files)}
                      />
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                        <p className="text-gray-600 mb-1">Drop files here or click to browse</p>
                        <p className="text-sm text-gray-500">Support: Images (JPG, PNG, GIF, WebP) and PDF files</p>
                        <p className="text-xs text-gray-400 mt-1">Maximum 5 files, 10MB each</p>
                      </div>
                    </div>

                    {/* Attached Files Preview */}
                    {attachedFiles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Attached Files ({attachedFiles.length}/5)</h4>
                        <div className="space-y-2">
                          {attachedFiles.map((file, index) => {
                            const FileIcon = getFileIcon(file.type);
                            return (
                              <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                  <div className="flex-shrink-0">
                                    {file.type.startsWith('image/') ? (
                                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Image className="w-5 h-5 text-blue-600" />
                                      </div>
                                    ) : (
                                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-red-600" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-gray-900 font-medium">Contact Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="relative">
                      <input type="radio" name="contact" value="phone" className="peer sr-only" />
                      <div className="flex items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:text-blue-700 transition-all">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>Phone Call</span>
                      </div>
                    </label>
                    <label className="relative">
                      <input type="radio" name="contact" value="email" className="peer sr-only" />
                      <div className="flex items-center justify-center p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer peer-checked:bg-blue-50 peer-checked:border-blue-500 peer-checked:text-blue-700 transition-all">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>Email</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Our AI system will automatically prioritize and route your request to the most qualified team member for faster assistance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="button"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => {
                      // Handle form submission
                      const newRequest = {
                        id: `TCK-2025-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
                        title: selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) + ' Assistance',
                        category: selectedCategory,
                        status: 'pending',
                        priority: 'normal',
                        date: new Date().toLocaleDateString(),
                        description: `Request submitted via member portal${attachedFiles.length > 0 ? ` with ${attachedFiles.length} attachment(s)` : ''}`,
                        confidence: Math.floor(Math.random() * 20) + 80 + '%',
                        icon: selectedCategory === 'medical' ? Stethoscope : 
                              selectedCategory === 'legal' ? Scale : 
                              selectedCategory === 'recreation' ? MapPin : 
                              selectedCategory === 'education' ? Calendar : FileText
                      };
                      setMockRequests([newRequest, ...mockRequests]);
                      setShowRequestForm(false);
                      setSelectedCategory('');
                      setAttachedFiles([]);
                      alert(`Request submitted successfully with ${attachedFiles.length} attachment(s)! You will receive updates via your preferred contact method.`);
                    }}
                  >
                    Submit Request
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => {
                      setShowRequestForm(false);
                      setAttachedFiles([]);
                      setSelectedCategory('');
                    }}
                    className="px-6 h-12 rounded-xl font-medium border-gray-200 text-gray-600 hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* My Requests Modal */}
      {showMyRequests && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-6 h-6 mr-3" />
                  My Assistance Requests
                </div>
                <button
                  onClick={() => setShowMyRequests(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {mockRequests.map((request, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`${getStatusColor(request.status)} rounded-full p-2`}>
                          <request.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{request.title}</h4>
                          <p className="text-sm text-gray-600">ID: {request.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusBadgeColor(request.status)}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{request.date}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{request.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Priority: {request.priority}</span>
                        <span>•</span>
                        <span>AI Confidence: {request.confidence}</span>
                        <span>•</span>
                        <span>Category: {request.category}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          View Details
                        </Button>
                        {request.status === 'pending' && (
                          <Button size="sm" variant="outline" className="text-xs text-red-600 border-red-300 hover:bg-red-50">
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </AppLayout>
  );
}