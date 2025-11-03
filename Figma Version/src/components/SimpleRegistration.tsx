import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { ArrowLeft, User, Mail, Shield, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface SimpleRegistrationProps {
  onRegister: (userData: {
    firstName: string;
    middleInitial?: string;
    lastName: string;
    email: string;
  }) => void;
  onNavigate: (screen: string) => void;
}

export function SimpleRegistration({ onRegister, onNavigate }: SimpleRegistrationProps) {
  const [currentStep, setCurrentStep] = useState<'info' | 'otp'>('info');
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpError, setOtpError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    middleInitial: '',
    lastName: '',
    email: '',
    hasMiddleInitial: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Move to OTP step
    handleSendOTP();
  };

  const handleSendOTP = async () => {
    setOtpSent(true);
    setCurrentStep('otp');
    setCountdown(60);
    setOtpError('');
    
    // Mock OTP sending - in real app, this would call backend API
    console.log(`Sending OTP to ${formData.email}`);
    
    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setOtpError('Please enter the complete 6-digit code');
      return;
    }

    setIsVerifying(true);
    setOtpError('');
    
    // Mock OTP verification - in real app, this would verify with backend
    setTimeout(() => {
      if (otp === '123456' || otp === '000000') { // Demo OTPs
        const userData = {
          firstName: formData.firstName,
          middleInitial: formData.hasMiddleInitial ? formData.middleInitial : undefined,
          lastName: formData.lastName,
          email: formData.email,
        };
        onRegister(userData);
      } else {
        setOtpError('Invalid verification code. Please try again.');
        setIsVerifying(false);
      }
    }, 1500);
  };

  const handleResendOTP = () => {
    if (countdown === 0) {
      setOtp('');
      handleSendOTP();
    }
  };



  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      hasMiddleInitial: checked,
      middleInitial: checked ? prev.middleInitial : ''
    }));
  };

  const renderInfoStep = () => (
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <Input
            type="text"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required
          />
        </div>

        {/* Middle Initial Section */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Checkbox
              id="hasMiddleInitial"
              checked={formData.hasMiddleInitial}
              onCheckedChange={handleCheckboxChange}
            />
            <label 
              htmlFor="hasMiddleInitial" 
              className="text-sm font-medium text-gray-700"
            >
              I have a middle initial
            </label>
          </div>
          
          {formData.hasMiddleInitial && (
            <Input
              type="text"
              placeholder="M.I."
              value={formData.middleInitial}
              onChange={(e) => handleInputChange('middleInitial', e.target.value)}
              maxLength={1}
              className="w-20"
            />
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name (Surname)
          </label>
          <Input
            type="text"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="email"
              placeholder="your.email@company.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          Send Verification Code
        </Button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          What happens next?
        </h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• We'll send a verification code to your email</li>
          <li>• Enter the code to verify your email address</li>
          <li>• Set up a secure password for your account</li>
          <li>• Access your digital member ID immediately</li>
        </ul>
      </div>

      <div className="mt-4 text-center space-y-2">
        <Button
          variant="outline"
          onClick={() => {
            onRegister({
              firstName: 'Maria',
              middleInitial: 'S',
              lastName: 'Santos',
              email: 'new.user@example.com'
            });
          }}
          className="w-full"
        >
          Demo Quick Registration
        </Button>
        
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('landing')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </CardContent>
  );

  const renderOTPStep = () => (
    <CardContent>
      <div className="space-y-6">
        {/* Email Display */}
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Code sent to:</span>
          </div>
          <p className="text-sm font-semibold text-blue-900">{formData.email}</p>
        </div>

        {/* OTP Input */}
        <div className="space-y-4">
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Enter 6-digit verification code
            </label>
            <div className="flex justify-center">
              <InputOTP
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  setOtpError('');
                }}
                maxLength={6}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          {/* Error Message */}
          {otpError && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700">{otpError}</span>
            </div>
          )}

          {/* Success State */}
          {otp.length === 6 && !otpError && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-700">Code complete - ready to verify</span>
            </div>
          )}
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerifyOTP}
          disabled={otp.length !== 6 || isVerifying}
          className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          {isVerifying ? (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            'Verify & Create Account'
          )}
        </Button>

        {/* Resend Section */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">Didn't receive the code?</p>
          <Button
            variant="outline"
            onClick={handleResendOTP}
            disabled={countdown > 0}
            className={countdown > 0 ? 'cursor-not-allowed' : ''}
          >
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
          </Button>
        </div>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Demo Mode</p>
              <p className="text-xs text-yellow-700 mt-1">
                Use code <strong>123456</strong> or <strong>000000</strong> to verify
              </p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (currentStep === 'otp') {
                  setCurrentStep('info');
                  setOtp('');
                  setOtpSent(false);
                  setOtpError('');
                } else {
                  onNavigate('landing');
                }
              }}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                {currentStep === 'info' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Mail className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h1 className="font-semibold text-gray-800">
                  {currentStep === 'info' ? 'Quick Registration' : 'Email Verification'}
                </h1>
                <p className="text-xs text-gray-600">
                  {currentStep === 'info' ? 'Join ALUzon today' : 'Verify your email address'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                {currentStep === 'info' ? (
                  <User className="w-8 h-8 text-white" />
                ) : (
                  <Shield className="w-8 h-8 text-white" />
                )}
              </div>
              <CardTitle className="text-2xl text-gray-800">
                {currentStep === 'info' ? 'Create Your Account' : 'Verify Your Email'}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                {currentStep === 'info' 
                  ? 'Join the Associated Labor Union with just a few basic details'
                  : 'Enter the verification code sent to your email address'
                }
              </p>
            </CardHeader>
            
            {currentStep === 'info' ? renderInfoStep() : renderOTPStep()}
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
        <div className="text-center max-w-6xl mx-auto">
          <p className="text-xs text-gray-500">
            Need help? Contact your union representative
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Associated Labor Union - Luzon Regional
          </p>
        </div>
      </div>
    </div>
  );
}