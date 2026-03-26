import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
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
import LucideIconPicker from '@/components/admin/LucideIconPicker';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { apiRequest } from '@/lib/queryClient';
import type { FoodType } from '@/lib/types';
import { useState } from 'react';
import { useLanguage } from '@/hooks/use-language';

interface DbLanguage {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

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

function DynamicIcon({ name, className }: { name?: string | null; className?: string }) {
  if (!name) return null;
  const Icon = (LucideIcons as any)[name];
  if (!Icon) return <span className="text-xs opacity-50">{name}</span>;
  return <Icon className={className} />;
}

export default function TypesPage() {
  const { t } = useLanguage();
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

  const getTranslationCount = (nameObj: any) => {
    if (!nameObj || typeof nameObj !== 'object') return 0;
    return Object.values(nameObj).filter(val => typeof val === 'string' && (val as string).trim() !== '').length;
  };

  const { data: languages = [] } = useQuery({
    queryKey: ['/api/languages'],
    queryFn: async () => {
      const response = await fetch('/api/languages');
      if (!response.ok) throw new Error('Failed to fetch languages');
      return response.json() as Promise<DbLanguage[]>;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: TypeFormData) => {
      const nameObj: Record<string, string> = {};
      languages.forEach((lang) => {
        nameObj[lang.code] = data.names[lang.code] || '';
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
      toast({ title: t('food_type_added') });
    },
    onError: () => {
      toast({ title: t('error'), description: t('failed_create_type'), variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: TypeFormData) => {
      if (!editingType) throw new Error('No type selected');
      const nameObj: Record<string, string> = {};
      languages.forEach((lang) => {
        nameObj[lang.code] = data.names[lang.code] || '';
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
      toast({ title: t('food_type_updated') });
    },
    onError: () => {
      toast({ title: t('error'), description: t('failed_update_type'), variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/food-types/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/food-types'] });
      setDeleteType(null);
      toast({ title: t('food_type_deleted') });
    },
    onError: () => {
      toast({ title: t('error'), description: t('failed_delete_type'), variant: 'destructive' });
    },
  });

  const form = useForm<TypeFormData>({
    resolver: zodResolver(typeSchema),
    defaultValues: {
      generalName: '',
      icon: 'Leaf',
      color: '#4CAF50',
      names: {},
    },
  });

  const openCreate = () => {
    setEditingType(null);
    const defaultNames: Record<string, string> = {};
    languages.forEach((lang) => {
      defaultNames[lang.code] = '';
    });
    form.reset({
      generalName: '',
      icon: 'Leaf',
      color: '#4CAF50',
      names: defaultNames,
    });
    setFormOpen(true);
  };

  const openEdit = (foodType: DbFoodType) => {
    setFormOpen(false);
    const names: Record<string, string> = {};
    languages.forEach((lang) => {
      names[lang.code] = foodType.name[lang.code] || '';
    });
    form.reset({
      generalName: foodType.generalName || '',
      icon: foodType.icon || 'Leaf',
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

  const displayTypes: FoodType[] = dbFoodTypes.map((t) => ({
    id: t.id,
    generalName: t.generalName,
    name: t.name,
    icon: t.icon || 'Leaf',
    color: t.color,
  }));

  const IconFormField = ({ name, testId }: { name: string; testId: string }) => (
    <FormField
      control={form.control}
      name="icon"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('icon')}</FormLabel>
          <FormControl>
            <LucideIconPicker
              value={field.value}
              onChange={field.onChange}
              data-testid={testId}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const TypeForm = ({ onSubmit, isEdit }: { onSubmit: (data: TypeFormData) => void; isEdit: boolean }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 gap-4">
        <Tabs defaultValue="info" className="flex flex-col flex-1 min-h-0 w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">{t('info')}</TabsTrigger>
            <TabsTrigger value="translation">{t('translation')}</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="flex-1 min-h-0 overflow-y-auto space-y-4 pt-4 pr-1">
            <FormField
              control={form.control}
              name="generalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Vegan"
                      data-testid={isEdit ? 'input-type-general-name-edit' : 'input-type-general-name'}
                    />
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
                  <FormLabel>{t('icon')}</FormLabel>
                  <FormControl>
                    <LucideIconPicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('color')}</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        {...field}
                        className="w-14 h-9 p-0 border-rounded-xl"
                        data-testid={isEdit ? 'input-type-color-edit' : 'input-type-color'}
                      />
                      <Input {...field} placeholder="#4CAF50" className="flex-1" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="translation" className="flex-1 min-h-0 overflow-y-auto space-y-4 pt-4 pr-1">
            {languages.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('no_languages_defined')}</p>
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
                        <Input
                          {...field}
                          value={field.value || ''}
                          placeholder={`${t('name')} in ${lang.name}`}
                          data-testid={`input-type-name-${lang.code}${isEdit ? '-edit' : ''}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-2 flex-shrink-0 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              if (isEdit) {
                setEditingType(null);
              } else {
                setFormOpen(false);
              }
              form.reset();
            }}
          >
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            data-testid={isEdit ? 'button-update-type' : 'button-save-type'}
            disabled={isEdit ? updateMutation.isPending : createMutation.isPending}
          >
            {isEdit
              ? (updateMutation.isPending ? t('updating') : t('update'))
              : (createMutation.isPending ? t('creating') : t('create'))}
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">{t('food_types_tags')}</h1>
          <p className="text-muted-foreground">{t('food_types_desc')}</p>
        </div>
        <Button onClick={openCreate} disabled={isLoading} data-testid="button-add-type">
          <Plus className="h-4 w-4 mr-2" />
          {t('add_type')}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">{t('loading_food_types')}</div>
      ) : (
        <DataTable
          data={displayTypes}
          columns={[
            {
              key: 'preview',
              header: t('preview'),
              render: (item: any) => (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white overflow-hidden"
                  style={{ backgroundColor: item.color }}
                >
                  <div className="scale-75">
                    <DynamicIcon name={item.icon} className="h-4 w-4" />
                  </div>
                </div>
              ),
            },
            {
              key: 'generalName',
              header: t('name'),
              render: (item: any) => item.generalName || item.name?.en || 'N/A',
            },
            {
              key: 'translations',
              header: t('translations'),
              render: (item: any) => {
                const dbType = dbFoodTypes.find((t) => t.id === item.id);
                const count = getTranslationCount(dbType?.name);
                return (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary">
                      <span className="text-[10px] font-bold">🌐</span>
                    </div>
                    <span className="text-xs font-medium">{count}</span>
                  </div>
                );
              },
            },
            {
              key: 'icon',
              header: t('icon'),
              render: (item: any) => (
                <div className="flex items-center gap-1.5">
                  <DynamicIcon name={item.icon} className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{item.icon}</span>
                </div>
              ),
            },
            {
              key: 'color',
              header: t('color'),
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

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) {
            setFormOpen(false);
            form.reset();
          }
        }}
      >
        <DialogContent className="h-[90vh] flex flex-col overflow-hidden" data-testid="modal-type-form">
          <DialogHeader>
            <DialogTitle>{t('add_type')}</DialogTitle>
          </DialogHeader>
          <TypeForm onSubmit={handleCreate} isEdit={false} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingType}
        onOpenChange={(open) => {
          if (!open) {
            setEditingType(null);
            form.reset();
          }
        }}
      >
        <DialogContent className="h-[90vh] flex flex-col overflow-hidden" data-testid="modal-type-edit">
          <DialogHeader>
            <DialogTitle>{t('edit_type')}</DialogTitle>
          </DialogHeader>
          <TypeForm onSubmit={handleEdit} isEdit={true} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteType} onOpenChange={() => setDeleteType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_type')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirm_delete_type').replace('{name}', deleteType?.generalName || '')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              data-testid="button-confirm-delete-type"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? t('deleting') : t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
