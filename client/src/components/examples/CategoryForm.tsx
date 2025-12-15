import { useState } from 'react';
import CategoryForm from '../admin/CategoryForm';
import { Button } from '@/components/ui/button';

export default function CategoryFormExample() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Add Category</Button>
      <CategoryForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(data) => console.log('Category submitted:', data)}
      />
    </div>
  );
}
