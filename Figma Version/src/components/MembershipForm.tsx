import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Download, Printer, FileText, Info } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AppLayout } from './AppLayout';

interface MembershipFormProps {
  onNavigate: (screen: string) => void;
  onLogout?: () => void;
  user?: any;
}

export function MembershipForm({ onNavigate, onLogout, user }: MembershipFormProps) {
  
  const handleDownload = () => {
    // In a real app, this would download the actual PDF form
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,JVBERi0xLjQK'; // Placeholder
    link.download = 'ALU_Membership_Form.pdf';
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppLayout
      currentScreen="membershipForm"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-light text-gray-900">Membership Registration Form</h1>
              <p className="text-gray-600">Complete your ALU membership application</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Approval Status Banner */}
        {user && (
          <div className={`mb-6 p-4 rounded-xl border ${
            user.isApproved 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {user.isApproved ? (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div>
                  <h4 className={`font-semibold ${
                    user.isApproved ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    {user.isApproved ? 'Membership Approved' : 'Membership Pending Approval'}
                  </h4>
                  <p className={`text-sm ${
                    user.isApproved ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {user.isApproved 
                      ? 'Your membership has been approved. Below is your official registration information.'
                      : 'Your membership application is under review. You can view your submitted information below for verification.'
                    }
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                user.isApproved 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user.isApproved ? 'APPROVED' : 'PENDING'}
              </div>
            </div>
          </div>
        )}

        <form className="bg-white border border-gray-200 rounded-xl shadow-sm">
          {/* Form Header */}
          <div className="border-b border-gray-200 px-8 py-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">ALU</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Associated Labor Unions</h2>
                  <p className="text-gray-600">Luzon Regional Office</p>
                  <p className="text-sm text-gray-500">262 ALU-AFILUTE Bldg. 15th Ave. Brgy. Silangan, Cubao, Quezon City</p>
                </div>
              </div>
              <div className="text-center">
                {user?.profilePicture ? (
                  <div className="w-24 h-28 border-2 border-gray-300 rounded-lg overflow-hidden">
                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-28 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-xs">2x2 picture</div>
                      <div className="text-xs">here</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">MEMBERSHIP REGISTRATION FORM</h3>
              {user && (
                <p className="text-sm font-medium text-blue-600 mt-1">
                  Member ID: {user.digitalId}
                </p>
              )}
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="bg-blue-600 text-white text-center py-2 rounded-lg mb-6">
              <h3 className="font-semibold">PERSONAL INFORMATION</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={user ? `${user.firstName} ${user.middleInitial ? user.middleInitial + '. ' : ''}${user.lastName}` : ''}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Place Of Birth</label>
                <input 
                  type="text" 
                  value={user?.placeOfBirth || ''}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Of Birth</label>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="MM" 
                    value={user?.dateOfBirth ? String(new Date(user.dateOfBirth).getMonth() + 1).padStart(2, '0') : ''}
                    readOnly
                    className="w-16 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
                  />
                  <span className="flex items-center">-</span>
                  <input 
                    type="text" 
                    placeholder="DD" 
                    value={user?.dateOfBirth ? String(new Date(user.dateOfBirth).getDate()).padStart(2, '0') : ''}
                    readOnly
                    className="w-16 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
                  />
                  <span className="flex items-center">-</span>
                  <input 
                    type="text" 
                    placeholder="YYYY" 
                    value={user?.dateOfBirth ? new Date(user.dateOfBirth).getFullYear() : ''}
                    readOnly
                    className="w-20 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea 
                value={user?.address || ''}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
                rows={2}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      checked={user?.maritalStatus === 'Single'}
                      readOnly
                    />
                    <span className="text-sm">Single</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      checked={user?.maritalStatus === 'Married'}
                      readOnly
                    />
                    <span className="text-sm">Married</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      checked={user?.maritalStatus === 'Divorced'}
                      readOnly
                    />
                    <span className="text-sm">Divorce</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-2" 
                      checked={user?.maritalStatus && !['Single', 'Married', 'Divorced'].includes(user.maritalStatus)}
                      readOnly
                    />
                    <span className="text-sm">Others</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input 
                  type="text" 
                  value={user?.dateOfBirth ? Math.floor((new Date().getTime() - new Date(user.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : ''}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Educational Attainment</label>
                <input 
                  type="text" 
                  value={user?.education || ''}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">No. of Children</label>
                <input 
                  type="text" 
                  value={user?.numberOfChildren || ''}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                <input 
                  type="text" 
                  value={user?.religion || ''}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact No.</label>
                <input 
                  type="text" 
                  value={user?.phone || ''}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail</label>
                <input 
                  type="email" 
                  value={user?.email || ''}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Man</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Woman</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Other (please state)</span>
                  <input type="text" className="border border-gray-300 rounded px-2 py-1 text-sm" />
                </div>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Prefer not to say</span>
                </label>
              </div>
            </div>
          </div>

          {/* Employment Information Section */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="bg-blue-600 text-white text-center py-2 rounded-lg mb-6">
              <h3 className="font-semibold">EMPLOYMENT INFORMATION</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employer</label>
                <input 
                  type="text" 
                  value={user?.company || ''} 
                  readOnly 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <input 
                  type="text" 
                  value={user?.position || ''} 
                  readOnly 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit/Section</label>
                <input 
                  type="text" 
                  value={user?.department || ''} 
                  readOnly 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years Employed</label>
                <input 
                  type="text" 
                  value={user?.yearsEmployed || ''} 
                  readOnly 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700" 
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Name of Union</label>
              <input 
                type="text" 
                value={user?.unionAffiliation || ''} 
                readOnly 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700" 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position in Union</label>
                <input 
                  type="text" 
                  value={user?.unionPosition || ''} 
                  readOnly 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Membership</label>
                <input 
                  type="text" 
                  value={user?.membershipDate ? new Date(user.membershipDate).toLocaleDateString() : ''} 
                  readOnly 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700" 
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="bg-blue-600 text-white text-center py-2 rounded-lg mb-6">
              <h3 className="font-semibold">CONTACT PERSON IN CASE OF EMERGENCY:</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={user?.emergencyContact?.name || ''} 
                  readOnly 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                <input 
                  type="text" 
                  value={user?.emergencyContact?.relationship || ''} 
                  readOnly 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700" 
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea 
                value={user?.emergencyContact?.address || ''} 
                readOnly 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700" 
                rows={2}
              ></textarea>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact No.</label>
              <input 
                type="text" 
                value={user?.emergencyContact?.phone || ''} 
                readOnly 
                className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700" 
              />
            </div>
          </div>

          {/* Legal Notice Section */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">A note on Data Privacy and Confidentiality:</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The Associated Labor Unions adheres to the rules and regulations set by Republic Act No. 10173 or the 
                  Data Privacy Act of 2012. All information provided in this form will be treated with utmost confidentiality.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Informed Consent:</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The Associated Labor Unions may compile statistics on personal and sensitive personal information I 
                  have willfully submitted and declared in connection with my union membership application subject to 
                  the provisions of the Philippine Data Privacy Act. I understand that all information in my application and 
                  requests are necessary and will be treated with utmost confidentiality.
                </p>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="px-8 py-6">
            <div className="flex justify-end">
              <div className="text-center">
                <div className="border-b-2 border-gray-400 w-48 h-16 mb-2"></div>
                <p className="text-sm font-medium text-gray-700">Signature</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 rounded-b-xl">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  type="button"
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handlePrint}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Form
                </Button>
              </div>
              

            </div>
          </div>
        </form>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-4">Required Documents</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Recent 2x2 ID photo (attach to printed form)
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Employment verification (company ID or payslip)
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Valid government-issued ID
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Processing Information</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Form processing takes 5-7 business days
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                You'll receive email notification upon approval
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Keep a copy of your completed form for records
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need assistance? Contact ALU at <span className="font-medium">(02) 8123-4567</span> or visit our office during business hours.
          </p>
        </div>
      </div>
      </div>
    </AppLayout>
  );
}