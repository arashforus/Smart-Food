import { QRCode } from 'react-qrcode-logo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface QRCodeDisplayProps {
  menuUrl: string;
  id?: string;
  size?: number;
  filename?: string;
}

export default function QRCodeDisplay({ 
  menuUrl, 
  id = "qr-code-canvas", 
  size = 200,
  filename = "menu-qr-code.png"
}: QRCodeDisplayProps) {
  const { data: settings } = useQuery<any>({ 
    queryKey: ["/api/settings"],
  });

  const handleDownload = () => {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!canvas) return;

    const pngFile = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = pngFile;
    downloadLink.click();
  };

  // Map settings to react-qrcode-logo props
  const qrStyle = settings?.qrDotsStyle === 'dots' ? 'dots' : 
                  settings?.qrDotsStyle === 'rounded' ? 'fluid' : 'squares';
  
  const eyeRadius = settings?.qrEyeBorderShape === 'rounded' ? 10 : 0;

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle>Your Menu QR Code</CardTitle>
        <CardDescription>
          Print and display this QR code in your restaurant for customers to scan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center p-4 bg-white rounded-md overflow-hidden">
          <QRCode
            id={id}
            value={menuUrl}
            size={size}
            qrStyle={qrStyle}
            eyeRadius={eyeRadius}
            fgColor={settings?.qrForegroundColor || "#000000"}
            bgColor={settings?.qrBackgroundColor || "#FFFFFF"}
            logoImage={settings?.qrLogo}
            logoWidth={size * 0.2}
            logoHeight={size * 0.2}
            logoOpacity={1}
            removeQrCodeBehindLogo={true}
            eyeColor={settings?.qrEyeBorderColor || settings?.qrForegroundColor || "#000000"}
            data-testid={id}
          />
        </div>
        <p className="text-sm text-muted-foreground text-center break-all">
          {menuUrl}
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleDownload} className="flex-1" data-testid={`button-download-${id}`}>
            <Download className="h-4 w-4 mr-2" />
            Download PNG
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(menuUrl, '_blank')}
            className="flex-1"
            data-testid={`button-preview-${id}`}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Preview Menu
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
