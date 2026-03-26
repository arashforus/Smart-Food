import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUpload } from '@/hooks/use-upload';
import StorageBrowser from './StorageBrowser';

const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i;

function isVideoUrl(url: string) {
  return VIDEO_EXTENSIONS.test(url);
}

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
  accept = 'image/*,.ico',
  placeholder = 'Upload an image or enter URL',
  testId = 'input-image-upload',
}: ImageUploadProps) {
  const { toast } = useToast();
  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response) => {
      onChange(response.objectPath);
      setUrlInput(response.objectPath);
      toast({ title: 'File uploaded successfully' });
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
        <StorageBrowser
          onSelect={(path) => {
            setUrlInput(path);
            onChange(path);
          }}
        />
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
        <div className="relative w-full h-40 rounded-md overflow-hidden bg-muted flex items-center justify-center">
          {isVideoUrl(value) ? (
            <video
              src={value}
              controls
              className="w-full h-full object-contain"
              data-testid={`${testId}-video-preview`}
            />
          ) : (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
              data-testid={`${testId}-image-preview`}
            />
          )}
          <div className="absolute top-2 left-2 bg-black/50 rounded px-1.5 py-0.5 flex items-center gap-1">
            {isVideoUrl(value)
              ? <Video className="h-3 w-3 text-white" />
              : <ImageIcon className="h-3 w-3 text-white" />}
            <span className="text-white text-[10px]">{isVideoUrl(value) ? 'Video' : 'Image'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
