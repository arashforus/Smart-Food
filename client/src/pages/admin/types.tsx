import { useQuery, useMutation } from '@tanstack/react-query';
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
import { queryClient } from '@/lib/queryClient';
import { apiRequest } from '@/lib/queryClient';
import type { FoodType } from '@/lib/types';
import { useState } from 'react';

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
  descEn: z.string().optional(),
  descEs: z.string().optional(),
  descFr: z.string().optional(),
  descFa: z.string().optional(),
  descTr: z.string().optional(),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().min(1, 'Color is required'),
});

type TypeFormData = z.infer<typeof typeSchema>;

interface DbFoodType {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  color: string;
  is_active: boolean;
  order: number;
}

export default function TypesPage() {
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingType, setEditingType] = useState<DbFoodType | null>(null);
  const [deleteType, setDeleteType] = useState<DbFoodType | null>(null);

  const { data: dbFoodTypes = [], isLoading } = useQuery({
    queryKey: ['/api/food-types'],
    queryFn: async () => {
      const response = await fetch('/api/food-types');
      if (!response.ok) throw new Error('Failed to fetch food types');
      return response.json() as Promise<DbFoodType[]>;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: TypeFormData) =>
      apiRequest('POST', '/api/food-types', {
        name: {
          en: data.nameEn,
          es: data.nameEs || '',
          fr: data.nameFr || '',
          fa: data.nameFa || '',
          tr: data.nameTr || '',
        },
        description: {
          en: data.descEn || '',
          es: data.descEs || '',
          fr: data.descFr || '',
          fa: data.descFa || '',
          tr: data.descTr || '',
        },
        icon: data.icon,
        color: data.color,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/food-types'] });
      setFormOpen(false);
      form.reset();
      toast({ title: 'Food Type Added' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create food type', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: TypeFormData) => {
      if (!editingType) throw new Error('No type selected');
      return apiRequest('PATCH', `/api/food-types/${editingType.id}`, {
        name: {
          en: data.nameEn,
          es: data.nameEs || '',
          fr: data.nameFr || '',
          fa: data.nameFa || '',
          tr: data.nameTr || '',
        },
        description: {
          en: data.descEn || '',
          es: data.descEs || '',
          fr: data.descFr || '',
          fa: data.descFa || '',
          tr: data.descTr || '',
        },
        icon: data.icon,
        color: data.color,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/food-types'] });
      setEditingType(null);
      form.reset();
      toast({ title: 'Food Type Updated' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update food type', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/food-types/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/food-types'] });
      setDeleteType(null);
      toast({ title: 'Food Type Deleted' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete food type', variant: 'destructive' });
    },
  });

  const form = useForm<TypeFormData>({
    resolver: zodResolver(typeSchema),
    defaultValues: {
      nameEn: '',
      nameEs: '',
      nameFr: '',
      nameFa: '',
      nameTr: '',
      descEn: '',
      descEs: '',
      descFr: '',
      descFa: '',
      descTr: '',
      icon: 'leaf',
      color: '#4CAF50',
    },
  });

  const getIconComponent = (iconName?: string | null) => {
    const iconOption = iconOptions.find((i) => i.value === iconName);
    return iconOption ? <iconOption.Icon className="h-4 w-4" /> : null;
  };

  const parseName = (nameStr: string) => {
    if (!nameStr) return { en: '' };
    if (typeof nameStr === 'string') {
      try {
        return JSON.parse(nameStr);
      } catch {
        return { en: nameStr };
      }
    }
    return nameStr;
  };

  const parseDescription = (descStr: string) => {
    if (!descStr) return { en: '' };
    if (typeof descStr === 'string') {
      try {
        return JSON.parse(descStr);
      } catch {
        return { en: descStr };
      }
    }
    return descStr;
  };

  const openCreate = () => {
    form.reset({
      nameEn: '',
      nameEs: '',
      nameFr: '',
      nameFa: '',
      nameTr: '',
      descEn: '',
      descEs: '',
      descFr: '',
      descFa: '',
      descTr: '',
      icon: 'leaf',
      color: '#4CAF50',
    });
    setFormOpen(true);
  };

  const openEdit = (foodType: DbFoodType) => {
    const name = parseName(foodType.name);
    const description = parseDescription(foodType.description);
    form.reset({
      nameEn: name.en || '',
      nameEs: name.es || '',
      nameFr: name.fr || '',
      nameFa: name.fa || '',
      nameTr: name.tr || '',
      descEn: description.en || '',
      descEs: description.es || '',
      descFr: description.fr || '',
      descFa: description.fa || '',
      descTr: description.tr || '',
      icon: foodType.icon || 'leaf',
      color: foodType.color,
    });
    setEditingType(foodType);
  };

  const handleCreate = (data: TypeFormData) => {
    createMutation.mutate(data);
  };

  const handleEdit = (data: TypeFormData) => {
    updateMutation.mutate(data);
  };

  const handleDelete = () => {
    if (deleteType) {
      deleteMutation.mutate(deleteType.id);
    }
  };

  // Convert DB types to FoodType for display
  const displayTypes: FoodType[] = dbFoodTypes.map((t) => {
    const name = parseName(t.name);
    return {
      id: t.id,
      name,
      icon: t.icon || 'leaf',
      color: t.color,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Food Types / Tags</h1>
          <p className="text-muted-foreground">Define dietary tags like vegan, spicy, healthy</p>
        </div>
        <Button onClick={openCreate} disabled={isLoading} data-testid="button-add-type">
          <Plus className="h-4 w-4 mr-2" />
          Add Type
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading food types...</div>
      ) : (
        <DataTable
          data={displayTypes}
          columns={[
            {
              key: 'preview',
              header: 'Preview',
              render: (item) => (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {getIconComponent(item.icon)}
                </div>
              ),
            },
            { key: 'name', header: 'Name (English)', render: (item) => item.name.en },
            {
              key: 'icon',
              header: 'Icon',
              render: (item) => iconOptions.find((i) => i.value === item.icon)?.label || item.icon,
            },
            {
              key: 'color',
              header: 'Color',
              render: (item) => (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.color}</span>
                </div>
              ),
            },
          ]}
          onEdit={(item) => {
            const dbType = dbFoodTypes.find((t) => t.id === item.id);
            if (dbType) openEdit(dbType);
          }}
          onDelete={(item) => {
            const dbType = dbFoodTypes.find((t) => t.id === item.id);
            if (dbType) setDeleteType(dbType);
          }}
          testIdPrefix="type"
        />
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto" data-testid="modal-type-form">
          <DialogHeader>
            <DialogTitle>Add Food Type</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
              <FormField
                control={form.control}
                name="nameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (English)</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-type-name-en" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
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
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          {...field}
                          className="w-14 h-9 p-1"
                          data-testid="input-type-color"
                        />
                        <Input {...field} placeholder="#4CAF50" className="flex-1" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-save-type" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create'}
                </Button>
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
              <FormField
                control={form.control}
                name="nameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (English)</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-type-name-en-edit" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
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
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          {...field}
                          className="w-14 h-9 p-1"
                          data-testid="input-type-color-edit"
                        />
                        <Input {...field} placeholder="#4CAF50" className="flex-1" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditingType(null)}>
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-update-type" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Updating...' : 'Update'}
                </Button>
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
              Are you sure you want to delete "{deleteType && parseName(deleteType.name).en}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-testid="button-confirm-delete-type"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
