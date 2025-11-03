import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  CreditCard, 
  DollarSign, 
  Heart, 
  Calendar, 
  BarChart3, 
  Settings,
  Bot
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';

interface AdminSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'registration-review', label: 'Registration Review', icon: UserCheck },
  { id: 'id-card-management', label: 'ID & Card Management', icon: CreditCard },
  { id: 'dues-finance', label: 'Dues & Finance', icon: DollarSign },
  { id: 'benefits-assistance', label: 'Benefits & Assistance', icon: Heart },
  { id: 'events-qr', label: 'Event Management', icon: Calendar },
  { id: 'reports-analytics', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'admin-settings', label: 'Admin Settings', icon: Settings },
];

export function AdminSidebar({ currentPage, onNavigate }: AdminSidebarProps) {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">A</span>
          </div>
          <div>
            <h1 className="font-bold">ALUzon</h1>
            <p className="text-sm text-muted-foreground">Admin Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 py-4">
        <SidebarMenu>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => onNavigate(item.id)}
                  isActive={currentPage === item.id}
                  className="w-full justify-start"
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}