import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UtensilsCrossed } from 'lucide-react';
import type { MenuItem, Language } from '@/lib/types';

interface ItemDetailModalProps {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
  language: Language;
}

export default function ItemDetailModal({ item, open, onClose, language }: ItemDetailModalProps) {
  if (!item) return null;

  const getName = () => {
    return item.name[language] || item.name.en || Object.values(item.name)[0] || '';
  };

  const getDescription = () => {
    return item.description[language] || item.description.en || Object.values(item.description)[0] || '';
  };

  const isRtl = language === 'fa';

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm" data-testid="modal-item-detail" dir={isRtl ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className={isRtl ? 'text-right' : ''} data-testid="text-modal-item-name">
            {getName()}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="w-full aspect-square rounded-md bg-muted flex items-center justify-center overflow-hidden">
            {item.image ? (
              <img
                src={item.image}
                alt={getName()}
                className="w-full h-full object-cover"
              />
            ) : (
              <UtensilsCrossed className="h-16 w-16 text-muted-foreground" />
            )}
          </div>
          <p className={`text-muted-foreground ${isRtl ? 'text-right' : ''}`}>{getDescription()}</p>
          <p className={`text-xl font-semibold text-primary ${isRtl ? 'text-right' : ''}`} data-testid="text-modal-item-price">
            ${item.price.toFixed(2)}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
