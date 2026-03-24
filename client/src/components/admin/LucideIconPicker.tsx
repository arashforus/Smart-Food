import { useState, useMemo, useCallback } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, X, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const EXCLUDED = new Set([
  'createLucideIcon',
  'LucideIcon',
  'default',
  'icons',
]);

const ALL_ICON_NAMES: string[] = Object.keys(LucideIcons).filter((key) => {
  if (EXCLUDED.has(key)) return false;
  if (key[0] !== key[0].toUpperCase()) return false;
  if (typeof (LucideIcons as any)[key] !== 'function') return false;
  return true;
});

interface LucideIconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  className?: string;
}

function IconComponent({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as any)[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}

export default function LucideIconPicker({ value, onChange, className }: LucideIconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredIcons = useMemo(() => {
    if (!search.trim()) return ALL_ICON_NAMES;
    const q = search.toLowerCase().replace(/[-_\s]/g, '');
    return ALL_ICON_NAMES.filter((name) =>
      name.toLowerCase().replace(/[-_\s]/g, '').includes(q)
    );
  }, [search]);

  const handleSelect = useCallback(
    (iconName: string) => {
      onChange(iconName);
      setOpen(false);
      setSearch('');
    },
    [onChange]
  );

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setSearch('');
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn('flex items-center gap-2 w-full justify-between', className)}
        data-testid="button-icon-picker"
      >
        <div className="flex items-center gap-2">
          {value ? (
            <>
              <IconComponent name={value} className="h-4 w-4 shrink-0" />
              <span className="text-sm">{value}</span>
            </>
          ) : (
            <span className="text-muted-foreground text-sm">Select icon...</span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl h-[75vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-4 pt-4 pb-0 shrink-0">
            <DialogTitle>Select Icon</DialogTitle>
          </DialogHeader>

          <div className="px-4 py-3 border-b shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                autoFocus
                placeholder="Search icons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-9"
                data-testid="input-icon-search"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''}
              {search ? ` matching "${search}"` : ' available'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {filteredIcons.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground gap-2">
                <Search className="h-8 w-8 opacity-30" />
                <p className="text-sm">No icons found for "{search}"</p>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(68px,1fr))] gap-1">
                {filteredIcons.map((name) => (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => handleSelect(name)}
                    className={cn(
                      'flex flex-col items-center justify-center gap-1 rounded-md p-2 text-center transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer',
                      value === name && 'bg-primary/10 text-primary ring-1 ring-primary'
                    )}
                    data-testid={`icon-option-${name}`}
                  >
                    <IconComponent name={name} className="h-5 w-5 shrink-0" />
                    <span className="text-[9px] leading-tight break-all text-muted-foreground line-clamp-2 max-w-full">
                      {name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
