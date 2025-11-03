import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Shield, CreditCard, Heart, Users, ChevronRight } from 'lucide-react';

interface OnboardingProps {
  onNavigate: (screen: string) => void;
}

const onboardingSteps = [
  {
    id: 1,
    icon: Shield,
    title: "Digital ID",
    subtitle: "Secure membership identification",
    description: "Access your digital membership card with QR code verification anytime, anywhere.",
    bgColor: "bg-blue-600"
  },
  {
    id: 2,
    icon: CreditCard,
    title: "Dues Tracking",
    subtitle: "Monitor your payments",
    description: "Keep track of monthly contributions and payment history in real-time.",
    bgColor: "bg-green-600"
  },
  {
    id: 3,
    icon: Heart,
    title: "Member Benefits",
    subtitle: "Access union services",
    description: "Get legal assistance, medical services, and exclusive member discounts.",
    bgColor: "bg-purple-600"
  },
  {
    id: 4,
    icon: Users,
    title: "Get Started",
    subtitle: "Join ALU today",
    description: "Complete your registration to access all membership features and benefits.",
    bgColor: "bg-orange-600"
  }
];

export function Onboarding({ onNavigate }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
    if (isRightSwipe && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Auto-advance to login on last step after 3 seconds
  useEffect(() => {
    if (currentStep === onboardingSteps.length - 1) {
      const timer = setTimeout(() => {
        onNavigate('landing');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, onNavigate]);

  const step = onboardingSteps[currentStep];
  const IconComponent = step.icon;

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gray-50 flex flex-col"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Shield className="w-8 h-8 mr-2 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">ALU</h1>
          </div>
          <p className="text-sm text-gray-600">Associated Labor Unions</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col justify-center">
        <Card className="overflow-hidden shadow-lg border-0">
          <CardContent className={`p-0 ${step.bgColor} text-white relative min-h-[400px]`}>
            {/* Content */}
            <div className="p-8 flex flex-col justify-center h-full text-center">
              {/* Icon */}
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <IconComponent className="w-10 h-10" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-semibold mb-2">{step.title}</h2>
              <p className="text-lg opacity-90 mb-6">{step.subtitle}</p>

              {/* Description */}
              <p className="text-white/90 leading-relaxed max-w-sm mx-auto">
                {step.description}
              </p>

              {/* Get Started Button (only on last step) */}
              {currentStep === onboardingSteps.length - 1 && (
                <div className="mt-8">
                  <button
                    onClick={() => onNavigate('landing')}
                    className="bg-white text-orange-600 px-8 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto hover:bg-gray-50 transition-colors"
                  >
                    <span>Get Started</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step Indicators */}
        <div className="flex justify-center items-center mt-8 space-x-2">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-8 bg-blue-600'
                  : index < currentStep
                  ? 'w-2 bg-blue-400'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Swipe Instruction */}
        <div className="text-center mt-6">
          {currentStep < onboardingSteps.length - 1 ? (
            <p className="text-sm text-gray-500">
              Swipe left to continue • {currentStep + 1} of {onboardingSteps.length}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Starting app in 3 seconds...
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>19,000+ Members</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>58 Companies</span>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-1">
          Republic of the Philippines
        </p>
      </div>

      {/* Skip Button */}
      <button
        onClick={() => onNavigate('landing')}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-sm text-gray-400 hover:text-gray-600 underline"
      >
        Skip
      </button>
    </div>
  );
}