import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
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
import { mockTables, mockBranches } from '@/lib/mockData';
import type { RestaurantTable } from '@/lib/types';

const tableSchema = z.object({
  branchId: z.string().min(1, 'Branch is required'),
  number: z.string().min(1, 'Table number is required'),
  seats: z.number().min(1, 'At least 1 seat is required'),
  isActive: z.boolean(),
});

type TableFormData = z.infer<typeof tableSchema>;

export default function TablesPage() {
  const { toast } = useToast();
  const [tables, setTables] = useState<RestaurantTable[]>(mockTables);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);
  const [deleteTable, setDeleteTable] = useState<RestaurantTable | null>(null);
  const branches = mockBranches;

  const form = useForm<TableFormData>({
    resolver: zodResolver(tableSchema),
    defaultValues: { branchId: '', number: '', seats: 4, isActive: true },
  });

  const openCreate = () => {
    form.reset({ branchId: branches[0]?.id || '', number: '', seats: 4, isActive: true });
    setFormOpen(true);
  };

  const openEdit = (table: RestaurantTable) => {
    form.reset({ branchId: table.branchId, number: table.number, seats: table.seats, isActive: table.isActive });
    setEditingTable(table);
  };

  const handleCreate = (data: TableFormData) => {
    const newTable: RestaurantTable = { id: String(Date.now()), ...data };
    setTables([...tables, newTable]);
    setFormOpen(false);
    form.reset();
    toast({ title: 'Table Created' });
  };

  const handleEdit = (data: TableFormData) => {
    if (!editingTable) return;
    setTables(tables.map((t) => (t.id === editingTable.id ? { ...t, ...data } : t)));
    setEditingTable(null);
    form.reset();
    toast({ title: 'Table Updated' });
  };

  const handleDelete = () => {
    if (!deleteTable) return;
    setTables(tables.filter((t) => t.id !== deleteTable.id));
    setDeleteTable(null);
    toast({ title: 'Table Deleted' });
  };

  const getBranchName = (branchId: string) => branches.find((b) => b.id === branchId)?.name || 'Unknown';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Tables</h1>
          <p className="text-muted-foreground">Manage restaurant tables for QR codes</p>
        </div>
        <Button onClick={openCreate} data-testid="button-add-table">
          <Plus className="h-4 w-4 mr-2" />
          Add Table
        </Button>
      </div>

      <DataTable
        data={tables}
        columns={[
          { key: 'number', header: 'Table #' },
          { key: 'branchId', header: 'Branch', render: (item) => getBranchName(item.branchId) },
          { key: 'seats', header: 'Seats' },
          {
            key: 'isActive',
            header: 'Status',
            render: (item) => (
              <Badge variant={item.isActive ? 'default' : 'secondary'} className="no-default-active-elevate">
                {item.isActive ? 'Active' : 'Inactive'}
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
            <DialogTitle>Add Table</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
              <FormField control={form.control} name="branchId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-table-branch">
                        <SelectValue placeholder="Select branch" />
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
              <FormField control={form.control} name="number" render={({ field }) => (
                <FormItem>
                  <FormLabel>Table Number/Name</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g., T1 or Patio-3" data-testid="input-table-number" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="seats" render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Seats</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} data-testid="input-table-seats" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="mt-0">Active</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-table-active" />
                  </FormControl>
                </FormItem>
              )} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
                <Button type="submit" data-testid="button-save-table">Create</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingTable} onOpenChange={() => setEditingTable(null)}>
        <DialogContent data-testid="modal-table-edit">
          <DialogHeader>
            <DialogTitle>Edit Table</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
              <FormField control={form.control} name="branchId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-table-branch-edit">
                        <SelectValue placeholder="Select branch" />
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
              <FormField control={form.control} name="number" render={({ field }) => (
                <FormItem>
                  <FormLabel>Table Number/Name</FormLabel>
                  <FormControl><Input {...field} data-testid="input-table-number-edit" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="seats" render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Seats</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} data-testid="input-table-seats-edit" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="mt-0">Active</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-table-active-edit" />
                  </FormControl>
                </FormItem>
              )} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditingTable(null)}>Cancel</Button>
                <Button type="submit" data-testid="button-update-table">Update</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTable} onOpenChange={() => setDeleteTable(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Table</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete table "{deleteTable?.number}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete-table">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
