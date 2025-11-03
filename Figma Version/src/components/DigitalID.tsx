import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { QrCode, RotateCcw, Shield, User, Building2 } from 'lucide-react';
import { AppLayout } from './AppLayout';
import type { User as UserType } from '../App';
import qrCodeImage from 'figma:asset/786363a7c5c02b1f52387e51334449bbd129cc7d.png';

interface DigitalIDProps {
  user: UserType | null;
  onNavigate: (screen: string) => void;
  onLogout?: () => void;
}

export function DigitalID({ user, onNavigate, onLogout }: DigitalIDProps) {
  const [showBack, setShowBack] = useState(false);

  if (!user) return null;

  // If user is not approved, show pending message
  if (!user.isApproved) {
    return (
      <AppLayout
        currentScreen="digitalId"
        onNavigate={onNavigate}
        onLogout={onLogout}
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Digital ID Not Available
            </h2>
            <p className="text-gray-600 mb-6">
              Your membership application is still under review. Your digital ID will be available once your membership is approved by ALU administrators.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-800">Application Status</span>
                <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>
              </div>
              <p className="text-xs text-yellow-700 mt-2">
                Member ID: {user.digitalId}
              </p>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={() => onNavigate('membershipForm')} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                View Application Form
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

  const generateQRCode = (data: string) => {
    // Simple QR code placeholder - in real app, use a proper QR code library
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" fill="white"/>
        <rect x="10" y="10" width="100" height="100" fill="none" stroke="black" stroke-width="2"/>
        <text x="60" y="65" text-anchor="middle" font-family="monospace" font-size="8" fill="black">${data}</text>
      </svg>
    `)}`;
  };

  return (
    <AppLayout
      currentScreen="digitalId"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="min-h-screen bg-white">
        {/* Header - Mobile Only */}
        <div className="flex items-center justify-between p-4 text-gray-800 max-w-7xl mx-auto lg:hidden border-b border-gray-100">
          <h1 className="text-lg font-semibold">Digital ID</h1>
          <button
            onClick={() => setShowBack(!showBack)}
            className="p-2 text-gray-600 hover:text-gray-800 bg-gray-50 rounded-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
        
        {/* Header - Desktop Only */}


      <div className="px-4 py-8 max-w-md mx-auto lg:max-w-6xl lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
        {/* ID Card Container */}
        <div className="flex justify-center">
          <div className="perspective-1000 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
            <div
              className={`relative w-full h-[32rem] sm:h-[34rem] lg:h-[36rem] xl:h-[40rem] transform-style-preserve-3d transition-transform duration-700 cursor-pointer ${
                showBack ? 'rotate-y-180' : ''
              }`}
              onClick={() => setShowBack(!showBack)}
            >
              {/* Front of Card */}
              <div className="absolute inset-0 backface-hidden">
                <Card className="w-full h-full border-0 shadow-2xl overflow-hidden bg-white">
                  <CardContent className="p-0 h-full relative">
                    {/* Header Section - Red Background with ALU Logo */}
                    <div className="relative bg-red-600 px-4 py-5 sm:py-6 lg:px-6 lg:py-6">
                      {/* Enhanced Watermark Pattern */}
                      <div className="absolute inset-0 opacity-20 bg-repeat" style={{
                        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
                          <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <pattern id="aluPattern" patternUnits="userSpaceOnUse" width="50" height="50">
                                <text x="25" y="15" text-anchor="middle" fill="white" font-size="10" font-family="Arial, sans-serif" font-weight="bold">ALU</text>
                                <text x="25" y="30" text-anchor="middle" fill="white" font-size="8" font-family="Arial, sans-serif">TUCP</text>
                                <text x="25" y="42" text-anchor="middle" fill="white" font-size="6" font-family="Arial, sans-serif">1954</text>
                              </pattern>
                            </defs>
                            <rect width="50" height="50" fill="url(#aluPattern)"/>
                          </svg>
                        `)}")`,
                        backgroundSize: '40px 40px'
                      }} />
                      
                      <div className="relative z-10 flex items-start space-x-3 sm:space-x-4">
                        {/* ALU Logo */}
                        <div className="w-18 h-18 sm:w-20 sm:h-20 lg:w-20 lg:h-20 bg-white rounded-full p-1 flex-shrink-0">
                          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center border-2 border-yellow-400">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center">
                              <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-10 lg:h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                                <span className="text-white text-base sm:text-lg lg:text-lg font-bold">A</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Organization Details */}
                        <div className="flex-1 min-w-0 text-white">
                          <h3 className="font-bold text-sm sm:text-base lg:text-base leading-tight">ASSOCIATED LABOR UNIONS (ALU)</h3>
                          <p className="text-xs sm:text-sm lg:text-sm opacity-95 leading-tight mt-1">No. 262, 15th Ave., Brgy. Silangan</p>
                          <p className="text-xs sm:text-sm lg:text-sm opacity-95 leading-tight">Cubao, Quezon City</p>
                          <p className="text-xs sm:text-sm lg:text-sm opacity-95 leading-tight">Philippines</p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm lg:text-sm mt-3 opacity-90 relative z-10">Founded in 1954 • Trade Union Congress of the Philippines</p>
                    </div>

                    {/* Member Section - Blue Background */}
                    <div className="bg-blue-700 px-4 py-4 sm:py-5 lg:py-5 relative">
                      {/* Subtle watermark */}
                      <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                        <span className="text-white text-5xl sm:text-6xl lg:text-7xl font-bold tracking-widest">MEMBER</span>
                      </div>
                      <h2 className="text-white text-xl sm:text-2xl lg:text-2xl font-bold tracking-wider text-center relative z-10">MEMBER</h2>
                    </div>

                    {/* Member Info Section - White Background */}
                    <div className="bg-white flex-1 px-5 py-5 sm:px-6 sm:py-6 lg:px-6 lg:py-6 space-y-5 relative">
                      {/* Background watermark */}
                      <div className="absolute inset-0 opacity-5 bg-repeat" style={{
                        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
                          <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
                            <text x="30" y="20" text-anchor="middle" fill="gray" font-size="8" font-family="Arial, sans-serif" font-weight="bold">ALU</text>
                            <text x="30" y="35" text-anchor="middle" fill="gray" font-size="6" font-family="Arial, sans-serif">OFFICIAL</text>
                            <text x="30" y="47" text-anchor="middle" fill="gray" font-size="6" font-family="Arial, sans-serif">MEMBER</text>
                          </svg>
                        `)}")`,
                        backgroundSize: '50px 50px'
                      }} />
                      
                      <div className="relative z-10">
                        <div className="text-center mb-4">
                          <p className="text-sm sm:text-base lg:text-base font-semibold text-gray-800">NATIONAL OFFICE</p>
                          <p className="text-xs sm:text-sm lg:text-sm text-gray-600 leading-tight">ASSOCIATED LABOR UNIONS-LUZON REGIONAL OFFICE</p>
                        </div>

                        {/* Photo Placeholder */}
                        <div className="flex justify-center mb-4">
                          <div className="w-20 h-24 sm:w-22 sm:h-26 lg:w-24 lg:h-28 bg-gray-100 border-2 border-gray-300 flex items-center justify-center shadow-sm">
                            {user.profilePicture ? (
                              <img 
                                src={user.profilePicture} 
                                alt="Member Photo" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-12 lg:h-12 bg-gray-300 rounded-full mx-auto mb-2"></div>
                                <p className="text-xs sm:text-sm text-gray-400">Photo</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Member Details */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm sm:text-base lg:text-base font-medium text-gray-800">ID No.:</span>
                            <span className="text-sm sm:text-base lg:text-base text-gray-600 font-mono">{user.digitalId.split('-').pop()}</span>
                          </div>
                          <div className="text-center">
                            <h3 className="font-bold text-lg sm:text-xl lg:text-xl text-gray-900 leading-tight">
                              {user.firstName.toUpperCase()} {user.lastName.toUpperCase()}
                            </h3>
                          </div>
                          <div className="text-center bg-gray-50 py-3 px-4 rounded">
                            <p className="text-sm sm:text-base lg:text-base text-gray-700">
                              <span className="font-medium">Member Since:</span> {new Date(user.membershipDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex justify-center">
                          {user.isApproved ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-sm">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              Verified Member
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-4 py-2 text-sm">
                              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                              Pending Approval
                            </Badge>
                          )}
                        </div>

                        {/* Signature Line */}
                        <div className="mt-5 pt-4 border-t-2 border-black">
                          <p className="text-center text-sm sm:text-base lg:text-base font-semibold text-gray-800">SIGNATURE</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Back of Card */}
              <div className="absolute inset-0 backface-hidden rotate-y-180">
                <Card className="w-full h-full bg-white border-0 shadow-2xl overflow-hidden">
                  <CardContent className="p-0 h-full relative flex flex-col">
                    {/* Header with ALU branding */}
                    <div className="bg-red-600 p-5 sm:p-6 lg:p-6 relative">
                      {/* Header watermark */}
                      <div className="absolute inset-0 opacity-15 bg-repeat" style={{
                        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
                          <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                            <text x="20" y="15" text-anchor="middle" fill="white" font-size="8" font-family="Arial, sans-serif" font-weight="bold">ALU</text>
                            <text x="20" y="28" text-anchor="middle" fill="white" font-size="6" font-family="Arial, sans-serif">DIGITAL</text>
                          </svg>
                        `)}")`,
                        backgroundSize: '30px 30px'
                      }} />
                      
                      <div className="flex items-center justify-center space-x-4 relative z-10">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-14 lg:h-14 bg-white rounded-full p-1">
                          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center border border-yellow-400">
                            <span className="text-white text-base sm:text-lg lg:text-lg font-bold">A</span>
                          </div>
                        </div>
                        <div className="text-white text-center">
                          <h3 className="font-bold text-lg sm:text-xl lg:text-xl">ALU DIGITAL ID</h3>
                          <p className="text-sm sm:text-base lg:text-base opacity-90">Verification Code</p>
                        </div>
                      </div>
                    </div>

                    {/* Main QR Code Area */}
                    <div className="flex-1 bg-white p-6 sm:p-8 lg:p-8 flex flex-col items-center justify-center relative">
                      {/* Enhanced Watermark Pattern */}
                      <div className="absolute inset-0 opacity-5 bg-repeat" style={{
                        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
                          <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="0.3">
                              <text x="40" y="25" text-anchor="middle" fill="gray" font-size="12" font-family="Arial, sans-serif" font-weight="bold">ALU</text>
                              <text x="40" y="40" text-anchor="middle" fill="gray" font-size="8" font-family="Arial, sans-serif">OFFICIAL</text>
                              <text x="40" y="55" text-anchor="middle" fill="gray" font-size="8" font-family="Arial, sans-serif">DIGITAL ID</text>
                              <text x="40" y="68" text-anchor="middle" fill="gray" font-size="6" font-family="Arial, sans-serif">TUCP</text>
                            </g>
                          </svg>
                        `)}")`,
                        backgroundSize: '60px 60px'
                      }} />
                      
                      {/* Large QR Code */}
                      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-xl border-2 border-gray-100 relative z-10">
                        <div className="w-44 h-44 sm:w-48 sm:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 bg-white border border-gray-200 flex items-center justify-center">
                          <img 
                            src={qrCodeImage} 
                            alt="Member QR Code" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>

                      {/* Member Info */}
                      <div className="mt-6 sm:mt-8 lg:mt-8 text-center space-y-4 relative z-10">
                        <div className="bg-gray-50 px-5 py-4 sm:px-6 sm:py-4 lg:px-6 lg:py-4 rounded-lg shadow-sm">
                          <p className="text-lg sm:text-xl lg:text-xl font-bold text-gray-800">
                            {user.firstName.toUpperCase()} {user.lastName.toUpperCase()}
                          </p>
                          <p className="text-sm sm:text-base lg:text-base text-gray-600 font-mono mt-1">{user.digitalId}</p>
                        </div>
                        
                        <div className="text-sm sm:text-base lg:text-base text-gray-600 space-y-3 bg-white p-4 rounded-lg border border-gray-200">
                          <p><strong>Member Since:</strong> {new Date(user.membershipDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                          <p><strong>Position:</strong> {user.unionPosition}</p>
                          <p><strong>Union:</strong> Associated Labor Unions</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-blue-700 p-4 sm:p-5 lg:p-5 relative">
                      {/* Footer watermark */}
                      <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                        <span className="text-white text-3xl sm:text-4xl lg:text-4xl font-bold tracking-wider">OFFICIAL</span>
                      </div>
                      <div className="text-center relative z-10">
                        <p className="text-white text-sm sm:text-base lg:text-base font-medium">
                          SCAN FOR MEMBER VERIFICATION
                        </p>
                        <p className="text-white text-xs sm:text-sm lg:text-sm opacity-90 mt-1">
                          ALU-TUCP © 2024 • Official Digital ID
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Controls and Instructions - Right Column on Desktop */}
        <div className="lg:col-span-1 space-y-6 mt-8 lg:mt-0">
          {/* Controls */}
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full bg-white border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm"
              onClick={() => setShowBack(!showBack)}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {showBack ? 'Show Front' : 'Show QR Code'}
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="bg-white border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm"
                onClick={() => onNavigate('physicalCard')}
              >
                Request Physical Card
              </Button>
              <Button
                variant="outline"
                className="bg-white border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm"
                onClick={() => onNavigate('benefits')}
              >
                View Benefits
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-gray-800 font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                How to Use Your Digital ID
              </h3>
              <ul className="text-gray-600 text-sm space-y-3">
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Present this card at union events and seminars</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Use QR code for quick check-in and verification</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Show to access member benefits and discounts</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Keep your phone charged for digital access</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Features List - Desktop Only */}
          <Card className="bg-white border-gray-200 shadow-sm hidden lg:block">
            <CardContent className="p-6">
              <h3 className="text-gray-800 font-semibold mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Digital ID Features
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 text-sm">Secure encryption technology</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <QrCode className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-sm">Instant QR verification</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <User className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700 text-sm">Personalized member profile</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Building2 className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-gray-700 text-sm">Company integration ready</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </AppLayout>
  );
}