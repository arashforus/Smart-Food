import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import CategoryForm from '@/components/admin/CategoryForm';
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
import { mockCategories } from '@/lib/mockData';
import type { Category } from '@/lib/types';

export default function CategoriesPage() {
  const { toast } = useToast();
  // todo: remove mock functionality - replace with API calls
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  const handleCreate = (data: Omit<Category, 'id'>) => {
    // todo: replace with API call
    const newCategory: Category = {
      id: String(Date.now()),
      ...data,
    };
    setCategories([...categories, newCategory]);
    toast({ title: 'Category Created' });
  };

  const handleEdit = (data: Omit<Category, 'id'>) => {
    if (!editingCategory) return;
    // todo: replace with API call
    setCategories(categories.map((c) => (c.id === editingCategory.id ? { ...c, ...data } : c)));
    setEditingCategory(null);
    toast({ title: 'Category Updated' });
  };

  const handleDelete = () => {
    if (!deleteCategory) return;
    // todo: replace with API call
    setCategories(categories.filter((c) => c.id !== deleteCategory.id));
    setDeleteCategory(null);
    toast({ title: 'Category Deleted' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-muted-foreground">Organize your menu items</p>
        </div>
        <Button onClick={() => setFormOpen(true)} data-testid="button-add-category">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <DataTable
        data={categories.sort((a, b) => a.order - b.order)}
        columns={[
          { key: 'name', header: 'Name (English)' },
          { key: 'nameEs', header: 'Spanish' },
          { key: 'nameFr', header: 'French' },
          { key: 'order', header: 'Order' },
        ]}
        onEdit={(item) => setEditingCategory(item)}
        onDelete={(item) => setDeleteCategory(item)}
        testIdPrefix="category"
      />

      <CategoryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
      />

      <CategoryForm
        category={editingCategory}
        open={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        onSubmit={handleEdit}
      />

      <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteCategory?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
