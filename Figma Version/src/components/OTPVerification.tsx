import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface OTPVerificationProps {
  onNavigate: (screen: string, data?: any) => void;
  data: {
    identifier: string;
    method: 'email' | 'phone';
    userExists: boolean;
  };
}

export function OTPVerification({ onNavigate, data }: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { identifier, method, userExists } = data;

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last character
    setOtp(newOtp);

    if (error) setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits are entered
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      setTimeout(() => verifyOTP(newOtp.join('')), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async (otpCode = otp.join('')) => {
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // Demo: Accept any OTP for existing user, 123456 for demo
      if (otpCode === '123456' || userExists) {
        if (userExists) {
          // Existing user - go to dashboard (login complete)
          onNavigate('dashboard', { identifier, method });
        } else {
          // New user - go to password setup after OTP verification
          onNavigate('passwordSetup', { identifier, method });
        }
      } else {
        setError('Invalid verification code. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }, 1500);
  };

  const handleResend = () => {
    setCanResend(false);
    setResendTimer(30);
    setError('');
    setOtp(['', '', '', '', '', '']);
    
    // Simulate resend API call
    setTimeout(() => {
      // Show success message or handle resend logic
    }, 1000);
  };

  const maskedIdentifier = method === 'email' 
    ? identifier.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    : identifier.replace(/(\+63\s9\d{2})(\s\d{3})(\s\d{4})/, '$1 ***$3');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('login')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="font-semibold text-gray-800">Verify Code</h1>
              <p className="text-xs text-gray-600">Enter verification code</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-800">Enter Verification Code</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              We sent a 6-digit code to
            </p>
            <p className="text-sm font-medium text-blue-600">
              {maskedIdentifier}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-4">
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-12 text-center text-lg font-semibold border rounded-lg transition-colors ${
                      digit 
                        ? 'border-blue-600 bg-blue-50' 
                        : error 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                    disabled={loading}
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700 text-sm text-center">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Verifying...</span>
                </div>
              )}
            </div>

            {/* Resend Section */}
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Didn't receive the code?
              </p>
              
              {canResend ? (
                <Button
                  variant="ghost"
                  onClick={handleResend}
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend Code
                </Button>
              ) : (
                <p className="text-sm text-gray-500">
                  Resend code in {resendTimer}s
                </p>
              )}
            </div>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-medium text-blue-800 mb-2">Demo Mode:</p>
              <div className="space-y-1 text-xs text-blue-700">
                <p>Use code: 123456</p>
                <p>Or any 6-digit code for registered users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact your union representative
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Trade Union Congress of the Philippines
          </p>
        </div>
      </div>
    </div>
  );
}