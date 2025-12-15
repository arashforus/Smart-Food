import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';

interface QRCodeDisplayProps {
  menuUrl: string;
}

export default function QRCodeDisplay({ menuUrl }: QRCodeDisplayProps) {
  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg');
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
      downloadLink.download = 'menu-qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Your Menu QR Code</CardTitle>
        <CardDescription>
          Print and display this QR code in your restaurant for customers to scan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center p-4 bg-white rounded-md">
          <QRCodeSVG
            id="qr-code-svg"
            value={menuUrl}
            size={200}
            level="H"
            includeMargin
            data-testid="qr-code-svg"
          />
        </div>
        <p className="text-sm text-muted-foreground text-center break-all">
          {menuUrl}
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleDownload} className="flex-1" data-testid="button-download-qr">
            <Download className="h-4 w-4 mr-2" />
            Download PNG
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(menuUrl, '_blank')}
            className="flex-1"
            data-testid="button-preview-menu"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Preview Menu
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
