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
import { mockBranches } from '@/lib/mockData';
import type { Branch } from '@/lib/types';

const branchSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone is required'),
  isActive: z.boolean(),
});

type BranchFormData = z.infer<typeof branchSchema>;

export default function BranchesPage() {
  const { toast } = useToast();
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deleteBranch, setDeleteBranch] = useState<Branch | null>(null);

  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: { name: '', address: '', phone: '', isActive: true },
  });

  const openCreate = () => {
    form.reset({ name: '', address: '', phone: '', isActive: true });
    setFormOpen(true);
  };

  const openEdit = (branch: Branch) => {
    form.reset({ name: branch.name, address: branch.address, phone: branch.phone, isActive: branch.isActive });
    setEditingBranch(branch);
  };

  const handleCreate = (data: BranchFormData) => {
    const newBranch: Branch = { id: String(Date.now()), ...data };
    setBranches([...branches, newBranch]);
    setFormOpen(false);
    form.reset();
    toast({ title: 'Branch Created' });
  };

  const handleEdit = (data: BranchFormData) => {
    if (!editingBranch) return;
    setBranches(branches.map((b) => (b.id === editingBranch.id ? { ...b, ...data } : b)));
    setEditingBranch(null);
    form.reset();
    toast({ title: 'Branch Updated' });
  };

  const handleDelete = () => {
    if (!deleteBranch) return;
    setBranches(branches.filter((b) => b.id !== deleteBranch.id));
    setDeleteBranch(null);
    toast({ title: 'Branch Deleted' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Branches</h1>
          <p className="text-muted-foreground">Manage your restaurant locations</p>
        </div>
        <Button onClick={openCreate} data-testid="button-add-branch">
          <Plus className="h-4 w-4 mr-2" />
          Add Branch
        </Button>
      </div>

      <DataTable
        data={branches}
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'address', header: 'Address' },
          { key: 'phone', header: 'Phone' },
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
        onDelete={(item) => setDeleteBranch(item)}
        testIdPrefix="branch"
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent data-testid="modal-branch-form">
          <DialogHeader>
            <DialogTitle>Add Branch</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Name</FormLabel>
                  <FormControl><Input {...field} data-testid="input-branch-name" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl><Input {...field} data-testid="input-branch-address" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl><Input {...field} data-testid="input-branch-phone" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="mt-0">Active</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-branch-active" />
                  </FormControl>
                </FormItem>
              )} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
                <Button type="submit" data-testid="button-save-branch">Create</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingBranch} onOpenChange={() => setEditingBranch(null)}>
        <DialogContent data-testid="modal-branch-edit">
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Name</FormLabel>
                  <FormControl><Input {...field} data-testid="input-branch-name-edit" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl><Input {...field} data-testid="input-branch-address-edit" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl><Input {...field} data-testid="input-branch-phone-edit" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="mt-0">Active</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-branch-active-edit" />
                  </FormControl>
                </FormItem>
              )} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditingBranch(null)}>Cancel</Button>
                <Button type="submit" data-testid="button-update-branch">Update</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteBranch} onOpenChange={() => setDeleteBranch(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Branch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteBranch?.name}"? This will also remove all tables associated with this branch.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete-branch">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
