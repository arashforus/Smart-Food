import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import QRCodeStyling from 'qr-code-styling';

interface QRCodeDisplayProps {
  menuUrl: string;
  id?: string;
  size?: number;
  filename?: string;
}

export default function QRCodeDisplay({ 
  menuUrl, 
  id = "qr-code-container", 
  size = 200,
  filename = "menu-qr-code.png"
}: QRCodeDisplayProps) {
  const { data: settings } = useQuery<any>({ 
    queryKey: ["/api/settings"],
  });

  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!qrRef.current) return;

    const qrCode = new QRCodeStyling({
      width: size,
      height: size,
      type: 'svg',
      data: menuUrl,
      dotsOptions: {
        color: settings?.qrForegroundColor || '#000000',
        type: (settings?.qrDotsStyle || 'square') as any,
      },
      cornersSquareOptions: {
        color: settings?.qrEyeBorderColor || settings?.qrForegroundColor || '#000000',
        type: (settings?.qrEyeBorderShape || 'square') as any,
      },
      cornersDotOptions: {
        color: settings?.qrEyeDotColor || settings?.qrForegroundColor || '#000000',
        type: (settings?.qrEyeDotShape || 'square') as any,
      },
      backgroundOptions: {
        color: settings?.qrBackgroundColor || '#FFFFFF',
      },
      image: settings?.qrLogo || undefined,
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 0,
        crossOrigin: 'anonymous',
      },
      margin: 0,
    });

    qrRef.current.innerHTML = '';
    qrCode.append(qrRef.current);
    qrInstanceRef.current = qrCode;
  }, [menuUrl, settings, size]);

  const handleDownload = () => {
    if (!qrInstanceRef.current) return;
    qrInstanceRef.current.download({ name: filename.replace('.png', ''), extension: 'png' });
  };

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
          <div ref={qrRef} data-testid={id} />
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
