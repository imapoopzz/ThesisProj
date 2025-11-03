import React from 'react';
import { 
  Home,
  Newspaper,
  QrCode,
  History,
  User
} from 'lucide-react';

interface BottomNavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function BottomNavigation({ currentScreen, onNavigate }: BottomNavigationProps) {
  const navItems = [
    {
      title: 'Home',
      icon: Home,
      screen: 'dashboard',
      action: () => onNavigate('dashboard')
    },
    {
      title: 'News',
      icon: Newspaper,
      screen: 'news',
      action: () => onNavigate('news')
    },
    {
      title: 'Digital ID',
      icon: QrCode,
      screen: 'digitalId',
      action: () => onNavigate('digitalId'),
      isCenter: true
    },
    {
      title: 'History',
      icon: History,
      screen: 'history',
      action: () => onNavigate('history')
    },
    {
      title: 'Account',
      icon: User,
      screen: 'account',
      action: () => onNavigate('account')
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item, index) => {
            const isActive = currentScreen === item.screen || 
              (currentScreen === 'profile' && item.screen === 'account') ||
              (currentScreen === 'dues' && item.screen === 'history');
            
            return (
              <button
                key={index}
                onClick={item.action}
                className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 ${
                  item.isCenter 
                    ? 'relative -top-4 bg-blue-600 rounded-full p-4 shadow-lg' 
                    : ''
                }`}
              >
                <div className={`${
                  item.isCenter 
                    ? 'text-white' 
                    : isActive 
                      ? 'text-blue-600' 
                      : 'text-gray-400'
                }`}>
                  <item.icon className={`${item.isCenter ? 'w-6 h-6' : 'w-5 h-5'} mx-auto`} />
                </div>
                {!item.isCenter && (
                  <span className={`text-xs mt-1 ${
                    isActive ? 'text-blue-600 font-medium' : 'text-gray-600'
                  }`}>
                    {item.title}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}