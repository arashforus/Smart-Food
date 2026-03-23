import { Link, useLocation } from 'wouter';
import logoDark from "@/assets/images/logo-dark.png";
import logoLight from "@/assets/images/logo-light.png";
import LanguageSelector from '@/components/menu/LanguageSelector';
import { useLanguage } from '@/hooks/use-language';
import { useTheme } from '@/hooks/use-theme-hook';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Store, 
  List, 
  UtensilsCrossed, 
  QrCode,
  Building2,
  TableProperties,
  Users,
  Settings,
  Globe,
  Salad,
  Tags,
  ShoppingCart,
  ChefHat,
  Monitor,
  ClipboardList
} from 'lucide-react';

export default function AdminSidebar() {
  const [location] = useLocation();
  const { adminLanguage, setAdminLanguage, adminDir, t } = useLanguage();
  const { theme } = useTheme();

  const logoImg = theme === 'dark' ? logoLight : logoDark;

  const menuItems = [
    { title: t('dashboard'), url: '/admin', icon: LayoutDashboard },
    { title: t('categories'), url: '/admin/categories', icon: List },
    { title: t('menu_items'), url: '/admin/items', icon: UtensilsCrossed },
    { title: t('qr_codes'), url: '/admin/qrcode', icon: QrCode },
  ];

  const operationsItems = [
    { title: t('new_order'), url: '/admin/orders', icon: ShoppingCart },
    { title: t('orders_list'), url: '/admin/orders-list', icon: ClipboardList },
    { title: t('kitchen'), url: '/admin/kitchen', icon: ChefHat },
    { title: t('order_status'), url: '/admin/order-status-screen', icon: Monitor },
  ];

  const managementItems = [
    { title: t('branches'), url: '/admin/branches', icon: Building2 },
    { title: t('tables'), url: '/admin/tables', icon: TableProperties },
    { title: t('roles'), url: '/admin/roles', icon: Users },
  ];

  const settingsItems = [
    { title: t('languages'), url: '/admin/languages', icon: Globe },
    { title: t('materials'), url: '/admin/materials', icon: Salad },
    { title: t('food_types'), url: '/admin/types', icon: Tags },
    { title: t('settings'), url: '/admin/settings', icon: Settings },
  ];

  const isActive = (url: string) => {
    if (url === '/admin') return location === '/admin';
    return location.startsWith(url);
  };

  return (
    <Sidebar side={adminDir === 'rtl' ? 'right' : 'left'}>
      <SidebarHeader className="p-4 flex flex-row items-center gap-2">
        <img src={logoImg} alt="QRdish Logo" className="h-8 w-8 object-contain" />
        <span className="font-qrdish-display font-bold text-2xl tracking-tight text-white">
          QR<span className="text-qrdish-color">dish</span>
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('menu_items')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url} data-testid={`link-admin-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t('operations')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {operationsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url} data-testid={`link-admin-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t('management')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url} data-testid={`link-admin-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t('configuration')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url} data-testid={`link-admin-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 flex flex-col gap-4">
        
        <p className="text-xs text-muted-foreground">v1.5.0</p>
      </SidebarFooter>
    </Sidebar>
  );
}
