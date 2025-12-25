import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { MenuItem, Category } from '@/lib/types';

const menuItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameEs: z.string().min(1, 'Spanish name is required'),
  nameFr: z.string().min(1, 'French name is required'),
  description: z.string().min(1, 'Description is required'),
  descriptionEs: z.string().min(1, 'Spanish description is required'),
  descriptionFr: z.string().min(1, 'French description is required'),
  price: z.preprocess((val) => (val === '' || val === null || val === undefined ? 0 : Number(val)), z.number().min(0.01, 'Price must be greater than 0')),
  discountedPrice: z.preprocess((val) => (val === '' || val === null || val === undefined ? undefined : Number(val)), z.number().min(0).optional()),
  maxSelect: z.preprocess((val) => (val === '' || val === null || val === undefined ? undefined : Number(val)), z.number().int().min(1).optional()),
  categoryId: z.string().min(1, 'Category is required'),
  available: z.boolean(),
  image: z.string().optional(),
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

interface MenuItemFormProps {
  item?: MenuItem | null;
  categories: Category[];
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MenuItemFormData) => void;
}

export default function MenuItemForm({ item, categories, open, onClose, onSubmit }: MenuItemFormProps) {
  // Use category image as default if item doesn't have one
  const getCategoryImage = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.image;
  };

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: (item?.name as any)?.en ?? '',
      nameEs: (item?.name as any)?.es ?? '',
      nameFr: (item?.name as any)?.fr ?? '',
      description: (item?.shortDescription as any)?.en ?? '',
      descriptionEs: (item?.shortDescription as any)?.es ?? '',
      descriptionFr: (item?.shortDescription as any)?.fr ?? '',
      price: Number(item?.price) || 0,
      discountedPrice: item?.discountedPrice ? Number(item?.discountedPrice) : undefined,
      maxSelect: item?.maxSelect ? Number(item?.maxSelect) : 1,
      categoryId: item?.categoryId ?? '',
      available: item?.available ?? true,
      image: item?.image ?? '',
    },
  });

  const handleSubmit = (data: MenuItemFormData) => {
    // Convert numeric fields to appropriate types
    const formattedData = {
      ...data,
      price: Number(data.price),
      discountedPrice: data.discountedPrice !== undefined ? Number(data.discountedPrice) : undefined,
      maxSelect: data.maxSelect !== undefined ? Math.round(Number(data.maxSelect)) : undefined,
    };
    onSubmit(formattedData as any);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-testid="modal-menu-item-form">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (English)</FormLabel>
                    <FormControl>
                      <Input {...field} value={typeof field.value === 'string' ? field.value : ''} data-testid="input-item-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameEs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Spanish)</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-item-name-es" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="nameFr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (French)</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-item-name-fr" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (English)</FormLabel>
                  <FormControl>
                    <Textarea {...field} data-testid="input-item-description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descriptionEs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Spanish)</FormLabel>
                  <FormControl>
                    <Textarea {...field} data-testid="input-item-description-es" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descriptionFr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (French)</FormLabel>
                  <FormControl>
                    <Textarea {...field} data-testid="input-item-description-fr" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : e.target.value;
                          field.onChange(val);
                        }}
                        data-testid="input-item-price"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discountedPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discounted Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : e.target.value;
                          field.onChange(val);
                        }}
                        data-testid="input-item-discounted-price"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxSelect"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Selection</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : e.target.value;
                          field.onChange(val);
                        }}
                        data-testid="input-item-max-select"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => {
                  const categoryImage = getCategoryImage(field.value);
                  return (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-item-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              <div className="flex items-center gap-2">
                                {cat.image ? (
                                  <img src={cat.image} alt="" className="w-4 h-4 rounded-sm object-cover" />
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image w-3 h-3 text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                                )}
                                {(cat.name as any)?.en ?? cat.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => {
                const categoryImage = getCategoryImage(form.watch('categoryId'));
                return (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <div className="flex flex-col gap-2">
                      <div className="w-full aspect-video rounded-md bg-muted flex items-center justify-center overflow-hidden border">
                        {field.value ? (
                          <img src={field.value} alt="Preview" className="w-full h-full object-cover" />
                        ) : categoryImage ? (
                          <img src={categoryImage} alt="Category Default" className="w-full h-full object-cover opacity-50" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-image w-8 h-8 text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                        )}
                      </div>
                      <FormControl>
                        <Input {...field} value={typeof field.value === 'string' ? field.value : ''} placeholder="Image URL" data-testid="input-item-image" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="available"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="mt-0">Available</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="switch-item-available"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" data-testid="button-save-item">
                {item ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
