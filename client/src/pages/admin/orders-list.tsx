import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, ArrowUpDown } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  table_number: string | null;
  branch_id: string;
  items: any;
  status: string;
  total_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

type SortField = 'order_number' | 'created_at' | 'total_amount' | 'status';
type SortOrder = 'asc' | 'desc';

export default function OrdersListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json() as Promise<Order[]>;
    },
  });

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch = !searchQuery ||
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.table_number && order.table_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
        order.notes?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || !statusFilter || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'created_at') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-muted-foreground">View and manage all orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order number, table, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-orders"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger data-testid="select-status-filter">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <div className="border rounded-lg overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading orders...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {searchQuery || statusFilter ? 'No orders match your filters' : 'No orders yet'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="cursor-pointer hover:bg-muted/70" onClick={() => handleSort('order_number')} data-testid="header-order-number">
                      <div className="flex items-center gap-2">
                        Order #
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead data-testid="header-table">Table</TableHead>
                    <TableHead data-testid="header-items">Items</TableHead>
                    <TableHead className="cursor-pointer hover:bg-muted/70" onClick={() => handleSort('total_amount')} data-testid="header-total">
                      <div className="flex items-center gap-2">
                        Total
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-muted/70" onClick={() => handleSort('status')} data-testid="header-status">
                      <div className="flex items-center gap-2">
                        Status
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-muted/70" onClick={() => handleSort('created_at')} data-testid="header-created">
                      <div className="flex items-center gap-2">
                        Created
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead data-testid="header-notes">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
                      <TableCell className="font-mono font-semibold text-sm" data-testid={`text-order-number-${order.id}`}>
                        {order.order_number}
                      </TableCell>
                      <TableCell data-testid={`text-table-${order.id}`}>
                        {order.table_number ? `Table ${order.table_number}` : 'Takeaway'}
                      </TableCell>
                      <TableCell className="text-sm" data-testid={`text-items-count-${order.id}`}>
                        {order.items && Array.isArray(order.items) ? `${order.items.length} items` : '0 items'}
                      </TableCell>
                      <TableCell className="font-semibold" data-testid={`text-total-${order.id}`}>
                        ${typeof order.total_amount === 'number' ? order.total_amount.toFixed(2) : '0.00'}
                      </TableCell>
                      <TableCell data-testid={`badge-status-${order.id}`}>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground" data-testid={`text-created-${order.id}`}>
                        {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate" title={order.notes || ''} data-testid={`text-notes-${order.id}`}>
                        {order.notes || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Summary */}
          {filteredOrders.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-4 border-t">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Total Orders</p>
                <p className="text-2xl font-bold" data-testid="text-total-orders">{filteredOrders.length}</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Total Revenue</p>
                <p className="text-2xl font-bold" data-testid="text-total-revenue">
                  ${filteredOrders.reduce((sum, o) => sum + (typeof o.total_amount === 'number' ? o.total_amount : 0), 0).toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Pending</p>
                <p className="text-2xl font-bold" data-testid="text-pending-count">
                  {filteredOrders.filter((o) => o.status === 'pending').length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Completed</p>
                <p className="text-2xl font-bold" data-testid="text-completed-count">
                  {filteredOrders.filter((o) => o.status === 'completed').length}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
