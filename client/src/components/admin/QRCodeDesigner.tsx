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
  centerType: 'none' | 'logo' | 'text';
  centerText: string;
  backgroundColor: string;
  foregroundColor: string;
  cornerDots: string;
  cornerSquares: string;
  createdAt: Date;
}

interface QRCodeDesignerProps {
  initialLogo?: string;
  initialCenterType?: 'none' | 'logo' | 'text';
  initialCenterText?: string;
  onLogoChange?: (url: string) => void;
  onCenterTypeChange?: (type: 'none' | 'logo' | 'text') => void;
  onCenterTextChange?: (text: string) => void;
}

export default function QRCodeDesigner({ 
  initialLogo, 
  initialCenterType = 'logo',
  initialCenterText = '',
  onLogoChange,
  onCenterTypeChange,
  onCenterTextChange
}: QRCodeDesignerProps) {
  const { toast } = useToast();
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
    logoUrl: initialLogo || '',
    centerType: initialCenterType,
    centerText: initialCenterText,
    backgroundColor: '#FFFFFF',
    foregroundColor: '#000000',
    cornerDots: 'square',
    cornerSquares: 'square',
  });

  useEffect(() => {
    setCurrentDesign(prev => ({ 
      ...prev, 
      logoUrl: initialLogo !== undefined ? initialLogo : prev.logoUrl,
      centerType: initialCenterType !== undefined ? initialCenterType : (prev.centerType as any),
      centerText: initialCenterText !== undefined ? initialCenterText : prev.centerText
    }));
  }, [initialLogo, initialCenterType, initialCenterText]);

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
          data: currentDesign.qrText || 'https://arashsohrabi.com',
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
          image: currentDesign.centerType === 'logo' ? (currentDesign.logoUrl || undefined) : undefined,
          imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 0,
            crossOrigin: 'anonymous',
          },
          margin: 10,
        });

        // Add center text if selected
        if (currentDesign.centerType === 'text' && currentDesign.centerText) {
          // Note: qr-code-styling doesn't natively support "text" in center as an image.
          // We can use a Canvas to generate a text image and use that as the 'image'
          const canvas = document.createElement('canvas');
          canvas.width = 100;
          canvas.height = 100;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = currentDesign.foregroundColor || '#000000';
            ctx.font = 'bold 40px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(currentDesign.centerText, 50, 50);
            qrCode.update({
              image: canvas.toDataURL(),
              imageOptions: {
                hideBackgroundDots: true,
                imageSize: 0.3,
                margin: 0
              }
            });
          }
        }

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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const data = await response.json();
          setCurrentDesign({ ...currentDesign, logoUrl: data.url });
          onLogoChange?.(data.url);
          toast({ title: 'Success', description: 'Logo uploaded successfully' });
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        console.error('Error uploading logo:', error);
        toast({ title: 'Error', description: 'Failed to upload logo', variant: 'destructive' });
      }
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
      centerType: currentDesign.centerType as 'none' | 'logo' | 'text',
      centerText: currentDesign.centerText || '',
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
                <label className="text-sm font-medium">QR Test URL</label>
                <Input
                  value={currentDesign.qrText || ''}
                  onChange={handleQRTextChange}
                  placeholder="https://arashsohrabi.com"
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

              <div className="space-y-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium">Center Type</label>
                  <Select
                    value={currentDesign.centerType || 'logo'}
                    onValueChange={(value) => {
                      const type = value as 'none' | 'logo' | 'text';
                      setCurrentDesign({ ...currentDesign, centerType: type });
                      onCenterTypeChange?.(type);
                    }}
                  >
                    <SelectTrigger data-testid="select-qr-center-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="logo">Logo</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {currentDesign.centerType === 'text' && (
                  <div>
                    <label className="text-sm font-medium">Center Text</label>
                    <Input
                      value={currentDesign.centerText || ''}
                      onChange={(e) => {
                        const text = e.target.value;
                        setCurrentDesign({ ...currentDesign, centerText: text });
                        onCenterTextChange?.(text);
                      }}
                      placeholder="Enter center text"
                      data-testid="input-qr-center-text"
                      className="mt-1"
                    />
                  </div>
                )}

                {currentDesign.centerType === 'logo' && (
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
              {currentDesign.centerType === 'logo' && currentDesign.logoUrl && (
                <div className="text-xs text-muted-foreground">Logo will appear in center</div>
              )}
              {currentDesign.centerType === 'text' && currentDesign.centerText && (
                <div className="text-xs text-muted-foreground">Text will appear in center</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
