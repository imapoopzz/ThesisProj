import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Shield, ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface PINSetupProps {
  onNavigate: (screen: string, data?: any) => void;
  onComplete: (pin: string) => void;
}

export function PINSetup({ onNavigate, onComplete }: PINSetupProps) {
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const createInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const currentPin = step === 'create' ? pin : confirmPin;
  const setCurrentPin = step === 'create' ? setPin : setConfirmPin;
  const currentRefs = step === 'create' ? createInputRefs : confirmInputRefs;

  const handlePinChange = (index: number, value: string) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newPin = [...currentPin];
    newPin[index] = value.slice(-1);
    setCurrentPin(newPin);

    if (error) setError('');

    // Auto-focus next input
    if (value && index < 5) {
      currentRefs.current[index + 1]?.focus();
    }

    // Auto-proceed when PIN is complete
    if (newPin.every(digit => digit !== '') && newPin.join('').length === 6) {
      setTimeout(() => {
        if (step === 'create') {
          handleNextStep();
        } else {
          handleConfirmPin();
        }
      }, 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !currentPin[index] && index > 0) {
      currentRefs.current[index - 1]?.focus();
    }
  };

  const handleNextStep = () => {
    const pinCode = pin.join('');
    
    if (pinCode.length !== 6) {
      setError('PIN must be 6 digits long');
      return;
    }

    // Basic PIN validation (allow demo PIN 654321)
    if ((pinCode === '123456' || pinCode === '000000' || pinCode === '111111') && pinCode !== '654321') {
      setError('Please choose a more secure PIN');
      return;
    }

    setError('');
    setStep('confirm');
    
    // Focus first input of confirm step
    setTimeout(() => {
      confirmInputRefs.current[0]?.focus();
    }, 100);
  };

  const handleConfirmPin = async () => {
    const pinCode = pin.join('');
    const confirmPinCode = confirmPin.join('');

    if (confirmPinCode.length !== 6) {
      setError('Please complete your PIN confirmation');
      return;
    }

    if (pinCode !== confirmPinCode) {
      setError('PINs do not match. Please try again.');
      setConfirmPin(['', '', '', '', '', '']);
      confirmInputRefs.current[0]?.focus();
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call to save PIN
    setTimeout(() => {
      setLoading(false);
      onComplete(pinCode);
    }, 1500);
  };

  const handleBack = () => {
    if (step === 'confirm') {
      setStep('create');
      setConfirmPin(['', '', '', '', '', '']);
      setError('');
    } else {
      onNavigate('registration');
    }
  };

  const resetCurrentStep = () => {
    setCurrentPin(['', '', '', '', '', '']);
    setError('');
    currentRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="font-semibold text-gray-800">Setup Security PIN</h1>
              <p className="text-xs text-gray-600">
                Step {step === 'create' ? '1' : '2'} of 2
              </p>
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
            <CardTitle className="text-xl text-gray-800">
              {step === 'create' ? 'Create Your Security PIN' : 'Confirm Your Security PIN'}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              {step === 'create' 
                ? 'Choose a 6-digit PIN to secure your account'
                : 'Re-enter your PIN to confirm'
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* PIN Input */}
            <div className="space-y-4">
              <div className="flex justify-center space-x-3">
                {currentPin.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (currentRefs.current[index] = el)}
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
                    disabled={loading}
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
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="ml-2 text-sm">
                    {showPin ? 'Hide' : 'Show'} PIN
                  </span>
                </Button>
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
                  <span className="text-sm">Setting up your PIN...</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {step === 'create' ? (
                <Button
                  onClick={handleNextStep}
                  disabled={pin.join('').length !== 6 || loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleConfirmPin}
                  disabled={confirmPin.join('').length !== 6 || loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Complete Setup
                </Button>
              )}

              <Button
                variant="ghost"
                onClick={resetCurrentStep}
                className="w-full text-gray-600 hover:text-gray-800"
                disabled={loading}
              >
                Clear
              </Button>
            </div>

            {/* Demo PIN Helper */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-medium text-blue-800 mb-2">Demo Mode:</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-blue-700">Use demo PIN: 654321</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (step === 'create') {
                      setPin(['6', '5', '4', '3', '2', '1']);
                    } else {
                      setConfirmPin(['6', '5', '4', '3', '2', '1']);
                    }
                    setError('');
                  }}
                  className="text-blue-600 hover:text-blue-700 text-xs px-2 py-1 h-auto"
                >
                  Use Demo PIN
                </Button>
              </div>
            </div>

            {/* Security Tips */}
            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs font-medium text-amber-800 mb-2">Security Tips:</p>
              <ul className="space-y-1 text-xs text-amber-700">
                <li>• Don't use obvious patterns (123456, 111111)</li>
                <li>• Avoid using birthdays or phone numbers</li>
                <li>• Keep your PIN private and secure</li>
                <li>• Remember your PIN for future logins</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Your PIN is encrypted and stored securely
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Trade Union Congress of the Philippines
          </p>
        </div>
      </div>
    </div>
  );
}