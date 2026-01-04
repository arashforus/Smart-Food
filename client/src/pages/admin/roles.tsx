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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DataTable from '@/components/admin/DataTable';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { mockUsers } from '@/lib/mockData';
import { roleLabels, rolePermissions, type Settings } from '@/lib/types';
import type { User, Role } from '@/lib/types';
import { apiRequest, queryClient } from '@/lib/queryClient';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  role: z.enum(['admin', 'manager', 'chef', 'accountant']),
  branchId: z.string().optional(),
  isActive: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

interface StorageBranch {
  id: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
}

export default function RolesPage() {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  const { data: branches = [], isLoading: branchesLoading } = useQuery<StorageBranch[]>({
    queryKey: ['/api/branches'],
  });

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '', role: 'manager', branchId: '', isActive: true },
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      return apiRequest('POST', '/api/users', {
        username: data.email.split('@')[0] + Math.floor(Math.random() * 1000),
        password: 'password123',
        name: data.name,
        email: data.email,
        role: data.role,
        branchId: data.branchId === 'all' ? null : data.branchId,
        isActive: data.isActive,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setFormOpen(false);
      form.reset();
      toast({ title: 'User Created' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to create user', variant: 'destructive' });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: { userId: string; formData: UserFormData }) => {
      return apiRequest('PATCH', `/api/users/${data.userId}`, {
        name: data.formData.name,
        email: data.formData.email,
        role: data.formData.role,
        branchId: data.formData.branchId === 'all' ? null : data.formData.branchId,
        isActive: data.formData.isActive,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setEditingUser(null);
      form.reset();
      toast({ title: 'User Updated' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to update user', variant: 'destructive' });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest('DELETE', `/api/users/${userId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setDeleteUser(null);
      toast({ title: 'User Deleted' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to delete user', variant: 'destructive' });
    },
  });

  const openCreate = () => {
    form.reset({ name: '', email: '', role: 'manager', branchId: 'all', isActive: true });
    setFormOpen(true);
  };

  const openEdit = (user: User) => {
    form.reset({ name: user.name, email: user.email, role: user.role, branchId: user.branchId || 'all', isActive: user.isActive });
    setEditingUser(user);
  };

  const handleCreate = async (data: UserFormData) => {
    createUserMutation.mutate(data);
  };

  const handleEdit = (data: UserFormData) => {
    if (!editingUser) return;
    updateUserMutation.mutate({ userId: editingUser.id, formData: data });
  };

  const handleDelete = () => {
    if (!deleteUser) return;
    deleteUserMutation.mutate(deleteUser.id);
  };

  const getBranchName = (branchId?: string) => {
    if (!branchId) return 'All Branches';
    return branches.find((b) => b.id === branchId)?.name || 'Unknown';
  };

  const { data: settings } = useQuery<Settings>({
    queryKey: ['/api/settings'],
  });

  const getRolePermissions = (role: Role): string[] => {
    if (!settings) return rolePermissions[role];
    
    let permissionsStr = '';
    switch (role) {
      case 'admin': permissionsStr = settings.rolesAdminPermissions || ''; break;
      case 'manager': permissionsStr = settings.rolesManagerPermissions || ''; break;
      case 'chef': permissionsStr = settings.rolesChefPermissions || ''; break;
      case 'accountant': permissionsStr = settings.rolesAccountantPermissions || ''; break;
    }
    
    if (!permissionsStr) return rolePermissions[role];
    return permissionsStr.split(',').map(p => p.trim()).filter(Boolean);
  };

  const roles: Role[] = ['admin', 'manager', 'chef', 'accountant'];

  if (branchesLoading || usersLoading) {
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
          <h1 className="text-2xl font-semibold">Roles & Users</h1>
          <p className="text-muted-foreground">Manage user access and permissions</p>
        </div>
        <Button onClick={openCreate} data-testid="button-add-user">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {roles.map((role) => {
          const permissions = getRolePermissions(role);
          return (
            <Card key={role} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{roleLabels[role]}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-3">
                <div className="flex flex-wrap gap-1">
                  {permissions[0] === 'all' ? (
                    <Badge variant="default" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 text-[11px] h-5 px-2">
                      Full Access
                    </Badge>
                  ) : (
                    permissions.map((p) => (
                      <Badge 
                        key={p} 
                        variant="outline" 
                        className="text-[11px] h-5 px-2 capitalize bg-muted/30"
                      >
                        {p.replace(/_/g, ' ')}
                      </Badge>
                    ))
                  )}
                </div>
                
                <div className="pt-2 border-t mt-auto flex items-center justify-between text-xs text-muted-foreground">
                  <span>Users</span>
                  <span className="font-medium text-foreground">
                    {users.filter((u) => u.role === role).length}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <DataTable
        data={users}
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'email', header: 'Email' },
          {
            key: 'role',
            header: 'Role',
            render: (item) => (
              <Badge variant="outline" className="no-default-active-elevate">
                {roleLabels[item.role]}
              </Badge>
            ),
          },
          { key: 'branchId', header: 'Branch', render: (item) => getBranchName(item.branchId) },
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
        onDelete={(item) => setDeleteUser(item)}
        testIdPrefix="user"
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent data-testid="modal-user-form">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input {...field} data-testid="input-user-name" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" {...field} data-testid="input-user-email" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-user-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="chef">Chef</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="branchId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-user-branch">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="mt-0">Active</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-user-active" />
                  </FormControl>
                </FormItem>
              )} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
                <Button type="submit" data-testid="button-save-user">Create</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent data-testid="modal-user-edit">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input {...field} data-testid="input-user-name-edit" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" {...field} data-testid="input-user-email-edit" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-user-role-edit">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="chef">Chef</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="branchId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-user-branch-edit">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel className="mt-0">Active</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-user-active-edit" />
                  </FormControl>
                </FormItem>
              )} />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditingUser(null)}>Cancel</Button>
                <Button type="submit" data-testid="button-update-user" disabled={updateUserMutation.isPending}>
                  {updateUserMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteUser?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete-user">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
