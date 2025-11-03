import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, CreditCard, Truck, CheckCircle, Clock, AlertCircle, MapPin, Package, Shield } from 'lucide-react';
import { AppLayout } from './AppLayout';
import type { User as UserType } from '../App';

interface PhysicalCardProps {
  user: UserType | null;
  onNavigate: (screen: string) => void;
  onLogout?: () => void;
}

export function PhysicalCard({ user, onNavigate, onLogout }: PhysicalCardProps) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  if (!user) return null;

  // If user is not approved, show restricted access
  if (!user.isApproved) {
    return (
      <AppLayout
        currentScreen="physicalCard"
        onNavigate={onNavigate}
        onLogout={onLogout}
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Physical Card Not Available
            </h2>
            <p className="text-gray-600 mb-6">
              Your membership application is still under review. Physical ID card requests will be available once your membership is approved.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-800">Application Status</span>
                <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>
              </div>
              <p className="text-xs text-yellow-700 mt-2">
                Physical cards issued after membership approval
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

  // Mock existing request for demo
  const hasExistingRequest = false;
  const mockRequest = {
    id: 'PCR-2024-001234',
    requestDate: '2024-03-01',
    status: 'processing' as const,
    paymentStatus: 'paid' as const,
    trackingNumber: 'ALU-TRACK-789012',
    estimatedDelivery: '2024-03-15'
  };

  const handleSubmitRequest = () => {
    alert('Request submitted successfully! Please visit our office for payment and card collection.');
    setShowRequestForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'paid':
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
      case 'pending':
      case 'shipped':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <AppLayout
      currentScreen="physicalCard"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="min-h-screen bg-white">
        {/* Page Header */}
        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-light text-gray-900 mb-2">Physical ID Card</h1>
              <p className="text-gray-600">Request your official ALUzon member identification card</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Request Form */}
            <div className="space-y-8">
              {/* Current Request Status */}
              {hasExistingRequest ? (
                <div className="bg-gray-50 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium text-gray-900">Request Status</h2>
                    <Badge className={getStatusColor(mockRequest.status)}>
                      {getStatusIcon(mockRequest.status)}
                      <span className="ml-2 capitalize">{mockRequest.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Request ID</span>
                      <span className="font-mono text-gray-900">{mockRequest.id}</span>
                    </div>
                    
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Submitted</span>
                      <span className="text-gray-900">{new Date(mockRequest.requestDate).toLocaleDateString()}</span>
                    </div>

                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Payment Status</span>
                      <Badge className="bg-green-100 text-green-800">Office Payment Required</Badge>
                    </div>

                    {mockRequest.trackingNumber && (
                      <div className="flex justify-between py-3">
                        <span className="text-gray-600">Tracking</span>
                        <span className="font-mono text-blue-600">{mockRequest.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* New Request Form */
                <div className="space-y-8">
                  {/* Office Notice */}
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-amber-600 mt-1" />
                      <div>
                        <h3 className="font-medium text-amber-900 mb-1">Office Collection Required</h3>
                        <p className="text-sm text-amber-800">
                          Payment and card collection must be done at our office. No online payment or delivery available.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Member Information */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="font-medium text-gray-900 mb-4">Member Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name</span>
                        <span className="text-gray-900">{user.firstName} {user.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member ID</span>
                        <span className="font-mono text-gray-900">{user.digitalId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company</span>
                        <span className="text-gray-900">{user.company}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="font-medium text-gray-900 mb-4">Pricing</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-600">Card Fee</span>
                        <span className="font-semibold text-gray-900">₱150.00</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Processing Fee</span>
                        <span>FREE</span>
                      </div>
                    </div>
                  </div>

                  {/* Request Form */}
                  {showRequestForm ? (
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                        <h4 className="font-medium text-blue-900 mb-3">Processing Details</h4>
                        <ul className="text-sm text-blue-800 space-y-2">
                          <li>• Card ready for pickup in 3-5 business days</li>
                          <li>• SMS notification when ready</li>
                          <li>• Valid for 2 years from issue date</li>
                          <li>• Bring valid ID for collection</li>
                        </ul>
                      </div>

                      <div className="flex space-x-4">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setShowRequestForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          className="flex-1 bg-gray-900 hover:bg-gray-800"
                          onClick={handleSubmitRequest}
                        >
                          Confirm Request
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      className="w-full bg-gray-900 hover:bg-gray-800 py-4"
                      onClick={() => setShowRequestForm(true)}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Request Physical Card
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Card Preview & Info */}
            <div className="space-y-8">
              {/* Card Preview */}
              <div className="text-center">
                <h3 className="font-medium text-gray-900 mb-6">Card Preview</h3>
                <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-2xl p-8 aspect-[1.6/1] relative overflow-hidden shadow-2xl mx-auto max-w-sm">
                  {/* Subtle Watermark */}
                  <div className="absolute inset-0 opacity-5">
                    <CreditCard className="w-32 h-32 absolute top-4 right-4" />
                  </div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="text-center">
                      <h4 className="text-lg font-light">ALUzon</h4>
                      <p className="text-xs opacity-75">Member ID Card</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs opacity-75 font-mono">{user.digitalId}</p>
                      <p className="text-xs opacity-75">{user.company}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs opacity-50">Valid until March 2026</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Actual card includes QR code and security features
                </p>
              </div>

              {/* Office Information */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-medium text-gray-900 mb-4">ALUzon Office</h3>
                <div className="space-y-4">
                  <div 
                    className="flex items-start space-x-3 p-3 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    onClick={() => window.open('tel:(02)8123-4567', '_self')}
                  >
                    <Package className="w-5 h-5 text-gray-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Card Services</p>
                      <p className="text-sm text-blue-600">(02) 8123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3">
                    <Clock className="w-5 h-5 text-gray-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Office Hours</p>
                      <p className="text-sm text-gray-600">Mon-Fri: 8:00 AM - 5:00 PM</p>
                      <p className="text-sm text-gray-600">Sat: 8:00 AM - 12:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3">
                    <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-sm text-gray-600">No. 262, 15th Ave., Brgy. Silangan</p>
                      <p className="text-sm text-gray-600">Cubao, Quezon City</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Benefits */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-medium text-gray-900 mb-4">Card Benefits</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    Official union identification
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    Access to member events and facilities
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    Banking facility access for BDO employees
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    Partner discounts and privileges
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}