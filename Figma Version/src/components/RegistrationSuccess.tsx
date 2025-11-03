import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Shield, CheckCircle, Clock, Mail, Phone, User, ArrowRight } from 'lucide-react';
import type { User } from '../App';

interface RegistrationSuccessProps {
  user: User;
  onNavigate: (screen: string) => void;
}

export function RegistrationSuccess({ user, onNavigate }: RegistrationSuccessProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-800">Registration Complete</h1>
              <p className="text-xs text-gray-600">Welcome to ALUzon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Verification Complete!
              </h1>
              <p className="text-lg text-gray-600">
                Your profile verification has been successfully submitted for review.
              </p>
            </div>
          </div>

          {/* Status Card */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-gray-800 flex items-center justify-center space-x-2">
                <Clock className="w-6 h-6 text-orange-500" />
                <span>Pending Approval</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-orange-800 mb-1">
                      Account Under Review
                    </h3>
                    <p className="text-sm text-orange-700">
                      Your membership application is currently being reviewed by union administrators. 
                      You'll receive an email notification once your account is approved.
                    </p>
                  </div>
                </div>
              </div>

              {/* Member Info */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Member Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Name</p>
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Digital ID</p>
                    <p className="font-medium font-mono">{user.digitalId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Company</p>
                    <p className="font-medium">{user.company}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Position</p>
                    <p className="font-medium">{user.position}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Union Position</p>
                    <p className="font-medium">{user.unionPosition}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Membership Date</p>
                    <p className="font-medium">{new Date(user.membershipDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3">
                  We'll Keep You Updated
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-blue-700">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-700">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-center">
                <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50 px-4 py-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Pending Approval
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => onNavigate('dashboard')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => onNavigate('account')}
              variant="outline"
              className="flex-1 border-gray-300 hover:bg-gray-50"
            >
              View Account
            </Button>
          </div>

          {/* What's Next */}
          <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">What happens next?</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">1</span>
                  </div>
                  <p>Union administrators will review your application within 1-2 business days</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">2</span>
                  </div>
                  <p>You'll receive an email notification once your account is approved</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">3</span>
                  </div>
                  <p>Access all member benefits including digital ID, dues tracking, and more</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="flex justify-center mt-8">

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
        <div className="text-center max-w-6xl mx-auto">
          <p className="text-xs text-gray-500">
            Questions about your registration? Contact your union representative
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Associated Labor Union - Luzon Regional
          </p>
        </div>
      </div>
    </div>
  );
}