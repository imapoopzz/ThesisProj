import { useState } from 'react';
import { SidebarProvider } from './components/ui/sidebar';
import { AdminSidebar } from './components/AdminSidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { MembersTable } from './components/MembersTable';
import { MemberProfile } from './components/MemberProfile';
import { RegistrationReview } from './components/RegistrationReview';
import { IDCardManagement } from './components/IDCardManagement';
import { DuesFinance } from './components/DuesFinance';
import { BenefitsAssistance } from './components/BenefitsAssistance';
import { BenefitsAssistanceTriage } from './components/BenefitsAssistanceTriage';
import { ProponentQueue } from './components/ProponentQueue';
import { AdminFinalApprovalQueue } from './components/AdminFinalApprovalQueue';
import { AuditLog } from './components/AuditLog';
import { EventManagement } from './components/EventManagement';
import { ReportsAnalytics } from './components/ReportsAnalytics';
import { AdminSettings } from './components/AdminSettings';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'members':
        return <MembersTable onViewMember={(id) => {
          setSelectedMemberId(id);
          setCurrentPage('member-profile');
        }} />;
      case 'member-profile':
        return <MemberProfile memberId={selectedMemberId} onBack={() => setCurrentPage('members')} />;
      case 'registration-review':
        return <RegistrationReview />;
      case 'id-card-management':
        return <IDCardManagement />;
      case 'dues-finance':
        return <DuesFinance />;
      case 'benefits-assistance':
        return <BenefitsAssistanceTriage onNavigate={setCurrentPage} />;
      case 'benefits-assistance-legacy':
        return <BenefitsAssistance />;
      case 'proponent-queue':
        return <ProponentQueue />;
      case 'admin-approval-queue':
        return <AdminFinalApprovalQueue />;
      case 'audit-log':
        return <AuditLog />;
      case 'events-qr':
        return <EventManagement />;
      case 'reports-analytics':
        return <ReportsAnalytics />;
      case 'admin-settings':
        return <AdminSettings />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AdminSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-auto bg-gray-50">
            {renderCurrentPage()}
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}