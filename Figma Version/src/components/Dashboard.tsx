import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  User,
  CreditCard,
  FileText,
  Award,
  Settings,
  Users,
  CheckCircle,
  AlertCircle,
  Calendar,
  Bell,
  X,
  DollarSign,
  UserCheck,
  Megaphone,
  QrCode,
  Newspaper,
  Shield,
} from "lucide-react";
import { AppLayout } from "./AppLayout";
import type { User as UserType } from "../App";

interface DashboardProps {
  user: UserType | null;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "dues" | "announcement" | "approval" | "system";
  isRead: boolean;
  timestamp: string;
  icon: any;
  iconColor: string;
};

export function Dashboard({
  user,
  onNavigate,
  onLogout,
}: DashboardProps) {
  const [showNotifications, setShowNotifications] =
    useState(false);
  const [notifications, setNotifications] = useState<
    Notification[]
  >([
    {
      id: "1",
      title: "Monthly Dues Reminder",
      message:
        "Your April 2024 membership dues of ₱500 are now due. Please settle your payment to maintain active membership status.",
      type: "dues",
      isRead: false,
      timestamp: "2024-04-01T09:00:00Z",
      icon: DollarSign,
      iconColor: "text-orange-600",
    },
    {
      id: "2",
      title: "Membership Approved",
      message:
        "Congratulations! Your membership application has been approved by the union board. You now have access to all member benefits.",
      type: "approval",
      isRead: false,
      timestamp: "2024-03-28T14:30:00Z",
      icon: UserCheck,
      iconColor: "text-green-600",
    },
    {
      id: "3",
      title: "Union General Assembly",
      message:
        "Monthly General Assembly scheduled for March 15, 2024 at 2:00 PM. Location: ALUzon Main Office, Makati. All members are encouraged to attend.",
      type: "announcement",
      isRead: true,
      timestamp: "2024-03-10T10:00:00Z",
      icon: Megaphone,
      iconColor: "text-blue-600",
    },
    {
      id: "4",
      title: "System Maintenance Notice",
      message:
        "The ALUzon Portal will be undergoing scheduled maintenance on March 20, 2024 from 12:00 AM to 4:00 AM. Some features may be temporarily unavailable.",
      type: "system",
      isRead: true,
      timestamp: "2024-03-08T16:00:00Z",
      icon: Settings,
      iconColor: "text-gray-600",
    },
    {
      id: "5",
      title: "Financial Literacy Seminar",
      message:
        "Join our upcoming Financial Literacy Seminar on March 22, 2024 at 9:00 AM. Register now to secure your slot. Limited seats available.",
      type: "announcement",
      isRead: false,
      timestamp: "2024-03-05T11:00:00Z",
      icon: Award,
      iconColor: "text-purple-600",
    },
  ]);

  if (!user) return null;

  // If user hasn't completed their profile, show complete verification
  if (!user.isProfileComplete) {
    return (
      <AppLayout
        currentScreen="dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notificationContent={<div className="p-4 text-center text-gray-500">No notifications available</div>}
      >
        <div className="p-4 space-y-6 max-w-md mx-auto lg:max-w-4xl">
          {/* Welcome Banner */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-blue-800 mb-1">
                    Welcome to ALUzon, {user.firstName}!
                  </h2>
                  <p className="text-blue-700 text-sm mb-3">
                    Complete your profile verification to access all member benefits and services.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Complete Verification Card */}
          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    Complete Verification
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Complete your profile to access all member benefits and services.
                  </p>
                </div>
                
                <Button 
                  onClick={() => onNavigate('completeProfile')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info Display */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Your Registration Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{user.firstName} {user.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{user.phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Member ID:</span>
                  <span className="font-medium text-blue-600">{user.digitalId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration Date:</span>
                  <span className="font-medium">{new Date(user.membershipDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-gray-800 mb-2">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Contact our support team if you have questions about the verification process.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">📞 (02) 8123-4567</p>
                <p className="text-sm font-medium text-gray-700">✉️ support@aluzon.org.ph</p>
                <p className="text-xs text-gray-500 mt-3">
                  Office Hours: Monday - Friday, 8:00 AM - 5:00 PM
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // If user is not approved but profile is complete, show pending approval dashboard
  if (!user.isApproved) {
    return (
      <AppLayout
        currentScreen="dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notificationContent={<div className="p-4 text-center text-gray-500">No notifications available</div>}
      >
        <div className="p-4 space-y-6 max-w-md mx-auto lg:max-w-4xl">
          {/* Pending Approval Banner */}
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-yellow-800 mb-1">
                    Membership Under Review
                  </h2>
                  <p className="text-yellow-700 text-sm mb-3">
                    Your membership application is being reviewed by ALU administrators. 
                    Most services will be available once approved.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-yellow-800">Application Status</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limited Welcome Section */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <h1 className="text-xl font-semibold text-gray-800 mb-2">
                  Welcome to ALUzon, {user.firstName}!
                </h1>
                <p className="text-gray-600 mb-4">
                  We're excited to have you join the Associated Labor Union family.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">Member ID</span>
                    <span className="text-sm text-blue-600">{user.digitalId}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium text-blue-800">Application Date</span>
                    <span className="text-sm text-blue-600">{new Date(user.membershipDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limited Actions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Available Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => onNavigate("membershipForm")}>
                <CardContent className="p-4 text-center">
                  <div className="bg-blue-500 rounded-full p-3 w-fit mx-auto mb-2">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-800 text-sm">View Application</h4>
                  <p className="text-xs text-gray-600">Check your membership form</p>
                </CardContent>
              </Card>

              <Card className="opacity-50 cursor-not-allowed">
                <CardContent className="p-4 text-center">
                  <div className="bg-gray-400 rounded-full p-3 w-fit mx-auto mb-2">
                    <QrCode className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-600 text-sm">Digital ID</h4>
                  <p className="text-xs text-gray-500">Available after approval</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Support */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-gray-800 mb-2">Need Assistance?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Contact our support team if you have questions about your application.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">📞 (02) 8123-4567</p>
                <p className="text-sm font-medium text-gray-700">✉️ support@ALUzon.org.ph</p>
                <p className="text-xs text-gray-500 mt-3">
                  Office Hours: Monday - Friday, 8:00 AM - 5:00 PM
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const unreadCount = notifications.filter(
    (n) => !n.isRead,
  ).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true })),
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168)
      return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };



  const notificationContent = (
    <>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">
          Notifications
        </h3>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={() => setShowNotifications(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                !notification.isRead ? "bg-blue-50/50" : ""
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full bg-gray-100 ${notification.iconColor}`}>
                  <notification.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4
                      className={`text-sm font-medium text-gray-800 ${
                        !notification.isRead ? "font-semibold" : ""
                      }`}
                    >
                      {notification.title}
                    </h4>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatTime(notification.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => {
              setShowNotifications(false);
              // Could navigate to a full notifications page
            }}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all notifications
          </button>
        </div>
      )}
    </>
  );

  return (
    <AppLayout
      currentScreen="dashboard"
      onNavigate={onNavigate}
      onLogout={onLogout}
      showNotifications={showNotifications}
      setShowNotifications={setShowNotifications}
      notificationContent={notificationContent}
      user={user}
      unreadCount={unreadCount}
    >

      <div className="px-4 py-6 max-w-md mx-auto lg:max-w-7xl">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content - Left Column on Desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Welcome, {user.firstName}!
                    </h2>
                    <p className="text-sm text-gray-600">
                      {user.company}
                    </p>
                    <div className="flex items-center mt-1">
                      {user.isApproved ? (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approved
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800"
                        >
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Pending Approval
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Member Info Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  Member Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Member ID:
                  </span>
                  <span className="text-sm font-medium">
                    {user.digitalId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Position:
                  </span>
                  <span className="text-sm font-medium">
                    {user.unionPosition}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Member Since:
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(
                      user.membershipDate,
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    QR Code:
                  </span>
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {user.qrCode}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completion Alert */}
            {!user.isProfileComplete && (
              <Card className="mb-6 border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-medium text-orange-800 mb-1">
                        Complete Your Profile
                      </h3>
                      <p className="text-sm text-orange-700 mb-3">
                        Your account is not fully verified. Complete
                        your registration to access all member
                        benefits and services.
                      </p>
                      <Button
                        size="sm"
                        onClick={() =>
                          onNavigate("completeProfile")
                        }
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Complete Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Access Cards */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">
                Quick Access
              </h3>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Card
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() => onNavigate("physicalCard")}
                >
                  <CardContent className="p-4 text-center">
                    <div className="bg-purple-500 rounded-full p-3 w-fit mx-auto mb-2">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-medium text-gray-800 text-sm">
                      Physical Card
                    </h4>
                    <p className="text-xs text-gray-600">
                      Request ID card
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() => onNavigate("benefits")}
                >
                  <CardContent className="p-4 text-center">
                    <div className="bg-orange-500 rounded-full p-3 w-fit mx-auto mb-2">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-medium text-gray-800 text-sm">
                      Benefits
                    </h4>
                    <p className="text-xs text-gray-600">
                      Member benefits
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-all lg:hidden"
                  onClick={() => onNavigate("membershipForm")}
                >
                  <CardContent className="p-4 text-center">
                    <div className="bg-blue-600 rounded-full p-3 w-fit mx-auto mb-2">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-medium text-gray-800 text-sm">
                      Membership Form
                    </h4>
                    <p className="text-xs text-gray-600">
                      Download form
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-all lg:hidden"
                  onClick={() => onNavigate("digitalId")}
                >
                  <CardContent className="p-4 text-center">
                    <div className="bg-blue-500 rounded-full p-3 w-fit mx-auto mb-2">
                      <QrCode className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-medium text-gray-800 text-sm">
                      Digital ID
                    </h4>
                    <p className="text-xs text-gray-600">
                      View your ID
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-all lg:block hidden"
                  onClick={() => onNavigate("digitalId")}
                >
                  <CardContent className="p-4 text-center">
                    <div className="bg-blue-500 rounded-full p-3 w-fit mx-auto mb-2">
                      <QrCode className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-medium text-gray-800 text-sm">
                      Digital ID
                    </h4>
                    <p className="text-xs text-gray-600">
                      View your ID
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-all lg:block hidden"
                  onClick={() => onNavigate("dues")}
                >
                  <CardContent className="p-4 text-center">
                    <div className="bg-green-500 rounded-full p-3 w-fit mx-auto mb-2">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-medium text-gray-800 text-sm">
                      Dues
                    </h4>
                    <p className="text-xs text-gray-600">
                      Track payments
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Upcoming Events */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800">
                    Monthly General Assembly
                  </h4>
                  <p className="text-sm text-blue-600">
                    March 15, 2024 • 2:00 PM
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    ALUzon Main Office, Makati
                  </p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800">
                    Financial Literacy Seminar
                  </h4>
                  <p className="text-sm text-green-600">
                    March 22, 2024 • 9:00 AM
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    BDO Corporate Center
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Desktop Only */}
          <div className="lg:col-span-1 space-y-6 hidden lg:block">
            {/* Member Statistics Card */}


            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Megaphone className="w-5 h-5 mr-2 text-orange-600" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  onClick={() => onNavigate("news")}
                  className="w-full text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Newspaper className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Latest News</span>
                  </div>
                </button>
                <button
                  onClick={() => onNavigate("membershipForm")}
                  className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Membership Form</span>
                  </div>
                </button>
                <button
                  onClick={() => onNavigate("profile")}
                  className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Edit Profile</span>
                  </div>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Admin Access - Only show in main content area */}
        {(user.unionPosition === "President" ||
          user.unionPosition === "Vice President" ||
          user.unionPosition === "Secretary") && (
          <div className="lg:col-span-2">
            <Card className="mt-6 mb-4">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Settings className="w-5 h-5 mr-2 text-orange-600" />
                  Administrative
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onNavigate("admin")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Member Approval System
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}