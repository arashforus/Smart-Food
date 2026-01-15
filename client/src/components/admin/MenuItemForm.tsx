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
import { Star } from 'lucide-react';
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
  generalName: z.string().min(1, 'General name is required'),
  nameEn: z.string().min(1, 'English name is required'),
  nameFa: z.string().min(1, 'Persian name is required'),
  nameTr: z.string().min(1, 'Turkish name is required'),
  nameAr: z.string().min(1, 'Arabic name is required'),
  descriptionEn: z.string().min(1, 'English description is required'),
  descriptionFa: z.string().min(1, 'Persian description is required'),
  descriptionTr: z.string().min(1, 'Turkish description is required'),
  descriptionAr: z.string().min(1, 'Arabic description is required'),
  price: z.preprocess((val) => (val === '' || val === null || val === undefined ? 0 : Number(val)), z.number().min(0.01, 'Price must be greater than 0')),
  discountedPrice: z.preprocess((val) => (val === '' || val === null || val === undefined ? undefined : Number(val)), z.number().min(0).optional()),
  maxSelect: z.preprocess((val) => (val === '' || val === null || val === undefined ? undefined : Number(val)), z.number().int().min(1).optional()),
  categoryId: z.string().min(1, 'Category is required'),
  available: z.boolean(),
  suggested: z.boolean(),
  isNew: z.boolean(),
  image: z.string().optional(),
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

interface MenuItemFormProps {
  item?: MenuItem | null;
  categories: Category[];
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function MenuItemForm({ item, categories, open, onClose, onSubmit }: MenuItemFormProps) {
  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      generalName: (item as any)?.generalName ?? '',
      nameEn: (item?.name as any)?.en ?? '',
      nameFa: (item?.name as any)?.fa ?? '',
      nameTr: (item?.name as any)?.tr ?? '',
      nameAr: (item?.name as any)?.ar ?? '',
      descriptionEn: (item?.shortDescription as any)?.en ?? '',
      descriptionFa: (item?.shortDescription as any)?.fa ?? '',
      descriptionTr: (item?.shortDescription as any)?.tr ?? '',
      descriptionAr: (item?.shortDescription as any)?.ar ?? '',
      price: Number(item?.price) || 0,
      discountedPrice: item?.discountedPrice ? Number(item?.discountedPrice) : undefined,
      maxSelect: item?.maxSelect ? Number(item?.maxSelect) : 1,
      categoryId: item?.categoryId ?? '',
      available: item?.available ?? true,
      suggested: item?.suggested ?? false,
      isNew: (item as any)?.isNew ?? false,
      image: item?.image ?? '',
    },
  });

  const isEdit = !!item;
  const getCategoryImage = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.image;
  };

  const handleSubmit = (data: MenuItemFormData) => {
    const formattedData = {
      generalName: data.generalName,
      name: {
        en: data.nameEn,
        fa: data.nameFa,
        tr: data.nameTr,
        ar: data.nameAr,
      },
      shortDescription: {
        en: data.descriptionEn,
        fa: data.descriptionFa,
        tr: data.descriptionTr,
        ar: data.descriptionAr,
      },
      longDescription: {
        en: data.descriptionEn,
        fa: data.descriptionFa,
        tr: data.descriptionTr,
        ar: data.descriptionAr,
      },
      price: Number(data.price),
      discountedPrice: data.discountedPrice !== undefined ? Number(data.discountedPrice) : undefined,
      maxSelect: data.maxSelect !== undefined ? Math.round(Number(data.maxSelect)) : undefined,
      categoryId: data.categoryId,
      image: data.image,
      available: data.available,
      suggested: data.suggested,
      isNew: data.isNew,
      materials: item?.materials || [],
    };
    
    const submissionData = {
      ...formattedData,
      name: { en: data.nameEn, fa: data.nameFa, tr: data.nameTr, ar: data.nameAr },
      shortDescription: { en: data.descriptionEn, fa: data.descriptionFa, tr: data.descriptionTr, ar: data.descriptionAr },
      longDescription: { en: data.descriptionEn, fa: data.descriptionFa, tr: data.descriptionTr, ar: data.descriptionAr }
    };

    onSubmit(submissionData);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-menu-item-form">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="generalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>General Name (Internal)</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-item-general-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md bg-muted/30">
              <h3 className="col-span-full font-medium">Names</h3>
              <FormField
                control={form.control}
                name="nameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-item-name-en" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameFa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Persian</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-right" dir="rtl" data-testid="input-item-name-fa" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameTr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turkish</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-item-name-tr" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arabic</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-right" dir="rtl" data-testid="input-item-name-ar" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md bg-muted/30">
              <h3 className="col-span-full font-medium">Descriptions</h3>
              <FormField
                control={form.control}
                name="descriptionEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English</FormLabel>
                    <FormControl>
                      <Textarea {...field} data-testid="input-item-description-en" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="descriptionFa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Persian</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="text-right" dir="rtl" data-testid="input-item-description-fa" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="descriptionTr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turkish</FormLabel>
                    <FormControl>
                      <Textarea {...field} data-testid="input-item-description-tr" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="descriptionAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arabic</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="text-right" dir="rtl" data-testid="input-item-description-ar" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <FormField
              control={form.control}
              name="suggested"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="mt-0">Suggested</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="switch-item-suggested"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isNew"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="mt-0">New Status</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="switch-item-isnew"
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
