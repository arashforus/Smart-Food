import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Leaf, Salad, WheatOff, Flame, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DataTable from '@/components/admin/DataTable';
import { useToast } from '@/hooks/use-toast';
import { mockFoodTypes, mockLanguages } from '@/lib/mockData';
import type { FoodType } from '@/lib/types';

const iconOptions = [
  { value: 'leaf', label: 'Leaf', Icon: Leaf },
  { value: 'salad', label: 'Salad', Icon: Salad },
  { value: 'wheat-off', label: 'Gluten Free', Icon: WheatOff },
  { value: 'flame', label: 'Flame', Icon: Flame },
  { value: 'heart', label: 'Heart', Icon: Heart },
];

const typeSchema = z.object({
  nameEn: z.string().min(1, 'English name is required'),
  nameEs: z.string().optional(),
  nameFr: z.string().optional(),
  nameFa: z.string().optional(),
  nameTr: z.string().optional(),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().min(1, 'Color is required'),
});

type TypeFormData = z.infer<typeof typeSchema>;

export default function TypesPage() {
  const { toast } = useToast();
  const [types, setTypes] = useState<FoodType[]>(mockFoodTypes);
  const [formOpen, setFormOpen] = useState(false);
  const [editingType, setEditingType] = useState<FoodType | null>(null);
  const [deleteType, setDeleteType] = useState<FoodType | null>(null);
  const activeLanguages = mockLanguages.filter((l) => l.isActive);

  const form = useForm<TypeFormData>({
    resolver: zodResolver(typeSchema),
    defaultValues: { nameEn: '', nameEs: '', nameFr: '', nameFa: '', nameTr: '', icon: 'leaf', color: '#4CAF50' },
  });

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((i) => i.value === iconName);
    return iconOption ? <iconOption.Icon className="h-4 w-4" /> : null;
  };

  const openCreate = () => {
    form.reset({ nameEn: '', nameEs: '', nameFr: '', nameFa: '', nameTr: '', icon: 'leaf', color: '#4CAF50' });
    setFormOpen(true);
  };

  const openEdit = (type: FoodType) => {
    form.reset({
      nameEn: type.name.en || '',
      nameEs: type.name.es || '',
      nameFr: type.name.fr || '',
      nameFa: type.name.fa || '',
      nameTr: type.name.tr || '',
      icon: type.icon || 'leaf',
      color: type.color,
    });
    setEditingType(type);
  };

  const handleCreate = (data: TypeFormData) => {
    const newType: FoodType = {
      id: String(Date.now()),
      name: { en: data.nameEn, es: data.nameEs || '', fr: data.nameFr || '', fa: data.nameFa || '', tr: data.nameTr || '' },
      icon: data.icon,
      color: data.color,
    };
    setTypes([...types, newType]);
    setFormOpen(false);
    form.reset();
    toast({ title: 'Food Type Added' });
  };

  const handleEdit = (data: TypeFormData) => {
    if (!editingType) return;
    setTypes(types.map((t) => {
      if (t.id === editingType.id) {
        return {
          ...t,
          name: { en: data.nameEn, es: data.nameEs || '', fr: data.nameFr || '', fa: data.nameFa || '', tr: data.nameTr || '' },
          icon: data.icon,
          color: data.color,
        };
      }
      return t;
    }));
    setEditingType(null);
    form.reset();
    toast({ title: 'Food Type Updated' });
  };

  const handleDelete = () => {
    if (!deleteType) return;
    setTypes(types.filter((t) => t.id !== deleteType.id));
    setDeleteType(null);
    toast({ title: 'Food Type Deleted' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Food Types / Tags</h1>
          <p className="text-muted-foreground">Define dietary tags like vegan, spicy, healthy</p>
        </div>
        <Button onClick={openCreate} data-testid="button-add-type">
          <Plus className="h-4 w-4 mr-2" />
          Add Type
        </Button>
      </div>

      <DataTable
        data={types}
        columns={[
          {
            key: 'preview',
            header: 'Preview',
            render: (item) => (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: item.color }}
              >
                {getIconComponent(item.icon || 'leaf')}
              </div>
            ),
          },
          { key: 'name', header: 'Name (English)', render: (item) => item.name.en },
          { key: 'icon', header: 'Icon', render: (item) => iconOptions.find(i => i.value === item.icon)?.label || item.icon },
          { key: 'color', header: 'Color', render: (item) => (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-muted-foreground">{item.color}</span>
            </div>
          )},
        ]}
        onEdit={openEdit}
        onDelete={(item) => setDeleteType(item)}
        testIdPrefix="type"
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto" data-testid="modal-type-form">
          <DialogHeader>
            <DialogTitle>Add Food Type</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
              <FormField control={form.control} name="nameEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (English)</FormLabel>
                  <FormControl><Input {...field} data-testid="input-type-name-en" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {activeLanguages.filter(l => l.code !== 'en').map((lang) => (
                <FormField key={lang.code} control={form.control} name={`name${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}` as keyof TypeFormData} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name ({lang.name})</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} data-testid={`input-type-name-${lang.code}`} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              ))}
              <FormField control={form.control} name="icon" render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-type-icon">
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          <div className="flex items-center gap-2">
                            <icon.Icon className="h-4 w-4" />
                            {icon.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="color" render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input type="color" {...field} className="w-14 h-9 p-1" data-testid="input-type-color" />
                      <Input {...field} placeholder="#4CAF50" className="flex-1" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
                <Button type="submit" data-testid="button-save-type">Create</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingType} onOpenChange={() => setEditingType(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto" data-testid="modal-type-edit">
          <DialogHeader>
            <DialogTitle>Edit Food Type</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
              <FormField control={form.control} name="nameEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (English)</FormLabel>
                  <FormControl><Input {...field} data-testid="input-type-name-en-edit" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {activeLanguages.filter(l => l.code !== 'en').map((lang) => (
                <FormField key={lang.code} control={form.control} name={`name${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}` as keyof TypeFormData} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name ({lang.name})</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} data-testid={`input-type-name-${lang.code}-edit`} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              ))}
              <FormField control={form.control} name="icon" render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-type-icon-edit">
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          <div className="flex items-center gap-2">
                            <icon.Icon className="h-4 w-4" />
                            {icon.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="color" render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input type="color" {...field} className="w-14 h-9 p-1" data-testid="input-type-color-edit" />
                      <Input {...field} placeholder="#4CAF50" className="flex-1" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditingType(null)}>Cancel</Button>
                <Button type="submit" data-testid="button-update-type">Update</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteType} onOpenChange={() => setDeleteType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Food Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteType?.name.en}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete-type">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
