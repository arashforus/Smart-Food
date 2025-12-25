import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Globe, Info } from 'lucide-react';
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
  FormDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import DataTable from '@/components/admin/DataTable';
import ImageUpload from '@/components/admin/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Material, Language } from '@/lib/types';

const materialSchema = z.object({
  generalName: z.string().min(1, 'General name is required'),
  backgroundColor: z.string().min(1, 'Background color is required'),
  image: z.string().optional(),
  translations: z.record(z.string()).optional(),
});

type MaterialFormData = z.infer<typeof materialSchema>;

export default function MaterialsPage() {
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [deleteMaterial, setDeleteMaterial] = useState<Material | null>(null);
  const [activeTab, setActiveTab] = useState('info');

  const { data: languages = [] } = useQuery<Language[]>({
    queryKey: ['/api/languages'],
  });

  const form = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: { 
      generalName: '', 
      backgroundColor: '#FF6B6B', 
      image: '',
      translations: {},
    },
  });

  const { data: materials = [], isLoading } = useQuery<Material[]>({
    queryKey: ['/api/materials'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: MaterialFormData) => {
      const name: Record<string, string> = { ...data.translations };
      
      return apiRequest('POST', '/api/materials', {
        generalName: data.generalName,
        name,
        color: data.backgroundColor,
        icon: data.image,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
      setFormOpen(false);
      form.reset();
      toast({ title: 'Material Added' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: MaterialFormData) => {
      if (!editingMaterial) throw new Error('No material selected');
      
      const name: Record<string, string> = { ...data.translations };

      return apiRequest('PATCH', `/api/materials/${editingMaterial.id}`, {
        generalName: data.generalName,
        name,
        color: data.backgroundColor,
        icon: data.image,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
      setEditingMaterial(null);
      form.reset();
      toast({ title: 'Material Updated' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest('DELETE', `/api/materials/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
      setDeleteMaterial(null);
      toast({ title: 'Material Deleted' });
    },
  });

  const openCreate = () => {
    form.reset({ generalName: '', backgroundColor: '#FF6B6B', image: '', translations: {} });
    setActiveTab('info');
    setFormOpen(true);
  };

  const openEdit = (material: any) => {
    form.reset({
      generalName: material.generalName || '',
      backgroundColor: material.color || '#FF6B6B',
      image: material.icon || '',
      translations: material.name || {},
    });
    setActiveTab('info');
    setEditingMaterial(material);
  };

  const onSubmit = (data: MaterialFormData) => {
    if (editingMaterial) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Materials / Ingredients</h1>
          <p className="text-muted-foreground">Manage ingredients used in your dishes</p>
        </div>
        <Button onClick={openCreate} data-testid="button-add-material">
          <Plus className="h-4 w-4 mr-2" />
          Add Material
        </Button>
      </div>

      <DataTable
        data={materials}
        columns={[
          {
            key: 'preview',
            header: 'Preview',
            render: (item: any) => (
              item.icon ? (
                <img src={item.icon} alt={item.generalName} className="w-8 h-8 rounded-md object-cover" />
              ) : (
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: item.color || '#ccc' }}
                >
                  {item.generalName?.charAt(0).toUpperCase()}
                </div>
              )
            ),
          },
          { key: 'generalName', header: 'Name', render: (item: any) => item.generalName },
          { 
            key: 'translations', 
            header: 'Translations', 
            render: (item: any) => {
              const count = Object.values(item.name || {}).filter(v => v && String(v).trim() !== '').length;
              return (
                <div className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium">{count}</span>
                </div>
              );
            }
          },
          { key: 'color', header: 'Color', render: (item: any) => (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color || 'transparent' }} />
              <span className="text-xs text-muted-foreground">{item.color}</span>
            </div>
          )},
        ]}
        onEdit={openEdit}
        onDelete={(item: any) => setDeleteMaterial(item)}
        testIdPrefix="material"
      />

      <Dialog open={formOpen || !!editingMaterial} onOpenChange={(open) => {
        if (!open) {
          setFormOpen(false);
          setEditingMaterial(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" data-testid="modal-material-form">
          <DialogHeader>
            <DialogTitle>{editingMaterial ? 'Edit Material' : 'Add Material'}</DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Info
              </TabsTrigger>
              <TabsTrigger value="translation" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Translation
              </TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-y-auto py-4 space-y-4 px-1">
                <TabsContent value="info" className="space-y-4 m-0">
                  <FormField control={form.control} name="generalName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. Tomato" data-testid="input-material-general-name" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField control={form.control} name="image" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image (Optional)</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Upload image or enter URL"
                          testId="input-material-image"
                        />
                      </FormControl>
                      <FormDescription>If no image, the color will be used as background</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="backgroundColor" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input type="color" {...field} className="w-14 h-9 p-1" data-testid="input-material-color" />
                          <Input {...field} placeholder="#FF6B6B" className="flex-1" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </TabsContent>

                <TabsContent value="translation" className="space-y-4 m-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {languages.map((lang) => (
                      <FormField 
                        key={lang.code} 
                        control={form.control} 
                        name={`translations.${lang.code}`} 
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{lang.name} Translation</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                value={field.value || ''} 
                                placeholder={`Name in ${lang.name}`}
                                data-testid={`input-material-translation-${lang.code}`} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />
                    ))}
                    {languages.length === 0 && (
                      <div className="col-span-2 py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                        No languages defined in database.
                      </div>
                    )}
                  </div>
                </TabsContent>

                <div className="pt-4 flex justify-end gap-2 sticky bottom-0 bg-background pb-2">
                  <Button type="button" variant="ghost" onClick={() => {
                    setFormOpen(false);
                    setEditingMaterial(null);
                  }}>Cancel</Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-material">
                    {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {editingMaterial ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </Form>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteMaterial} onOpenChange={() => setDeleteMaterial(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Material</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this material? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteMaterial && deleteMutation.mutate(deleteMaterial.id)}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground"
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
