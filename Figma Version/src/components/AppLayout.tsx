import React from 'react';
import { 
  Home, 
  Newspaper, 
  QrCode, 
  History, 
  User, 
  LogOut,
  Bell,
  X
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AppLayoutProps {
  children: React.ReactNode;
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onLogout?: () => void;
  showNotifications?: boolean;
  setShowNotifications?: (show: boolean) => void;
  notificationContent?: React.ReactNode;
  user?: any;
  unreadCount?: number;
}

export function AppLayout({ 
  children, 
  currentScreen, 
  onNavigate, 
  onLogout,
  showNotifications = false,
  setShowNotifications,
  notificationContent,
  user,
  unreadCount = 0
}: AppLayoutProps) {
  const navItems = [
    {
      title: "Home",
      icon: Home,
      action: () => onNavigate("dashboard"),
      screen: "dashboard",
    },
    {
      title: "News",
      icon: Newspaper,
      action: () => onNavigate("news"),
      screen: "news",
    },
    {
      title: "Digital ID",
      icon: QrCode,
      action: () => onNavigate("digitalId"),
      screen: "digitalId",
      isCenter: true, // Only for mobile bottom nav
    },
    {
      title: "History",
      icon: History,
      action: () => onNavigate("history"),
      screen: "history",
    },
    {
      title: "Account",
      icon: User,
      action: () => onNavigate("profile"),
      screen: "profile",
    },
  ];

  const isActive = (screen: string) => {
    if (screen === "dashboard") return currentScreen === "dashboard";
    if (screen === "news") return currentScreen === "news";
    if (screen === "digitalId") return currentScreen === "digitalId";
    if (screen === "history") return currentScreen === "history" || currentScreen === "dues";
    if (screen === "profile") return currentScreen === "profile" || currentScreen === "account";
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-40">
        <div className="h-full flex flex-col p-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-[rgba(243,243,243,1)] p-3 rounded-[35px]">
              <ImageWithFallback
                src="https://rmn.ph/wp-content/uploads/2020/05/ASSOCIATED-LABOR-UNIONS.jpg"
                alt="ALU Logo"
                className="w-10 h-10 object-cover rounded-full"
              />
            </div>
            <div>
              <h1 className="font-semibold text-gray-800">ALUzon</h1>
              <p className="text-xs text-gray-600">Member Portal</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.screen)
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </button>
            ))}
          </nav>
          
          {/* Logout - Stuck to bottom */}
          {onLogout && (
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={onLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Mobile Header with Notifications */}
        <div className="lg:hidden bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-[rgba(243,243,243,1)] p-2 rounded-[92px]">
                  <ImageWithFallback
                    src="https://rmn.ph/wp-content/uploads/2020/05/ASSOCIATED-LABOR-UNIONS.jpg"
                    alt="ALU Logo"
                    className="w-6 h-6 object-cover rounded-full"
                  />
                </div>
                <div>
                  <h1 className="font-semibold text-gray-800">ALUzon</h1>
                  <p className="text-xs text-gray-600">Associated Labor Union</p>
                </div>
              </div>

              {/* Notification Button - Mobile Only */}
              {setShowNotifications && (
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && notificationContent && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                      {notificationContent}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Header with Notifications */}
        <div className="hidden lg:block bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-semibold text-gray-800 capitalize">
                  {currentScreen === "dashboard" ? "Dashboard" : 
                   currentScreen === "digitalId" ? "Digital ID" :
                   currentScreen === "history" || currentScreen === "dues" ? "Dues Tracking" :
                   currentScreen}
                </h2>
              </div>

              {/* Desktop Notifications */}
              {setShowNotifications && user && (
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors relative"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>

                    {showNotifications && notificationContent && (
                      <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                        {notificationContent}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="pb-20 lg:pb-0">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg lg:hidden z-30">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 ${
                item.isCenter
                  ? "relative -top-4 bg-blue-600 rounded-full p-4 shadow-lg"
                  : ""
              }`}
            >
              <div
                className={`${
                  item.isCenter
                    ? "text-white"
                    : isActive(item.screen)
                      ? "text-blue-600"
                      : "text-gray-400"
                }`}
              >
                <item.icon
                  className={`${item.isCenter ? "w-6 h-6" : "w-5 h-5"} mx-auto`}
                />
              </div>
              {!item.isCenter && (
                <span
                  className={`text-xs mt-1 ${
                    isActive(item.screen)
                      ? "text-blue-600 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  {item.title}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}