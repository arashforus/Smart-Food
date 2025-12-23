import { useState, useEffect } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminFooter from '@/components/admin/AdminFooter';
import { useToast } from '@/hooks/use-toast';
import { mockCurrentUser } from '@/lib/mockData';
import { OrderProvider } from '@/lib/orderContext';
import type { Language, Branch } from '@/lib/types';

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
import OrdersListPage from './orders-list';
import KitchenPage from './kitchen';
import OrderStatusScreen from './order-status-screen';

export default function AdminLayout() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentUser, setCurrentUser] = useState(mockCurrentUser);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [adminLanguage, setAdminLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('adminLanguage') as Language;
    return stored || 'en';
  });

  const { data: branches = [] } = useQuery({
    queryKey: ['/api/branches'],
    queryFn: async () => {
      const response = await fetch('/api/branches');
      if (!response.ok) throw new Error('Failed to fetch branches');
      return response.json() as Promise<Branch[]>;
    },
  });

  const [selectedBranch, setSelectedBranch] = useState<string>(() => {
    const stored = localStorage.getItem('selectedBranch');
    return stored || '';
  });

  useEffect(() => {
    if (!selectedBranch && branches.length > 0) {
      setSelectedBranch(branches[0].id);
    }
  }, [branches, selectedBranch]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setCurrentUser((prev) => ({
            ...prev,
            id: data.userId,
            name: data.name,
            email: data.email,
            role: data.role,
            avatar: data.avatar || prev.avatar,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    localStorage.setItem('adminLanguage', adminLanguage);
  }, [adminLanguage]);

  useEffect(() => {
    localStorage.setItem('selectedBranch', selectedBranch);
  }, [selectedBranch]);

  const handleProfileClick = () => {
    setLocation('/admin/settings?tab=profile');
  };

  const handlePasswordClick = () => {
    setLocation('/admin/settings?tab=profile&action=changePassword');
  };

  const handleSignOut = () => {
    toast({ title: 'Signed Out', description: 'You have been signed out' });
  };

  const style = {
    '--sidebar-width': '16rem',
    '--sidebar-width-icon': '4rem',
  };

  return (
    <OrderProvider>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          <SidebarInset className="flex flex-col flex-1">
            <AdminHeader
              user={currentUser}
              branches={branches}
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
                <Route path="/admin/orders-list" component={OrdersListPage} />
                <Route path="/admin/kitchen" component={KitchenPage} />
                <Route path="/admin/order-status-screen" component={OrderStatusScreen} />
              </Switch>
            </main>
            <AdminFooter />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </OrderProvider>
  );
}
