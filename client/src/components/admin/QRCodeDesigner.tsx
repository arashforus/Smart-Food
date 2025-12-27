import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Plus, Trash2, Copy } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import QRCodeStyling from 'qr-code-styling';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { useToast } from '@/hooks/use-toast';

interface QRDesign {
  id: string;
  name: string;
  qrText: string;
  logoUrl: string;
  backgroundColor: string;
  foregroundColor: string;
  cornerDots: string;
  cornerSquares: string;
  createdAt: Date;
}

export default function QRCodeDesigner() {
  const { toast } = useToast();
  const qrRef = useRef<HTMLDivElement>(null);
  const qrDisplayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrInstanceRef = useRef<QRCodeStyling | null>(null);

  const [designs, setDesigns] = useState<QRDesign[]>(() => {
    const stored = localStorage.getItem('qrDesigns');
    return stored ? JSON.parse(stored) : [];
  });

  const [currentDesign, setCurrentDesign] = useState<Partial<QRDesign>>({
    name: 'QR Design 1',
    qrText: 'https://example.com',
    logoUrl: '',
    backgroundColor: '#FFFFFF',
    foregroundColor: '#000000',
    cornerDots: 'square',
    cornerSquares: 'square',
  });

  // Initialize and update QR code whenever design changes
  useEffect(() => {
    if (!qrDisplayRef.current) return;

    const updateQRCode = () => {
      try {
        // Clear previous QR code
        if (qrDisplayRef.current) {
          qrDisplayRef.current.innerHTML = '';
        }

        // Create new QR code instance
        const qrCode = new QRCodeStyling({
          width: 256,
          height: 256,
          type: 'svg' as any,
          data: currentDesign.qrText || 'https://example.com',
          dotsOptions: {
            color: currentDesign.foregroundColor || '#000000',
            type: (currentDesign.cornerDots || 'square') as any,
          },
          cornersSquareOptions: {
            color: currentDesign.foregroundColor || '#000000',
            type: (currentDesign.cornerSquares || 'square') as any,
          },
          cornersDotOptions: {
            color: currentDesign.foregroundColor || '#000000',
            type: (currentDesign.cornerDots || 'square') as any,
          },
          backgroundOptions: {
            color: currentDesign.backgroundColor || '#FFFFFF',
          },
          margin: 10,
        });

        // Store instance and render
        qrInstanceRef.current = qrCode;
        if (qrDisplayRef.current) {
          qrCode.append(qrDisplayRef.current);
        }
      } catch (error) {
        console.error('Error updating QR code:', error);
      }
    };

    updateQRCode();
  }, [currentDesign]);

  const handleQRTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDesign({ ...currentDesign, qrText: e.target.value });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDesign({ ...currentDesign, name: e.target.value });
  };

  const handleColorChange = (type: 'bg' | 'fg', color: string) => {
    if (type === 'bg') {
      setCurrentDesign({ ...currentDesign, backgroundColor: color });
    } else {
      setCurrentDesign({ ...currentDesign, foregroundColor: color });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setCurrentDesign({ ...currentDesign, logoUrl: imageData });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDesign = () => {
    if (!currentDesign.name || !currentDesign.qrText) {
      toast({ title: 'Error', description: 'Please fill in name and QR text', variant: 'destructive' });
      return;
    }

    const newDesign: QRDesign = {
      id: String(Date.now()),
      name: currentDesign.name,
      qrText: currentDesign.qrText,
      logoUrl: currentDesign.logoUrl || '',
      backgroundColor: currentDesign.backgroundColor || '#FFFFFF',
      foregroundColor: currentDesign.foregroundColor || '#000000',
      cornerDots: currentDesign.cornerDots as 'square' | 'rounded' | 'circle',
      cornerSquares: currentDesign.cornerSquares as 'square' | 'rounded' | 'circle',
      createdAt: new Date(),
    };

    const updatedDesigns = [...designs, newDesign];
    setDesigns(updatedDesigns);
    localStorage.setItem('qrDesigns', JSON.stringify(updatedDesigns));
    toast({ title: 'Success', description: 'QR code design saved' });
  };

  const handleDownload = async (design: QRDesign) => {
    try {
      // Create a new QR code instance for download
      const qrCode = new QRCodeStyling({
        width: 512,
        height: 512,
        type: 'image/png' as any,
        data: design.qrText,
        dotsOptions: {
          color: design.foregroundColor,
          type: (design.cornerDots || 'square') as any,
        },
        cornersSquareOptions: {
          color: design.foregroundColor,
          type: (design.cornerSquares || 'square') as any,
        },
        cornersDotOptions: {
          color: design.foregroundColor,
          type: (design.cornerDots || 'square') as any,
        },
        backgroundOptions: {
          color: design.backgroundColor,
        },
        margin: 10,
      });
      
      qrCode.download({ name: design.name, extension: 'png' });
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast({ title: 'Error', description: 'Failed to download QR code', variant: 'destructive' });
    }
  };

  const handleDeleteDesign = (id: string) => {
    const updatedDesigns = designs.filter((d) => d.id !== id);
    setDesigns(updatedDesigns);
    localStorage.setItem('qrDesigns', JSON.stringify(updatedDesigns));
    toast({ title: 'Deleted', description: 'QR code design removed' });
  };

  const handleLoadDesign = (design: QRDesign) => {
    setCurrentDesign(design);
  };

  const handleDuplicateDesign = (design: QRDesign) => {
    const newDesign: QRDesign = {
      ...design,
      id: String(Date.now()),
      name: `${design.name} (Copy)`,
      createdAt: new Date(),
    };
    const updatedDesigns = [...designs, newDesign];
    setDesigns(updatedDesigns);
    localStorage.setItem('qrDesigns', JSON.stringify(updatedDesigns));
    toast({ title: 'Duplicated', description: 'QR code design copied' });
  };

  return (
    <div className="space-y-6">
      {/* Designer Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">QR Code Designer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Controls */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">QR Code Text/URL</label>
                <Input
                  value={currentDesign.qrText || ''}
                  onChange={handleQRTextChange}
                  placeholder="https://example.com"
                  data-testid="input-qr-text"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Foreground Color</label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={currentDesign.foregroundColor || '#000000'}
                      onChange={(e) => handleColorChange('fg', e.target.value)}
                      className="w-12 h-9 p-1"
                      data-testid="input-qr-foreground-color"
                    />
                    <Input
                      type="text"
                      value={currentDesign.foregroundColor || '#000000'}
                      onChange={(e) => handleColorChange('fg', e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Background Color</label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={currentDesign.backgroundColor || '#FFFFFF'}
                      onChange={(e) => handleColorChange('bg', e.target.value)}
                      className="w-12 h-9 p-1"
                      data-testid="input-qr-background-color"
                    />
                    <Input
                      type="text"
                      value={currentDesign.backgroundColor || '#FFFFFF'}
                      onChange={(e) => handleColorChange('bg', e.target.value)}
                      placeholder="#FFFFFF"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Corner Dots</label>
                  <Select
                    value={currentDesign.cornerDots || 'square'}
                    onValueChange={(value) =>
                      setCurrentDesign({ ...currentDesign, cornerDots: value as 'square' | 'rounded' | 'circle' })
                    }
                  >
                    <SelectTrigger data-testid="select-qr-corner-dots">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="circle">Circle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Corner Squares</label>
                  <Select
                    value={currentDesign.cornerSquares || 'square'}
                    onValueChange={(value) =>
                      setCurrentDesign({ ...currentDesign, cornerSquares: value as 'square' | 'rounded' | 'circle' })
                    }
                  >
                    <SelectTrigger data-testid="select-qr-corner-squares">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="circle">Circle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Logo/Center Image</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                  data-testid="input-qr-logo"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-1"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="button-upload-logo"
                >
                  {currentDesign.logoUrl ? 'Change Logo' : 'Upload Logo'}
                </Button>
                {currentDesign.logoUrl && (
                  <div className="mt-2">
                    <img src={currentDesign.logoUrl} alt="Logo preview" className="h-16 w-16 rounded border" />
                  </div>
                )}
              </div>
            </div>

            {/* Right: Preview */}
            <div className="flex flex-col items-center justify-center space-y-4 p-6 border rounded-lg bg-gray-50">
              <div 
                ref={qrDisplayRef} 
                className="bg-white p-4 rounded-lg flex items-center justify-center"
                data-testid="qr-code-preview"
                style={{ width: '280px', height: '280px' }}
              />
              {currentDesign.logoUrl && (
                <div className="text-xs text-muted-foreground">Logo will appear in center</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
