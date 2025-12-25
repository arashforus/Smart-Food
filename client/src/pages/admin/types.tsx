import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Leaf, Salad, WheatOff, Flame, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface DbLanguage {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

const iconOptions = [
  { value: 'leaf', label: 'Leaf', Icon: Leaf },
  { value: 'salad', label: 'Salad', Icon: Salad },
  { value: 'wheat-off', label: 'Gluten Free', Icon: WheatOff },
  { value: 'flame', label: 'Flame', Icon: Flame },
  { value: 'heart', label: 'Heart', Icon: Heart },
];

const typeSchema = z.object({
  generalName: z.string().min(1, 'General name is required'),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().min(1, 'Color is required'),
  names: z.record(z.string().optional()),
});

type TypeFormData = z.infer<typeof typeSchema>;

interface DbFoodType {
  id: string;
  generalName: string;
  name: Record<string, string>;
  description: Record<string, string>;
  icon: string | null;
  color: string;
  isActive: boolean;
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

  const { data: languages = [] } = useQuery({
    queryKey: ['/api/languages'],
    queryFn: async () => {
      const response = await fetch('/api/languages');
      if (!response.ok) throw new Error('Failed to fetch languages');
      const data = await response.json();
      return (data as DbLanguage[]).filter((lang) => lang.isActive);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: TypeFormData) => {
      const nameObj: Record<string, string> = {};
      languages.forEach((lang) => {
        nameObj[lang.code] = data.names[lang.code] || (lang.code === 'en' ? data.generalName : '');
      });
      return apiRequest('POST', '/api/food-types', {
        generalName: data.generalName,
        name: nameObj,
        description: {},
        icon: data.icon,
        color: data.color,
      });
    },
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
      const nameObj: Record<string, string> = {};
      languages.forEach((lang) => {
        nameObj[lang.code] = data.names[lang.code] || (lang.code === 'en' ? data.generalName : '');
      });
      return apiRequest('PATCH', `/api/food-types/${editingType.id}`, {
        generalName: data.generalName,
        name: nameObj,
        description: {},
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
      generalName: '',
      icon: 'leaf',
      color: '#4CAF50',
      names: {},
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
    const defaultNames: Record<string, string> = {};
    languages.forEach((lang) => {
      defaultNames[lang.code] = '';
    });
    form.reset({
      generalName: '',
      icon: 'leaf',
      color: '#4CAF50',
      names: defaultNames,
    });
    setFormOpen(true);
  };

  const openEdit = (foodType: DbFoodType) => {
    const names: Record<string, string> = {};
    languages.forEach((lang) => {
      names[lang.code] = foodType.name[lang.code] || '';
    });
    form.reset({
      generalName: foodType.generalName || '',
      icon: foodType.icon || 'leaf',
      color: foodType.color,
      names,
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
    return {
      id: t.id,
      generalName: t.generalName,
      name: t.name,
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
                render: (item: any) => (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    {getIconComponent(item.icon)}
                  </div>
                ),
              },
              { 
                key: 'generalName', 
                header: 'Name', 
                render: (item: any) => item.generalName || item.name?.en || 'N/A' 
              },
              {
                key: 'icon',
                header: 'Icon',
                render: (item: any) => iconOptions.find((i) => i.value === item.icon)?.label || item.icon,
              },
              {
                key: 'color',
                header: 'Color',
                render: (item: any) => (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.color}</span>
                  </div>
                ),
              },
            ]}
            onEdit={(item: any) => {
              const dbType = dbFoodTypes.find((t) => t.id === item.id);
              if (dbType) openEdit(dbType);
            }}
            onDelete={(item: any) => {
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
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="translation">Translation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="generalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Vegan" data-testid="input-type-general-name" />
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
                </TabsContent>

                <TabsContent value="translation" className="space-y-4 pt-4">
                  {languages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No active languages defined</p>
                  ) : (
                    languages.map((lang) => (
                      <FormField
                        key={lang.code}
                        control={form.control}
                        name={`names.${lang.code}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{lang.name}</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ''} placeholder={`Name in ${lang.name}`} data-testid={`input-type-name-${lang.code}`} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 mt-6">
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
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="translation">Translation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="generalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Vegan" data-testid="input-type-general-name-edit" />
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
                </TabsContent>

                <TabsContent value="translation" className="space-y-4 pt-4">
                  {languages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No active languages defined</p>
                  ) : (
                    languages.map((lang) => (
                      <FormField
                        key={lang.code}
                        control={form.control}
                        name={`names.${lang.code}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{lang.name}</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ''} placeholder={`Name in ${lang.name}`} data-testid={`input-type-name-${lang.code}-edit`} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 mt-6">
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
