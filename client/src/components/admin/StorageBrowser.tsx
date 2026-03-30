import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderOpen, Image as ImageIcon, Film, FileIcon, Loader2, Check, RefreshCw } from 'lucide-react';

interface StorageFile {
  key: string;
  size: number;
  lastModified: string;
  objectPath: string;
  contentType?: string;
}

interface StorageBrowserProps {
  onSelect: (path: string) => void;
  trigger?: React.ReactNode;
}

function getFormatLabel(contentType: string | undefined): string {
  if (!contentType) return 'FILE';
  const map: Record<string, string> = {
    'image/jpeg': 'JPEG',
    'image/jpg': 'JPEG',
    'image/png': 'PNG',
    'image/webp': 'WebP',
    'image/gif': 'GIF',
    'image/svg+xml': 'SVG',
    'image/ico': 'ICO',
    'image/x-icon': 'ICO',
    'image/bmp': 'BMP',
    'video/mp4': 'MP4',
    'video/webm': 'WebM',
    'video/ogg': 'OGG',
    'video/quicktime': 'MOV',
    'video/x-msvideo': 'AVI',
    'video/x-matroska': 'MKV',
  };
  return map[contentType] || contentType.split('/')[1]?.toUpperCase() || 'FILE';
}

function isVideo(contentType: string | undefined): boolean {
  return !!contentType?.startsWith('video/');
}

function isImage(contentType: string | undefined): boolean {
  return !!contentType?.startsWith('image/');
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getShortName(key: string): string {
  const parts = key.split('/');
  const filename = parts[parts.length - 1] || key;
  if (filename.length > 16) {
    return filename.slice(0, 8) + '…' + filename.slice(-4);
  }
  return filename;
}

type FilterTab = 'all' | 'images' | 'videos';

export default function StorageBrowser({ onSelect, trigger }: StorageBrowserProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const { data, isLoading, error, refetch, isFetching } = useQuery<{ files: StorageFile[] }>({
    queryKey: ['/api/uploads/list'],
    enabled: open,
  });

  const allFiles = data?.files || [];
  const imageFiles = allFiles.filter(f => isImage(f.contentType));
  const videoFiles = allFiles.filter(f => isVideo(f.contentType));

  const displayedFiles =
    activeTab === 'images' ? imageFiles :
    activeTab === 'videos' ? videoFiles :
    allFiles;

  const handleSelect = () => {
    if (selectedFile) {
      onSelect(selectedFile);
      setOpen(false);
      setSelectedFile(null);
    }
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) {
      setSelectedFile(null);
      setActiveTab('all');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button type="button" variant="outline" size="icon" data-testid="button-browse-storage">
            <FolderOpen className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-full p-0 gap-0 overflow-hidden" style={{ maxHeight: '85vh' }}>
        <DialogHeader className="px-6 pt-5 pb-4 border-b">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            Browse Storage
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-sm">Loading files…</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-destructive">
            <FileIcon className="h-8 w-8" />
            <span className="text-sm font-medium">Failed to load files from storage</span>
          </div>
        ) : (
          <>
            <div className="px-6 pt-4 pb-3 flex items-center gap-2 border-b bg-muted/30 justify-between">
              <div className="flex items-center gap-2">
                {(
                  [
                    { key: 'all', label: 'All Files', count: allFiles.length },
                    { key: 'images', label: 'Images', count: imageFiles.length, icon: ImageIcon },
                    { key: 'videos', label: 'Videos', count: videoFiles.length, icon: Film },
                  ] as { key: FilterTab; label: string; count: number; icon?: React.FC<any> }[]
                ).map(({ key, label, count, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    data-testid={`tab-storage-${key}`}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === key
                        ? 'bg-background shadow-sm text-foreground border'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                    }`}
                  >
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    {label}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === key ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                data-testid="button-storage-refresh"
                className="gap-1.5 shrink-0"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {displayedFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                {activeTab === 'videos' ? (
                  <Film className="h-10 w-10 opacity-30" />
                ) : (
                  <ImageIcon className="h-10 w-10 opacity-30" />
                )}
                <p className="text-sm">
                  {activeTab === 'all' ? 'No files in storage' :
                   activeTab === 'images' ? 'No image files found' :
                   'No video files found'}
                </p>
              </div>
            ) : (
              <ScrollArea style={{ height: 'calc(85vh - 220px)' }}>
                <div className="grid grid-cols-4 gap-3 p-6">
                  {displayedFiles.map((file) => {
                    const selected = selectedFile === file.objectPath;
                    const fileIsVideo = isVideo(file.contentType);
                    const format = getFormatLabel(file.contentType);

                    return (
                      <div
                        key={file.key}
                        onClick={() => setSelectedFile(file.objectPath)}
                        data-testid={`storage-file-${file.key}`}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all group ${
                          selected
                            ? 'border-primary ring-2 ring-primary/20 shadow-md'
                            : 'border-border hover:border-primary/40 hover:shadow-sm'
                        }`}
                      >
                        <div className="aspect-square bg-muted/50 flex items-center justify-center relative overflow-hidden">
                          {fileIsVideo ? (
                            <video
                              src={file.objectPath}
                              preload="metadata"
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                              onLoadedMetadata={(e) => {
                                (e.target as HTMLVideoElement).currentTime = 0;
                              }}
                            />
                          ) : (
                            <img
                              src={file.objectPath}
                              alt={file.key}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const el = e.target as HTMLImageElement;
                                el.style.display = 'none';
                                const wrap = el.parentElement;
                                if (wrap && !wrap.querySelector('.fallback-icon')) {
                                  const fb = document.createElement('div');
                                  fb.className = 'fallback-icon flex items-center justify-center w-full h-full';
                                  fb.innerHTML = `<svg class="h-10 w-10 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>`;
                                  wrap.appendChild(fb);
                                }
                              }}
                            />
                          )}

                          {fileIsVideo && (
                            <div className="absolute top-2 left-2">
                              <div className="bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5 flex items-center gap-1">
                                <Film className="h-3 w-3 text-white" />
                                <span className="text-white text-[10px] font-medium">VIDEO</span>
                              </div>
                            </div>
                          )}

                          {selected && (
                            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                              <div className="bg-primary rounded-full p-1">
                                <Check className="h-4 w-4 text-primary-foreground" />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="px-2.5 py-2 bg-background border-t">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-xs font-medium text-foreground truncate flex-1">
                              {getShortName(file.key)}
                            </span>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0 h-4">
                              {format}
                            </Badge>
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}

            <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
              <span className="text-sm text-muted-foreground">
                {selectedFile ? '1 file selected' : `${displayedFiles.length} file${displayedFiles.length !== 1 ? 's' : ''}`}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleOpenChange(false)} data-testid="button-storage-cancel">
                  Cancel
                </Button>
                <Button onClick={handleSelect} disabled={!selectedFile} data-testid="button-storage-select">
                  Select File
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
