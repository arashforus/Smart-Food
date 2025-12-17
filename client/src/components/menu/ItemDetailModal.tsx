import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed } from 'lucide-react';
import type { MenuItem, Language } from '@/lib/types';
import { mockMaterials, mockFoodTypes } from '@/lib/mockData';

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

  const getLongDescription = () => {
    return item.longDescription[language] || item.longDescription.en || Object.values(item.longDescription)[0] || '';
  };

  const getMaterials = () => {
    return item.materials.map(id => {
      const material = mockMaterials.find(m => m.id === id);
      return material ? (material.name[language] || material.name.en) : '';
    }).filter(Boolean);
  };

  const getTypes = () => {
    return item.types.map(id => {
      const type = mockFoodTypes.find(t => t.id === id);
      return type ? { name: type.name[language] || type.name.en, color: type.color } : null;
    }).filter(Boolean);
  };

  const isRtl = language === 'fa';

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md" data-testid="modal-item-detail" dir={isRtl ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className={isRtl ? 'text-right' : ''} data-testid="text-modal-item-name">
            {getName()}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="w-full aspect-video rounded-md bg-muted flex items-center justify-center overflow-hidden">
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
          
          <p className={`text-muted-foreground ${isRtl ? 'text-right' : ''}`}>{getLongDescription()}</p>
          
          {getTypes().length > 0 && (
            <div className={`flex flex-wrap gap-1 ${isRtl ? 'justify-end' : ''}`}>
              {getTypes().map((type, idx) => (
                <Badge 
                  key={idx} 
                  variant="secondary" 
                  className="text-xs"
                  style={{ backgroundColor: type?.color, color: 'white' }}
                >
                  {type?.name}
                </Badge>
              ))}
            </div>
          )}
          
          {getMaterials().length > 0 && (
            <div className={isRtl ? 'text-right' : ''}>
              <p className="text-sm text-muted-foreground">
                {getMaterials().join(', ')}
              </p>
            </div>
          )}
          
          <div className={`flex items-center gap-3 ${isRtl ? 'justify-end' : ''}`}>
            {item.discountedPrice ? (
              <>
                <span className="text-xl font-semibold text-primary" data-testid="text-modal-item-price">
                  ${item.discountedPrice.toFixed(2)}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  ${item.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-xl font-semibold text-primary" data-testid="text-modal-item-price">
                ${item.price.toFixed(2)}
              </span>
            )}
          </div>
          
          {item.maxSelect && (
            <p className={`text-xs text-muted-foreground ${isRtl ? 'text-right' : ''}`}>
              Max order: {item.maxSelect}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
