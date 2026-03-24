import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

const branchSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone is required'),
  owner: z.string().optional(),
  ownerPhone: z.string().optional(),
  isActive: z.boolean(),
});

type BranchFormData = z.infer<typeof branchSchema>;

interface StorageBranch {
  id: string;
  name: string;
  address: string;
  phone: string;
  owner?: string;
  ownerPhone?: string;
  isActive: boolean;
}

import { useLanguage } from '@/hooks/use-language';

export default function BranchesPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<StorageBranch | null>(null);
  const [deleteBranch, setDeleteBranch] = useState<StorageBranch | null>(null);

  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: { name: '', address: '', phone: '', isActive: true },
  });

  const { data: branches = [], isLoading } = useQuery<StorageBranch[]>({
    queryKey: ['/api/branches'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: BranchFormData) => {
      return apiRequest('POST', '/api/branches', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/branches'] });
      setFormOpen(false);
      form.reset();
      toast({ title: t('branch_created') });
    },
    onError: (error: any) => {
      toast({ title: t('error'), description: error.message || t('failed_create_branch'), variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: BranchFormData) => {
      if (!editingBranch) throw new Error('No branch selected');
      return apiRequest('PATCH', `/api/branches/${editingBranch.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/branches'] });
      setEditingBranch(null);
      form.reset();
      toast({ title: t('branch_updated') });
    },
    onError: (error: any) => {
      toast({ title: t('error'), description: error.message || t('failed_update_branch'), variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/branches/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/branches'] });
      setDeleteBranch(null);
      toast({ title: t('branch_deleted') });
    },
    onError: (error: any) => {
      toast({ title: t('error'), description: error.message || t('failed_delete_branch'), variant: 'destructive' });
    },
  });

  const openCreate = () => {
    form.reset({ name: '', address: '', phone: '', owner: '', ownerPhone: '', isActive: true });
    setFormOpen(true);
  };

  const openEdit = (branch: StorageBranch) => {
    form.reset({ name: branch.name, address: branch.address, phone: branch.phone, owner: branch.owner || '', ownerPhone: branch.ownerPhone || '', isActive: branch.isActive });
    setEditingBranch(branch);
  };

  const handleCreate = (data: BranchFormData) => {
    createMutation.mutate(data);
  };

  const handleEdit = (data: BranchFormData) => {
    updateMutation.mutate(data);
  };

  const handleDelete = () => {
    if (!deleteBranch) return;
    deleteMutation.mutate(deleteBranch.id);
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
          <h1 className="text-2xl font-semibold">{t('branches')}</h1>
          <p className="text-muted-foreground">{t('branches_desc')}</p>
        </div>
        <Button onClick={openCreate} data-testid="button-add-branch" disabled={createMutation.isPending}>
          <Plus className="h-4 w-4 mr-2" />
          {t('add_branch')}
        </Button>
      </div>

      <DataTable
        data={branches}
        columns={[
          { key: 'name', header: t('name') },
          { key: 'address', header: t('address') },
          { key: 'phone', header: t('phone') },
          { key: 'owner', header: t('owner') },
          { key: 'ownerPhone', header: t('owner_phone') },
          {
            key: 'isActive',
            header: t('status'),
            render: (item) => (
              <Badge variant={item.isActive ? 'default' : 'secondary'} className="no-default-active-elevate">
                {item.isActive ? t('active') : t('inactive')}
              </Badge>
            ),
          },
        ]}
        onEdit={openEdit}
        onDelete={(item) => setDeleteBranch(item)}
        testIdPrefix="branch"
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent data-testid="modal-branch-form">
          <DialogHeader>
            <DialogTitle>{t('add_branch')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('branch_name')}</FormLabel>
                  <FormControl><Input {...field} data-testid="input-branch-name" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('address')}</FormLabel>
                  <FormControl><Input {...field} data-testid="input-branch-address" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phone')}</FormLabel>
                  <FormControl><Input {...field} data-testid="input-branch-phone" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="owner" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('owner')}</FormLabel>
                  <FormControl><Input {...field} placeholder={t('owner_placeholder')} data-testid="input-branch-owner" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="ownerPhone" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('owner_phone')}</FormLabel>
                  <FormControl><Input {...field} placeholder={t('owner_phone_placeholder')} data-testid="input-branch-owner-phone" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="mt-0">{t('active')}</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-branch-active" />
                  </FormControl>
                </FormItem>
              )} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>{t('cancel')}</Button>
                <Button type="submit" data-testid="button-save-branch" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {t('create')}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingBranch} onOpenChange={() => setEditingBranch(null)}>
        <DialogContent data-testid="modal-branch-edit">
          <DialogHeader>
            <DialogTitle>{t('edit_branch')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('branch_name')}</FormLabel>
                  <FormControl><Input {...field} data-testid="input-branch-name-edit" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('address')}</FormLabel>
                  <FormControl><Input {...field} data-testid="input-branch-address-edit" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phone')}</FormLabel>
                  <FormControl><Input {...field} data-testid="input-branch-phone-edit" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="owner" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('owner')}</FormLabel>
                  <FormControl><Input {...field} placeholder={t('owner_placeholder')} data-testid="input-branch-owner-edit" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="ownerPhone" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('owner_phone')}</FormLabel>
                  <FormControl><Input {...field} placeholder={t('owner_phone_placeholder')} data-testid="input-branch-owner-phone-edit" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="mt-0">{t('active')}</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-branch-active-edit" />
                  </FormControl>
                </FormItem>
              )} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditingBranch(null)}>{t('cancel')}</Button>
                <Button type="submit" data-testid="button-update-branch" disabled={updateMutation.isPending}>
                  {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {t('update')}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteBranch} onOpenChange={() => setDeleteBranch(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_branch')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirm_delete_branch').replace('{name}', deleteBranch?.name || '')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete-branch" disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
