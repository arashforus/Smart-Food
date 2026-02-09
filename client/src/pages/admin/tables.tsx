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
import { apiRequest, queryClient } from '@/lib/queryClient';

const tableSchema = z.object({
  branchId: z.string().min(1, 'Branch is required'),
  tableNumber: z.string().min(1, 'Table number is required'),
  capacity: z.number().min(1, 'At least 1 seat is required'),
  isActive: z.boolean(),
});

type TableFormData = z.infer<typeof tableSchema>;

interface StorageTable {
  id: string;
  tableNumber: string;
  branchId: string;
  capacity: number;
  location?: string;
  status: string;
  isActive: boolean;
}

interface StorageBranch {
  id: string;
  name: string;
  isActive: boolean;
}

import { useLanguage } from '@/hooks/use-language';

export default function TablesPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<StorageTable | null>(null);
  const [deleteTable, setDeleteTable] = useState<StorageTable | null>(null);

  const form = useForm<TableFormData>({
    resolver: zodResolver(tableSchema),
    defaultValues: { branchId: '', tableNumber: '', capacity: 4, isActive: true },
  });

  const { data: tables = [], isLoading: tablesLoading } = useQuery<StorageTable[]>({
    queryKey: ['/api/tables'],
  });

  const { data: branches = [], isLoading: branchesLoading } = useQuery<StorageBranch[]>({
    queryKey: ['/api/branches'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: TableFormData) => {
      return apiRequest('POST', '/api/tables', {
        branchId: data.branchId,
        tableNumber: data.tableNumber,
        capacity: data.capacity,
        isActive: data.isActive,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tables'] });
      setFormOpen(false);
      form.reset();
      toast({ title: t('table_created', 'Table Created') });
    },
    onError: (error: any) => {
      toast({ title: t('error', 'Error'), description: error.message || t('failed_create_table', 'Failed to create table'), variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: TableFormData) => {
      if (!editingTable) throw new Error('No table selected');
      return apiRequest('PATCH', `/api/tables/${editingTable.id}`, {
        branchId: data.branchId,
        tableNumber: data.tableNumber,
        capacity: data.capacity,
        isActive: data.isActive,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tables'] });
      setEditingTable(null);
      form.reset();
      toast({ title: t('table_updated', 'Table Updated') });
    },
    onError: (error: any) => {
      toast({ title: t('error', 'Error'), description: error.message || t('failed_update_table', 'Failed to update table'), variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/tables/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tables'] });
      setDeleteTable(null);
      toast({ title: t('table_deleted', 'Table Deleted') });
    },
    onError: (error: any) => {
      toast({ title: t('error', 'Error'), description: error.message || t('failed_delete_table', 'Failed to delete table'), variant: 'destructive' });
    },
  });

  const openCreate = () => {
    form.reset({ branchId: branches.find(b => b.isActive)?.id || '', tableNumber: '', capacity: 4, isActive: true });
    setFormOpen(true);
  };

  const openEdit = (table: StorageTable) => {
    form.reset({ 
      branchId: table.branchId, 
      tableNumber: table.tableNumber,
      capacity: Number(table.capacity), 
      isActive: table.isActive 
    });
    setEditingTable(table);
  };

  const handleCreate = (data: TableFormData) => {
    createMutation.mutate(data);
  };

  const handleEdit = (data: TableFormData) => {
    updateMutation.mutate(data);
  };

  const handleDelete = () => {
    if (!deleteTable) return;
    deleteMutation.mutate(deleteTable.id);
  };

  const getBranchName = (branchId: string) => branches.find((b) => b.id === branchId)?.name || t('unknown');

  if (tablesLoading || branchesLoading) {
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
          <h1 className="text-2xl font-semibold">{t('tables')}</h1>
          <p className="text-muted-foreground">{t('tables_desc')}</p>
        </div>
        <Button onClick={openCreate} data-testid="button-add-table" disabled={createMutation.isPending}>
          <Plus className="h-4 w-4 mr-2" />
          {t('add_table')}
        </Button>
      </div>

      <DataTable
        data={tables}
        columns={[
          { key: 'tableNumber', header: t('table_number', 'Table #') },
          { key: 'branchId', header: t('branch'), render: (item) => getBranchName(item.branchId) },
          { key: 'capacity', header: t('seats', 'Seats') },
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
        onDelete={(item) => setDeleteTable(item)}
        testIdPrefix="table"
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent data-testid="modal-table-form">
          <DialogHeader>
            <DialogTitle>{t('add_table')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
              <FormField control={form.control} name="branchId" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('branch')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-table-branch">
                        <SelectValue placeholder={t('select_branch')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches.filter(b => b.isActive).map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="tableNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('table_name', 'Table Number/Name')}</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g., T1 or Patio-3" data-testid="input-table-number" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="capacity" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('number_of_seats', 'Number of Seats')}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} data-testid="input-table-seats" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="mt-0">{t('active')}</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-table-active" />
                  </FormControl>
                </FormItem>
              )} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>{t('cancel')}</Button>
                <Button type="submit" data-testid="button-save-table" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {t('create')}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingTable} onOpenChange={() => setEditingTable(null)}>
        <DialogContent data-testid="modal-table-edit">
          <DialogHeader>
            <DialogTitle>{t('edit_table')}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
              <FormField control={form.control} name="branchId" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('branch')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-table-branch-edit">
                        <SelectValue placeholder={t('select_branch')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches.filter(b => b.isActive).map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="tableNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('table_name')}</FormLabel>
                  <FormControl><Input {...field} data-testid="input-table-number-edit" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="capacity" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('number_of_seats')}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} data-testid="input-table-seats-edit" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="mt-0">{t('active')}</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-table-active-edit" />
                  </FormControl>
                </FormItem>
              )} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditingTable(null)}>{t('cancel')}</Button>
                <Button type="submit" data-testid="button-update-table" disabled={updateMutation.isPending}>
                  {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {t('update')}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTable} onOpenChange={() => setDeleteTable(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_table')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirm_delete_table', `Are you sure you want to delete table "${deleteTable?.tableNumber}"?`)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete-table" disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
