import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Shield, ArrowLeft, Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface PINVerificationProps {
  onNavigate: (screen: string, data?: any) => void;
  onSuccess: () => void;
  data: {
    identifier: string;
    method: 'email' | 'phone';
  };
}

export function PINVerification({ onNavigate, onSuccess, data }: PINVerificationProps) {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { identifier, method } = data;

  const handlePinChange = (index: number, value: string) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    if (error) setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when PIN is complete
    if (newPin.every(digit => digit !== '') && newPin.join('').length === 6) {
      setTimeout(() => verifyPin(newPin.join('')), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyPin = async (pinCode = pin.join('')) => {
    if (pinCode.length !== 6) {
      setError('Please enter your 6-digit PIN');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // Demo: Accept demo PINs or any PIN for registered users
      if (pinCode === '123456' || pinCode === '654321' || identifier === 'juan.delacruz@bdo.com.ph' || identifier === '+63 917 123 4567') {
        onSuccess();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= maxAttempts) {
          setError(`Too many failed attempts. Please try again later or contact support.`);
        } else {
          setError(`Incorrect PIN. ${maxAttempts - newAttempts} attempt${maxAttempts - newAttempts !== 1 ? 's' : ''} remaining.`);
        }
        
        setPin(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }, 1500);
  };

  const handleForgotPin = () => {
    // In a real app, this would trigger a PIN reset flow
    onNavigate('login', { resetPin: true });
  };

  const resetPin = () => {
    setPin(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
  };

  const maskedIdentifier = method === 'email' 
    ? identifier.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    : identifier.replace(/(\+63\s9\d{2})(\s\d{3})(\s\d{4})/, '$1 ***$3');

  const isBlocked = attempts >= maxAttempts;

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
              <h1 className="font-semibold text-gray-800">Enter PIN</h1>
              <p className="text-xs text-gray-600">Secure access verification</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl text-gray-800">Enter Your Security PIN</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Welcome back! Please enter your 6-digit PIN to continue
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {maskedIdentifier}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* PIN Input */}
            <div className="space-y-4">
              <div className="flex justify-center space-x-3">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type={showPin ? "text" : "password"}
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-12 text-center text-lg font-semibold border rounded-lg transition-colors ${
                      digit 
                        ? 'border-blue-600 bg-blue-50' 
                        : error 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 bg-white'
                    } focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
                    disabled={loading || isBlocked}
                  />
                ))}
              </div>

              {/* Show/Hide PIN Toggle */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPin(!showPin)}
                  className="text-gray-600 hover:text-gray-800 p-2"
                  disabled={isBlocked}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="ml-2 text-sm">
                    {showPin ? 'Hide' : 'Show'} PIN
                  </span>
                </Button>
              </div>

              {/* Error Message */}
              {error && (
                <Alert className={`border-red-200 bg-red-50 ${isBlocked ? 'border-orange-200 bg-orange-50' : ''}`}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className={`text-sm text-center ${isBlocked ? 'text-orange-700' : 'text-red-700'}`}>
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

              {/* Attempt Counter */}
              {attempts > 0 && !isBlocked && (
                <div className="text-center">
                  <p className="text-xs text-orange-600">
                    {attempts} of {maxAttempts} attempts used
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!isBlocked && (
              <div className="space-y-3">
                <Button
                  onClick={() => verifyPin()}
                  disabled={pin.join('').length !== 6 || loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? 'Verifying...' : 'Verify PIN'}
                </Button>

                <Button
                  variant="ghost"
                  onClick={resetPin}
                  className="w-full text-gray-600 hover:text-gray-800"
                  disabled={loading}
                >
                  Clear
                </Button>
              </div>
            )}

            {/* Forgot PIN Link */}
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={handleForgotPin}
                className="text-blue-600 hover:text-blue-700 p-0 h-auto font-normal underline"
                disabled={loading}
              >
                Forgot your PIN?
              </Button>
            </div>

            {/* Demo Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-medium text-blue-800 mb-2">Demo Mode:</p>
              <div className="space-y-1 text-xs text-blue-700">
                <p>Use PIN: 123456 (existing users)</p>
                <p>Use PIN: 654321 (new registrations)</p>
                <p>Or any PIN for registered users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Your PIN keeps your membership data secure
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Trade Union Congress of the Philippines
          </p>
        </div>
      </div>
    </div>
  );
}