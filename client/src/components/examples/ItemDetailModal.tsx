import { useState } from 'react';
import ItemDetailModal from '../menu/ItemDetailModal';
import { Button } from '@/components/ui/button';
import { mockMenuItems } from '@/lib/mockData';

export default function ItemDetailModalExample() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Item Modal</Button>
      <ItemDetailModal
        item={mockMenuItems[2]}
        open={open}
        onClose={() => setOpen(false)}
        language="en"
      />
    </div>
  );
}
