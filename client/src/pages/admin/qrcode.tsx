import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, ExternalLink, QrCode, Loader2 } from 'lucide-react';

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

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const mainMenuUrl = `${baseUrl}/menu`;

  const getTableMenuUrl = (tableId: string) => `${baseUrl}/menu?table=${tableId}`;

  const handleDownload = (elementId: string, filename: string) => {
    const svg = document.getElementById(elementId);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = filename;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const filteredTables = selectedBranch === 'all' 
    ? tables 
    : tables.filter((t) => t.branchId === selectedBranch);

  const getBranchName = (branchId: string) => branches.find((b) => b.id === branchId)?.name || 'Unknown';

  if (tablesLoading || branchesLoading) {
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

      <Tabs defaultValue="main" className="space-y-6">
        <TabsList>
          <TabsTrigger value="main" data-testid="tab-main-qr">Main Menu</TabsTrigger>
          <TabsTrigger value="tables" data-testid="tab-tables-qr">Table QR Codes</TabsTrigger>
        </TabsList>

        <TabsContent value="main">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Main Menu QR Code
              </CardTitle>
              <CardDescription>
                Universal QR code for your restaurant menu - not linked to any specific table
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center p-4 bg-white rounded-md">
                <QRCodeSVG
                  id="main-qr-code"
                  value={mainMenuUrl}
                  size={200}
                  level="H"
                  includeMargin
                  data-testid="qr-code-main"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center break-all">
                {mainMenuUrl}
              </p>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  onClick={() => handleDownload('main-qr-code', 'main-menu-qr.png')} 
                  className="flex-1"
                  data-testid="button-download-main-qr"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(mainMenuUrl, '_blank')}
                  className="flex-1"
                  data-testid="button-preview-main"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTables.filter(t => t.isActive).map((table) => (
                <Card key={table.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base">Table {table.tableNumber}</CardTitle>
                      <Badge variant="outline" className="no-default-active-elevate text-xs">
                        {table.capacity} seats
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {getBranchName(table.branchId)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-center p-2 bg-white rounded-md">
                      <QRCodeSVG
                        id={`table-qr-${table.id}`}
                        value={getTableMenuUrl(table.id)}
                        size={120}
                        level="H"
                        includeMargin
                        data-testid={`qr-code-table-${table.id}`}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        onClick={() => handleDownload(`table-qr-${table.id}`, `table-${table.tableNumber}-qr.png`)} 
                        className="flex-1"
                        data-testid={`button-download-table-${table.id}`}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(getTableMenuUrl(table.id), '_blank')}
                        data-testid={`button-preview-table-${table.id}`}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
