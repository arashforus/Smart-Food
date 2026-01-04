import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, ExternalLink, QrCode, Loader2 } from 'lucide-react';
import QRCodeDisplay from '@/components/admin/QRCodeDisplay';

interface StorageTable {
  id: string;
  tableNumber: string;
  branchId: string;
  capacity: number;
  location?: string;
  status: string;
  isActive: boolean;
}

interface StorageBranch {
  id: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
}

export default function QRCodePage() {
  const [selectedBranch, setSelectedBranch] = useState<string>('all');

  const { data: tables = [], isLoading: tablesLoading } = useQuery<StorageTable[]>({
    queryKey: ['/api/tables'],
  });

  const { data: branches = [], isLoading: branchesLoading } = useQuery<StorageBranch[]>({
    queryKey: ['/api/branches'],
  });

  const { data: settings, isLoading: settingsLoading } = useQuery<any>({
    queryKey: ['/api/settings'],
  });

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const mainMenuUrl = `${baseUrl}/menu`;

  const getTableMenuUrl = (tableId: string) => `${baseUrl}/menu?table=${tableId}`;

  const filteredTables = selectedBranch === 'all' 
    ? tables 
    : tables.filter((t) => t.branchId === selectedBranch);

  const getBranchName = (branchId: string) => branches.find((b) => b.id === branchId)?.name || 'Unknown';

  if (tablesLoading || branchesLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">QR Codes</h1>
        <p className="text-muted-foreground">Generate QR codes for your digital menu</p>
      </div>

      <Tabs defaultValue="main" className="space-y-6 flex flex-col items-center">
        <TabsList>
          <TabsTrigger value="main" data-testid="tab-main-qr">Main Menu</TabsTrigger>
          <TabsTrigger value="tables" data-testid="tab-tables-qr">Table QR Codes</TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="w-full flex justify-center">
          <QRCodeDisplay 
            menuUrl={mainMenuUrl} 
            id="main-qr-code"
            filename="main-menu-qr.png"
          />
        </TabsContent>

        <TabsContent value="tables" className="space-y-4 w-full flex flex-col items-center">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-sm text-muted-foreground">Filter by branch:</span>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedBranch === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedBranch('all')}
                data-testid="button-filter-all"
              >
                All Branches
              </Button>
              {branches.filter(b => b.isActive).map((branch) => (
                <Button
                  key={branch.id}
                  variant={selectedBranch === branch.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedBranch(branch.id)}
                  data-testid={`button-filter-branch-${branch.id}`}
                >
                  {branch.name}
                </Button>
              ))}
            </div>
          </div>

          {filteredTables.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No tables found. Add tables in the Tables section first.
              </CardContent>
            </Card>
          ) : (
            <div className="w-full flex justify-center">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl">
              {filteredTables.filter(t => t.isActive).map((table) => (
                <div key={table.id} className="flex flex-col">
                  <div className="bg-card rounded-lg border shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-base">Table {table.tableNumber}</h3>
                        <Badge variant="outline" className="no-default-active-elevate text-xs">
                          {table.capacity} seats
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {getBranchName(table.branchId)}
                      </p>
                    </div>
                    <div className="px-4 pb-4">
                      <QRCodeDisplay 
                        menuUrl={getTableMenuUrl(table.id)}
                        id={`table-qr-${table.id}`}
                        size={120}
                        filename={`table-${table.tableNumber}-qr.png`}
                      />
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
