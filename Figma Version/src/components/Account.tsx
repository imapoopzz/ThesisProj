import React, { useState } from "react";
import {
  User,
  HelpCircle,
  Info,
  Phone,
  Star,
  Settings,
  LogOut,
  ChevronRight,
  Home,
  Newspaper,
  History,
  QrCode,
  Mail,
  MapPin,
  Building2,
  Shield,
  Edit3,
  Camera,
  Award,
  Calendar,
  Briefcase,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AppLayout } from "./AppLayout";
import type { User as UserType } from "../App";

interface AccountProps {
  user: UserType | null;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

interface PersonalDetailsProps {
  user: UserType | null;
  onClose: () => void;
}

function PersonalDetails({
  user,
  onClose,
}: PersonalDetailsProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-semibold text-lg">
              Personal Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/50 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Profile Section */}
        <div className="p-6 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-blue-100">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </div>
          <h3 className="font-semibold text-xl text-gray-800">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1 inline-block mt-2">
            {user.digitalId}
          </p>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                Basic Information
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">
                  Date of Birth
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {user.dateOfBirth
                    ? new Date(
                        user.dateOfBirth,
                      ).toLocaleDateString()
                    : "Not provided"}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">
                  Gender
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {user.gender || "Not provided"}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">
                  Marital Status
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {user.maritalStatus || "Not provided"}
                </span>
              </div>

              {user.numberOfChildren !== undefined && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">
                    Children
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {user.numberOfChildren}
                  </span>
                </div>
              )}

              {user.religion && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">
                    Religion
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {user.religion}
                  </span>
                </div>
              )}

              {user.education && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">
                    Education
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {user.education}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactDetails({
  user,
  onClose,
}: PersonalDetailsProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-semibold text-lg">
              Contact & Address
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/50 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="w-3 h-3 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                Contact Information
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">
                  Email Address
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {user.email}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">
                  Phone Number
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {user.phone || "Not provided"}
                </span>
              </div>
            </div>
          </div>

          {user.address && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-3 h-3 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                  Address
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-800">
                  {user.address}
                </p>
              </div>
            </div>
          )}

          {user.emergencyContact && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <Phone className="w-3 h-3 text-red-600" />
                </div>
                <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                  Emergency Contact
                </p>
              </div>

              <div className="bg-red-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Name
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {user.emergencyContact.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Relationship
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {user.emergencyContact.relationship}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Phone
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {user.emergencyContact.phone}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmploymentDetails({
  user,
  onClose,
}: PersonalDetailsProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-violet-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-semibold text-lg">
              Employment Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/50 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <Building2 className="w-3 h-3 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                Company Information
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">
                  Company
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {user.company}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">
                  Position
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {user.position}
                </span>
              </div>

              {user.department && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">
                    Department
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {user.department}
                  </span>
                </div>
              )}

              {user.yearsEmployed && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">
                    Years Employed
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {user.yearsEmployed} years
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-3 h-3 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                Union Information
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Union Position
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {user.unionPosition}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Member Since
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {new Date(
                    user.membershipDate,
                  ).toLocaleDateString()}
                </span>
              </div>
              {user.unionAffiliation && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Affiliation
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {user.unionAffiliation}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Account({
  user,
  onNavigate,
  onLogout,
}: AccountProps) {
  const [showPersonalDetails, setShowPersonalDetails] =
    useState(false);
  const [showContactDetails, setShowContactDetails] =
    useState(false);
  const [showEmploymentDetails, setShowEmploymentDetails] =
    useState(false);

  if (!user) return null;

  const profileSections = [
    {
      title: "Personal Information",
      subtitle: "Basic details and personal data",
      icon: User,
      iconBg: "bg-blue-500",
      action: () => setShowPersonalDetails(true),
    },
    {
      title: "Contact & Address",
      subtitle: "Phone, email, and location details",
      icon: Mail,
      iconBg: "bg-green-500",
      action: () => setShowContactDetails(true),
    },
    {
      title: "Employment Details",
      subtitle: "Company, position, and union info",
      icon: Briefcase,
      iconBg: "bg-purple-500",
      action: () => setShowEmploymentDetails(true),
    },
  ];

  const menuItems = [
    {
      title: "Benefits & Services",
      subtitle: "View available member benefits",
      icon: Award,
      action: () => onNavigate("benefits"),
    },
    {
      title: "FAQs",
      subtitle: "Frequently asked questions",
      icon: HelpCircle,
      action: () => console.log("FAQs clicked"),
    },
    {
      title: "About ALU",
      subtitle: "Learn more about our union",
      icon: Info,
      action: () => console.log("About clicked"),
    },
    {
      title: "Contact Support",
      subtitle: "Get help and assistance",
      icon: Phone,
      action: () => console.log("Contact Us clicked"),
    },
    {
      title: "Rate our app",
      subtitle: "Help us improve your experience",
      icon: Star,
      action: () => console.log("Rate our app clicked"),
    },
    {
      title: "Settings",
      subtitle: "App preferences and notifications",
      icon: Settings,
      action: () => console.log("Settings clicked"),
    },
    {
      title: "Log out",
      subtitle: "Sign out of your account",
      icon: LogOut,
      action: onLogout,
      isDanger: true,
    },
  ];

  return (
    <>
      <AppLayout
        currentScreen="account"
        onNavigate={onNavigate}
        onLogout={onLogout}
      >
        <div className="bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header with enhanced geometric background */}
        <div className="relative bg-white overflow-hidden shadow-sm">
          {/* Enhanced Geometric Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute right-0 top-0 w-40 h-40 opacity-80 lg:w-60 lg:h-60">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
              >
                <defs>
                  <linearGradient
                    id="gradient1"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                  <linearGradient
                    id="gradient2"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="100%" stopColor="#DC2626" />
                  </linearGradient>
                </defs>
                <polygon
                  points="70,10 90,30 70,50"
                  fill="url(#gradient2)"
                />
                <polygon
                  points="80,20 100,40 80,60"
                  fill="#F59E0B"
                  opacity="0.8"
                />
                <polygon
                  points="60,30 80,50 60,70"
                  fill="url(#gradient1)"
                />
                <polygon
                  points="50,40 70,60 50,80"
                  fill="#10B981"
                  opacity="0.9"
                />
              </svg>
            </div>
          </div>

          <div className="relative p-6 pb-8">
            <h1 className="text-center font-semibold text-xl mb-8 text-gray-800 text-[20px]">
              Account
            </h1>

            {/* Enhanced Profile Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-start space-x-4 mb-6">
                <button
                  onClick={() => setShowPersonalDetails(true)}
                  className="flex-shrink-0 group relative"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-white shadow-lg group-hover:ring-blue-200 transition-all duration-300">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-blue-600" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                    <Camera className="w-3 h-3 text-white" />
                  </div>
                </button>

                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-xl text-gray-900 mb-2">
                    Hi, {user.firstName}!
                  </h2>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-gray-700">
                        {user.phone || "+63XXXXXXXXXX"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-gray-700 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">
                    Member Since
                  </p>
                  <p className="text-sm font-semibold text-blue-800">
                    {new Date(
                      user.membershipDate,
                    ).getFullYear()}
                  </p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">
                    Position
                  </p>
                  <p className="text-sm font-semibold text-green-800 truncate">
                    {user.unionPosition}
                  </p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-600 font-medium">
                    Company
                  </p>
                  <p className="text-sm font-semibold text-purple-800 truncate">
                    {user.company?.split(" ")[0] || "ALU"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information Sections */}
        <div className="px-4 py-6 max-w-md mx-auto lg:max-w-6xl">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-8 lg:space-y-0">
            {/* Left Column - Profile Information */}
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-800 text-xl lg:text-2xl mb-6">
                Profile Information
              </h3>

              <div className="space-y-4">
                {profileSections.map((section, index) => (
                  <button
                    key={index}
                    onClick={section.action}
                    className="w-full bg-white rounded-xl p-4 lg:p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`${section.iconBg} rounded-full p-3 lg:p-4 shadow-sm`}
                      >
                        <section.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-medium text-gray-800 lg:text-lg">
                          {section.title}
                        </h4>
                        <p className="text-sm lg:text-base text-gray-600">
                          {section.subtitle}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column - App Features & Settings */}
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-800 text-xl lg:text-2xl mb-6">
                App Features & Settings
              </h3>

              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className={`w-full flex items-center justify-between p-4 lg:p-6 hover:bg-gray-50 transition-colors ${
                      index !== menuItems.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    } ${item.isDanger ? "text-red-600 hover:bg-red-50" : "text-gray-700"}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center ${
                          item.isDanger
                            ? "bg-red-50"
                            : "bg-gray-50"
                        }`}
                      >
                        <item.icon
                          className={`w-5 h-5 lg:w-6 lg:h-6 ${item.isDanger ? "text-red-600" : "text-gray-600"}`}
                        />
                      </div>
                      <div className="text-left">
                        <p className="font-medium lg:text-lg">
                          {item.title}
                        </p>
                        <p
                          className={`text-xs lg:text-sm ${item.isDanger ? "text-red-500" : "text-gray-500"}`}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 lg:w-6 lg:h-6 ${item.isDanger ? "text-red-400" : "text-gray-400"}`}
                    />
                  </button>
                ))}
              </div>

              {/* Desktop Additional Info */}
              <div className="hidden lg:block bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-3">Quick Access</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onNavigate('digitalId')}
                    className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:shadow-sm transition-colors"
                  >
                    <QrCode className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Digital ID</span>
                  </button>
                  <button
                    onClick={() => onNavigate('dues')}
                    className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:shadow-sm transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Dues</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </AppLayout>

      {/* Modals */}
      {showPersonalDetails && (
        <PersonalDetails
          user={user}
          onClose={() => setShowPersonalDetails(false)}
        />
      )}

      {showContactDetails && (
        <ContactDetails
          user={user}
          onClose={() => setShowContactDetails(false)}
        />
      )}

      {showEmploymentDetails && (
        <EmploymentDetails
          user={user}
          onClose={() => setShowEmploymentDetails(false)}
        />
      )}
    </>
  );
}