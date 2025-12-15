import { useState } from 'react';
import MenuItemForm from '../admin/MenuItemForm';
import { Button } from '@/components/ui/button';
import { mockCategories } from '@/lib/mockData';

export default function MenuItemFormExample() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Add Menu Item</Button>
      <MenuItemForm
        categories={mockCategories}
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(data) => console.log('Menu item submitted:', data)}
      />
    </div>
  );
}
