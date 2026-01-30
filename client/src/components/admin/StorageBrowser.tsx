import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderOpen, Image as ImageIcon, Loader2, FileIcon } from 'lucide-react';

interface StorageFile {
  key: string;
  size: number;
  lastModified: string;
  objectPath: string;
}

interface StorageBrowserProps {
  onSelect: (path: string) => void;
  trigger?: React.ReactNode;
}

export default function StorageBrowser({ onSelect, trigger }: StorageBrowserProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<{ files: StorageFile[] }>({
    queryKey: ['/api/uploads/list'],
    enabled: open,
  });

  const files = data?.files || [];
  const imageFiles = files.filter(file => {
    const ext = file.key.toLowerCase();
    return ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png') || 
           ext.endsWith('.gif') || ext.endsWith('.webp') || ext.endsWith('.svg') || ext.endsWith('.ico');
  });

  const handleSelect = () => {
    if (selectedFile) {
      onSelect(selectedFile);
      setOpen(false);
      setSelectedFile(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" variant="outline" size="icon" data-testid="button-browse-storage">
            <FolderOpen className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Browse Storage</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            Failed to load files from storage
          </div>
        ) : imageFiles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No images found in storage
          </div>
        ) : (
          <>
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-3 gap-3">
                {imageFiles.map((file) => (
                  <div
                    key={file.key}
                    className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all hover-elevate ${
                      selectedFile === file.objectPath
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-transparent'
                    }`}
                    onClick={() => setSelectedFile(file.objectPath)}
                    data-testid={`storage-file-${file.key}`}
                  >
                    <div className="aspect-square bg-muted flex items-center justify-center">
                      <img
                        src={file.objectPath}
                        alt={file.key}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLElement).parentElement;
                          if (parent) {
                            const icon = document.createElement('div');
                            icon.className = 'flex items-center justify-center w-full h-full';
                            icon.innerHTML = '<svg class="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';
                            parent.appendChild(icon);
                          }
                        }}
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-1 text-xs truncate">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setOpen(false)} data-testid="button-storage-cancel">
                Cancel
              </Button>
              <Button onClick={handleSelect} disabled={!selectedFile} data-testid="button-storage-select">
                Select
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
