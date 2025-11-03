import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Shield, Users, Award, Heart, ArrowRight, Smartphone, Monitor } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingProps {
  onLogin?: () => void;
  onNavigate: (screen: string) => void;
}

export function Landing({ onNavigate }: LandingProps) {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Digital ID Cards",
      description: "Secure digital identification with QR codes and modern watermarks"
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Member Portal",
      description: "Complete member dashboard with news, events, and announcements"
    },
    {
      icon: <Award className="w-8 h-8 text-purple-600" />,
      title: "Benefits Tracking",
      description: "Track your union benefits, dues, and membership privileges"
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Support Network",
      description: "Connect with fellow members and access union support services"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <ImageWithFallback
                  src="https://rmn.ph/wp-content/uploads/2020/05/ASSOCIATED-LABOR-UNIONS.jpg"
                  alt="ALU Logo"
                  className="w-6 h-6 object-cover rounded-full"
                />
              </div>
              <div>
                <h1 className="text-xl text-gray-800">ALUzon</h1>
                <p className="text-xs text-gray-600">Associated Labor Union Portal</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => onNavigate('login')}
                className="text-gray-700 hover:text-blue-600"
              >
                Sign In
              </Button>
              <Button
                onClick={() => onNavigate('registration')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl text-gray-800 leading-tight">
                Your Union,
                <span className="text-blue-600"> Digitized</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Access your membership benefits, connect with fellow members, and stay updated 
                with union news through our comprehensive digital platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => onNavigate('login')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                Sign In
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => onNavigate('registration')}
                variant="outline"
                size="lg"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
              >
                Create Account
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4" />
                <span>Mobile Optimized</span>
              </div>
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4" />
                <span>Desktop Ready</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 transform rotate-3">
              <div className="bg-white rounded-2xl p-6 shadow-xl transform -rotate-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-gray-800">Digital ID</h3>
                      <p className="text-sm text-gray-600">Secure & Verified</p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full w-4/5"></div>
                  </div>
                  <p className="text-xs text-gray-500">Member since 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-gray-800 mb-4">
              Everything You Need as a Union Member
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From digital ID cards to benefit tracking, ALUzon provides comprehensive 
              tools for modern union membership.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-gray-800">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl text-white">
              Ready to Join the Digital Revolution?
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Experience the future of union membership with ALUzon. 
              Join thousands of members already using our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => onNavigate('registration')}
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => onNavigate('login')}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-3"
              >
                Already a Member?
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-blue-400" />
                <span>ALUzon</span>
              </div>
              <p className="text-sm text-gray-400">
                Empowering union members through digital innovation and 
                comprehensive membership services.
              </p>
            </div>
            
            <div>
              <h3 className="mb-4">Quick Links</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Member Benefits</p>
                <p>Support Center</p>
                <p>Contact Us</p>
                <p>Privacy Policy</p>
              </div>
            </div>
            
            <div>
              <h3 className="mb-4">Contact Info</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Associated Labor Union - Luzon Regional</p>
                <p>support@aluzon.ph</p>
                <p>+63 2 8123 4567</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 ALUzon. All rights reserved. | Associated Labor Union - Luzon Regional</p>
          </div>
        </div>
      </div>
    </div>
  );
}