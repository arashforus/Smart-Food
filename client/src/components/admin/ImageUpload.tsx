import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUpload } from '@/hooks/use-upload';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  placeholder?: string;
  testId?: string;
}

export default function ImageUpload({
  value,
  onChange,
  accept = 'image/*',
  placeholder = 'Upload an image or enter URL',
  testId = 'input-image-upload',
}: ImageUploadProps) {
  const { toast } = useToast();
  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response) => {
      onChange(response.objectPath);
      setUrlInput(response.objectPath);
      toast({ title: 'Image uploaded successfully' });
    },
    onError: (error) => {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const [urlInput, setUrlInput] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    onChange(url);
  };

  const handleClear = () => {
    setUrlInput('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="text"
          value={urlInput}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
          data-testid={testId}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          data-testid={`${testId}-file`}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          data-testid={`${testId}-button`}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
        </Button>
        {value && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClear}
            data-testid={`${testId}-clear`}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {value && (
        <div className="relative w-full h-32 rounded-md overflow-hidden bg-muted">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}
