import { useState, useEffect } from 'react';
import { Switch, Route } from 'wouter';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminFooter from '@/components/admin/AdminFooter';
import { useToast } from '@/hooks/use-toast';
import { mockCurrentUser, mockBranches } from '@/lib/mockData';
import type { Language } from '@/lib/types';

import DashboardPage from './dashboard';
import RestaurantPage from './restaurant';
import CategoriesPage from './categories';
import ItemsPage from './items';
import QRCodePage from './qrcode';
import BranchesPage from './branches';
import TablesPage from './tables';
import RolesPage from './roles';
import LanguagesPage from './languages';
import MaterialsPage from './materials';
import TypesPage from './types';
import SettingsPage from './settings';
import OrdersPage from './orders';
import KitchenPage from './kitchen';

export default function AdminLayout() {
  const { toast } = useToast();
  const [adminLanguage, setAdminLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('adminLanguage') as Language;
    return stored || 'en';
  });
  const [selectedBranch, setSelectedBranch] = useState<string>(() => {
    const stored = localStorage.getItem('selectedBranch');
    return stored || mockBranches[0]?.id || '';
  });

  useEffect(() => {
    localStorage.setItem('adminLanguage', adminLanguage);
  }, [adminLanguage]);

  useEffect(() => {
    localStorage.setItem('selectedBranch', selectedBranch);
  }, [selectedBranch]);

  const handleProfileClick = () => {
    toast({ title: 'Profile', description: 'Profile settings coming soon' });
  };

  const handlePasswordClick = () => {
    toast({ title: 'Change Password', description: 'Password change coming soon' });
  };

  const handleSignOut = () => {
    toast({ title: 'Signed Out', description: 'You have been signed out' });
  };

  const style = {
    '--sidebar-width': '16rem',
    '--sidebar-width-icon': '4rem',
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <AdminHeader
            user={mockCurrentUser}
            branches={mockBranches}
            selectedBranch={selectedBranch}
            onBranchChange={setSelectedBranch}
            language={adminLanguage}
            onLanguageChange={setAdminLanguage}
            onProfileClick={handleProfileClick}
            onPasswordClick={handlePasswordClick}
            onSignOut={handleSignOut}
          />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Switch>
              <Route path="/admin" component={DashboardPage} />
              <Route path="/admin/restaurant" component={RestaurantPage} />
              <Route path="/admin/categories" component={CategoriesPage} />
              <Route path="/admin/items" component={ItemsPage} />
              <Route path="/admin/qrcode" component={QRCodePage} />
              <Route path="/admin/branches" component={BranchesPage} />
              <Route path="/admin/tables" component={TablesPage} />
              <Route path="/admin/roles" component={RolesPage} />
              <Route path="/admin/languages" component={LanguagesPage} />
              <Route path="/admin/materials" component={MaterialsPage} />
              <Route path="/admin/types" component={TypesPage} />
              <Route path="/admin/settings" component={SettingsPage} />
              <Route path="/admin/orders" component={OrdersPage} />
              <Route path="/admin/kitchen" component={KitchenPage} />
            </Switch>
          </main>
          <AdminFooter />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
