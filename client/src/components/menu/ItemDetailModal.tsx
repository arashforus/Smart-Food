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
    if (language === 'es') return item.nameEs;
    if (language === 'fr') return item.nameFr;
    return item.name;
  };

  const getDescription = () => {
    if (language === 'es') return item.descriptionEs;
    if (language === 'fr') return item.descriptionFr;
    return item.description;
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm" data-testid="modal-item-detail">
        <DialogHeader>
          <DialogTitle data-testid="text-modal-item-name">{getName()}</DialogTitle>
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
          <p className="text-muted-foreground">{getDescription()}</p>
          <p className="text-xl font-semibold text-primary" data-testid="text-modal-item-price">
            ${item.price.toFixed(2)}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
