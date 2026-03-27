import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, Star, Phone, Mail, Cake, Gift, Search } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { CustomerClub } from '@shared/schema';

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  points: z.coerce.number().min(0, 'Points must be 0 or greater'),
  birthday: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  isActive: z.boolean(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function CustomersClubPage() {
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerClub | null>(null);
  const [deleteCustomer, setDeleteCustomer] = useState<CustomerClub | null>(null);
  const [search, setSearch] = useState('');

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      points: 0,
      birthday: '',
      notes: '',
      isActive: true,
    },
  });

  const { data: customers = [], isLoading } = useQuery<CustomerClub[]>({
    queryKey: ['/api/customers-club'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: CustomerFormData) =>
      apiRequest('POST', '/api/customers-club', {
        ...data,
        email: data.email || undefined,
        birthday: data.birthday || undefined,
        notes: data.notes || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers-club'] });
      setFormOpen(false);
      form.reset();
      toast({ title: 'Customer added successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to add customer', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CustomerFormData) => {
      if (!editingCustomer) throw new Error('No customer selected');
      return apiRequest('PATCH', `/api/customers-club/${editingCustomer.id}`, {
        ...data,
        email: data.email || undefined,
        birthday: data.birthday || undefined,
        notes: data.notes || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers-club'] });
      setEditingCustomer(null);
      form.reset();
      toast({ title: 'Customer updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to update customer', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest('DELETE', `/api/customers-club/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers-club'] });
      setDeleteCustomer(null);
      toast({ title: 'Customer deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to delete customer', variant: 'destructive' });
    },
  });

  const adjustPoints = useMutation({
    mutationFn: async ({ id, delta }: { id: string; delta: number }) => {
      const customer = customers.find((c) => c.id === id);
      if (!customer) throw new Error('Customer not found');
      const newPoints = Math.max(0, (customer.points ?? 0) + delta);
      return apiRequest('PATCH', `/api/customers-club/${id}`, { points: newPoints });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers-club'] });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const openCreate = () => {
    form.reset({ name: '', phone: '', email: '', points: 0, birthday: '', notes: '', isActive: true });
    setFormOpen(true);
  };

  const openEdit = (customer: CustomerClub) => {
    form.reset({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      points: customer.points ?? 0,
      birthday: customer.birthday || '',
      notes: customer.notes || '',
      isActive: customer.isActive ?? true,
    });
    setEditingCustomer(customer);
  };

  const onSubmit = (data: CustomerFormData) => {
    if (editingCustomer) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email || '').toLowerCase().includes(search.toLowerCase()),
  );

  const totalPoints = customers.reduce((sum, c) => sum + (c.points ?? 0), 0);
  const activeCount = customers.filter((c) => c.isActive).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Customers Club</h1>
          <p className="text-muted-foreground">Manage loyalty members and their points</p>
        </div>
        <Button onClick={openCreate} data-testid="button-add-customer">
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4 space-y-1">
          <p className="text-sm text-muted-foreground">Total Members</p>
          <p className="text-2xl font-bold" data-testid="stat-total-members">{customers.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 space-y-1">
          <p className="text-sm text-muted-foreground">Active Members</p>
          <p className="text-2xl font-bold text-green-600" data-testid="stat-active-members">{activeCount}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 space-y-1">
          <p className="text-sm text-muted-foreground">Total Points</p>
          <p className="text-2xl font-bold text-amber-500" data-testid="stat-total-points">{totalPoints.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 space-y-1">
          <p className="text-sm text-muted-foreground">Avg Points</p>
          <p className="text-2xl font-bold" data-testid="stat-avg-points">
            {customers.length > 0 ? Math.round(totalPoints / customers.length) : 0}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, phone or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-testid="input-search-customers"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground border-2 border-dashed rounded-lg">
          {search ? 'No customers match your search.' : 'No members yet. Add your first customer!'}
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Member</th>
                  <th className="px-4 py-3 text-left font-medium">Contact</th>
                  <th className="px-4 py-3 text-left font-medium">Points</th>
                  <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Birthday</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-muted/30" data-testid={`row-customer-${customer.id}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium" data-testid={`text-customer-name-${customer.id}`}>{customer.name}</p>
                          {customer.notes && (
                            <p className="text-xs text-muted-foreground truncate max-w-[140px]">{customer.notes}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{customer.phone}</span>
                        </div>
                        {customer.email && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{customer.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-md px-2 py-1">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span className="font-semibold text-sm" data-testid={`text-customer-points-${customer.id}`}>
                            {customer.points ?? 0}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0"
                            onClick={() => adjustPoints.mutate({ id: customer.id, delta: -10 })}
                            disabled={adjustPoints.isPending}
                            data-testid={`button-decrease-points-${customer.id}`}
                          >
                            −
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 w-7 p-0"
                            onClick={() => adjustPoints.mutate({ id: customer.id, delta: 10 })}
                            disabled={adjustPoints.isPending}
                            data-testid={`button-increase-points-${customer.id}`}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {customer.birthday ? (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Cake className="h-3 w-3 text-muted-foreground" />
                          <span>{customer.birthday}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={customer.isActive ? 'default' : 'secondary'}
                        className={customer.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100' : ''}
                        data-testid={`status-customer-${customer.id}`}
                      >
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEdit(customer)}
                          data-testid={`button-edit-customer-${customer.id}`}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteCustomer(customer)}
                          data-testid={`button-delete-customer-${customer.id}`}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={formOpen || !!editingCustomer}
        onOpenChange={(open) => {
          if (!open) {
            setFormOpen(false);
            setEditingCustomer(null);
          }
        }}
      >
        <DialogContent className="max-w-lg" data-testid="modal-customer-form">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              {editingCustomer ? 'Edit Member' : 'Add New Member'}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. John Smith" data-testid="input-customer-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+1 555 000 0000" data-testid="input-customer-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="email@example.com" data-testid="input-customer-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} data-testid="input-customer-points" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birthday</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-customer-birthday" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Any notes about this member..." rows={2} data-testid="input-customer-notes" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <div className="flex items-center gap-3">
                        <FormLabel className="mb-0">Active Member</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-customer-active"
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setFormOpen(false);
                    setEditingCustomer(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-customer"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingCustomer ? 'Update' : 'Add Member'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteCustomer} onOpenChange={() => setDeleteCustomer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{deleteCustomer?.name}</strong> from the customers club? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCustomer && deleteMutation.mutate(deleteCustomer.id)}
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
