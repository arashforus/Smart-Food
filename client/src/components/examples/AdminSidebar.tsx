import AdminSidebar from '../admin/AdminSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function AdminSidebarExample() {
  return (
    <SidebarProvider>
      <div className="flex h-64 w-full">
        <AdminSidebar />
      </div>
    </SidebarProvider>
  );
}
