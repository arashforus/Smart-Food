import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import MenuItemForm from '@/components/admin/MenuItemForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
// todo: remove mock functionality
import { mockMenuItems, mockCategories } from '@/lib/mockData';
import type { MenuItem } from '@/lib/types';

export default function ItemsPage() {
  const { toast } = useToast();
  // todo: remove mock functionality - replace with API calls
  const [items, setItems] = useState<MenuItem[]>(mockMenuItems);
  const categories = mockCategories;
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null);

  const handleCreate = (data: Omit<MenuItem, 'id' | 'image'>) => {
    // todo: replace with API call
    const newItem: MenuItem = {
      id: String(Date.now()),
      ...data,
    };
    setItems([...items, newItem]);
    toast({ title: 'Menu Item Created' });
  };

  const handleEdit = (data: Omit<MenuItem, 'id' | 'image'>) => {
    if (!editingItem) return;
    // todo: replace with API call
    setItems(items.map((i) => (i.id === editingItem.id ? { ...i, ...data } : i)));
    setEditingItem(null);
    toast({ title: 'Menu Item Updated' });
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    // todo: replace with API call
    setItems(items.filter((i) => i.id !== deleteItem.id));
    setDeleteItem(null);
    toast({ title: 'Menu Item Deleted' });
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Menu Items</h1>
          <p className="text-muted-foreground">Manage your menu offerings</p>
        </div>
        <Button onClick={() => setFormOpen(true)} data-testid="button-add-item">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <DataTable
        data={items}
        columns={[
          { key: 'name', header: 'Name' },
          {
            key: 'categoryId',
            header: 'Category',
            render: (item) => getCategoryName(item.categoryId),
          },
          {
            key: 'price',
            header: 'Price',
            render: (item) => `$${item.price.toFixed(2)}`,
          },
          {
            key: 'available',
            header: 'Status',
            render: (item) => (
              <Badge variant={item.available ? 'default' : 'secondary'} className="no-default-active-elevate">
                {item.available ? 'Available' : 'Unavailable'}
              </Badge>
            ),
          },
        ]}
        onEdit={(item) => setEditingItem(item)}
        onDelete={(item) => setDeleteItem(item)}
        testIdPrefix="item"
      />

      <MenuItemForm
        categories={categories}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
      />

      <MenuItemForm
        item={editingItem}
        categories={categories}
        open={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSubmit={handleEdit}
      />

      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteItem?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete-item">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
