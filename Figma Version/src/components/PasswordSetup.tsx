import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Eye, EyeOff, Lock, CheckCircle, ArrowLeft, Shield } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface PasswordSetupProps {
  onNavigate: (screen: string) => void;
  onComplete: (password: string) => void;
}

export function PasswordSetup({ onNavigate, onComplete }: PasswordSetupProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password strength requirements
  const requirements = [
    { regex: /.{8,}/, text: 'At least 8 characters', met: password.length >= 8 },
    { regex: /[A-Z]/, text: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { regex: /[a-z]/, text: 'One lowercase letter', met: /[a-z]/.test(password) },
    { regex: /\d/, text: 'One number', met: /\d/.test(password) },
    { regex: /[^A-Za-z0-9]/, text: 'One special character', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const isPasswordValid = requirements.every(req => req.met);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async () => {
    setError('');

    if (!isPasswordValid) {
      setError('Please meet all password requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onComplete(password);
    }, 1500);
  };

  const handleInputChange = (field: 'password' | 'confirm', value: string) => {
    if (field === 'password') {
      setPassword(value);
    } else {
      setConfirmPassword(value);
    }
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('registration')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-800">Setup Password</h1>
                <p className="text-xs text-gray-600">Secure your account</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Create Your Password</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Your password will be used to access your ALUzon account
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Password Requirements */}
              {password.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">Password Requirements:</p>
                  <div className="space-y-2">
                    {requirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle 
                          className={`w-4 h-4 ${
                            req.met ? 'text-green-500' : 'text-gray-300'
                          }`} 
                        />
                        <span 
                          className={`text-sm ${
                            req.met ? 'text-green-700' : 'text-gray-600'
                          }`}
                        >
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => handleInputChange('confirm', e.target.value)}
                    placeholder="Confirm your password"
                    className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {confirmPassword.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle 
                      className={`w-4 h-4 ${
                        passwordsMatch ? 'text-green-500' : 'text-red-500'
                      }`} 
                    />
                    <span 
                      className={`text-sm ${
                        passwordsMatch ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </span>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700 text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={loading || !isPasswordValid || !passwordsMatch}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Setting up...</span>
                  </div>
                ) : (
                  'Complete Setup'
                )}
              </Button>

              {/* Security Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800">Security Notice</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Your password is encrypted and stored securely. We recommend using a unique password that you don't use for other accounts.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
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