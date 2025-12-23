import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import DataTable from '@/components/admin/DataTable';
import ImageUpload from '@/components/admin/ImageUpload';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Material } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const materialSchema = z.object({
  nameEn: z.string().min(1, 'English name is required'),
  nameEs: z.string().optional(),
  nameFr: z.string().optional(),
  nameFa: z.string().optional(),
  nameTr: z.string().optional(),
  backgroundColor: z.string().min(1, 'Background color is required'),
  image: z.string().optional(),
});

type MaterialFormData = z.infer<typeof materialSchema>;

export default function MaterialsPage() {
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [deleteMaterial, setDeleteMaterial] = useState<Material | null>(null);

  const form = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: { nameEn: '', nameEs: '', nameFr: '', nameFa: '', nameTr: '', backgroundColor: '#FF6B6B', image: '' },
  });

  const { data: materials = [], isLoading } = useQuery<Material[]>({
    queryKey: ['/api/materials'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: MaterialFormData) => {
      return apiRequest('POST', '/api/materials', {
        name: { en: data.nameEn, es: data.nameEs || '', fr: data.nameFr || '', fa: data.nameFa || '', tr: data.nameTr || '' },
        backgroundColor: data.backgroundColor,
        image: data.image,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
      setFormOpen(false);
      form.reset();
      toast({ title: 'Material Added' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to add material', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: MaterialFormData) => {
      if (!editingMaterial) throw new Error('No material selected');
      return apiRequest('PATCH', `/api/materials/${editingMaterial.id}`, {
        name: { en: data.nameEn, es: data.nameEs || '', fr: data.nameFr || '', fa: data.nameFa || '', tr: data.nameTr || '' },
        backgroundColor: data.backgroundColor,
        image: data.image,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
      setEditingMaterial(null);
      form.reset();
      toast({ title: 'Material Updated' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to update material', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/materials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/materials'] });
      setDeleteMaterial(null);
      toast({ title: 'Material Deleted' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to delete material', variant: 'destructive' });
    },
  });

  const openCreate = () => {
    form.reset({ nameEn: '', nameEs: '', nameFr: '', nameFa: '', nameTr: '', backgroundColor: '#FF6B6B', image: '' });
    setFormOpen(true);
  };

  const openEdit = (material: Material) => {
    form.reset({
      nameEn: material.name.en || '',
      nameEs: material.name.es || '',
      nameFr: material.name.fr || '',
      nameFa: material.name.fa || '',
      nameTr: material.name.tr || '',
      backgroundColor: material.backgroundColor,
      image: material.image || '',
    });
    setEditingMaterial(material);
  };

  const handleCreate = (data: MaterialFormData) => {
    createMutation.mutate(data);
  };

  const handleEdit = (data: MaterialFormData) => {
    updateMutation.mutate(data);
  };

  const handleDelete = () => {
    if (!deleteMaterial) return;
    deleteMutation.mutate(deleteMaterial.id);
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
            render: (item) => (
              item.image ? (
                <img src={item.image} alt={item.name.en} className="w-8 h-8 rounded-md object-cover" />
              ) : (
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: item.backgroundColor }}
                >
                  {item.name.en?.charAt(0).toUpperCase()}
                </div>
              )
            ),
          },
          { key: 'name', header: 'Name (English)', render: (item) => item.name.en },
          { key: 'backgroundColor', header: 'Color', render: (item) => (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.backgroundColor }} />
              <span className="text-xs text-muted-foreground">{item.backgroundColor}</span>
            </div>
          )},
        ]}
        onEdit={openEdit}
        onDelete={(item) => setDeleteMaterial(item)}
        testIdPrefix="material"
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto" data-testid="modal-material-form">
          <DialogHeader>
            <DialogTitle>Add Material</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
              <FormField control={form.control} name="nameEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (English)</FormLabel>
                  <FormControl><Input {...field} data-testid="input-material-name-en" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {activeLanguages.filter(l => l.code !== 'en').map((lang) => (
                <FormField key={lang.code} control={form.control} name={`name${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}` as keyof MaterialFormData} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name ({lang.name})</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} data-testid={`input-material-name-${lang.code}`} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              ))}
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
                  <FormDescription>Used when no image is set</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
                <Button type="submit" data-testid="button-save-material">Create</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingMaterial} onOpenChange={() => setEditingMaterial(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto" data-testid="modal-material-edit">
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
              <FormField control={form.control} name="nameEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (English)</FormLabel>
                  <FormControl><Input {...field} data-testid="input-material-name-en-edit" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {activeLanguages.filter(l => l.code !== 'en').map((lang) => (
                <FormField key={lang.code} control={form.control} name={`name${lang.code.charAt(0).toUpperCase() + lang.code.slice(1)}` as keyof MaterialFormData} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name ({lang.name})</FormLabel>
                    <FormControl><Input {...field} value={field.value || ''} data-testid={`input-material-name-${lang.code}-edit`} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              ))}
              <FormField control={form.control} name="image" render={({ field }) => (
                <FormItem>
                  <FormLabel>Image (Optional)</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Upload image or enter URL"
                      testId="input-material-image-edit"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="backgroundColor" render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Color</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input type="color" {...field} className="w-14 h-9 p-1" data-testid="input-material-color-edit" />
                      <Input {...field} placeholder="#FF6B6B" className="flex-1" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditingMaterial(null)}>Cancel</Button>
                <Button type="submit" data-testid="button-update-material">Update</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteMaterial} onOpenChange={() => setDeleteMaterial(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Material</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteMaterial?.name.en}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete-material">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
