import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { 
  UtensilsCrossed, 
  List, 
  Eye, 
  QrCode,
  DollarSign,
  Users,
  TrendingUp,
  Calendar
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import type { DashboardMetrics } from '@/lib/types';
import { mockDashboardMetrics } from '@/lib/mockData';

export default function DashboardPage() {
  const { data: metrics } = useQuery<DashboardMetrics>({
    queryKey: ['/api/dashboard/metrics'],
    initialData: mockDashboardMetrics,
  });

  const statCards = [
    { 
      title: 'Total Items', 
      value: metrics?.totalItems || 0, 
      icon: UtensilsCrossed,
      color: 'text-blue-600'
    },
    { 
      title: 'Categories', 
      value: metrics?.totalCategories || 0, 
      icon: List,
      color: 'text-green-600'
    },
    { 
      title: 'Available', 
      value: metrics?.availableItems || 0, 
      icon: Eye,
      color: 'text-purple-600'
    },
    { 
      title: 'QR Scans', 
      value: metrics?.qrScans || 0, 
      icon: QrCode,
      color: 'text-orange-600'
    },
  ];

  const salesStats = [
    { label: 'Today', value: metrics?.salesDay || 0 },
    { label: 'This Week', value: metrics?.salesWeek || 0 },
    { label: 'This Month', value: metrics?.salesMonth || 0 },
  ];

  const customerStats = [
    { label: 'Today', value: metrics?.customersDay || 0 },
    { label: 'This Week', value: metrics?.customersWeek || 0 },
    { label: 'This Month', value: metrics?.customersMonth || 0 },
  ];

  const viewStats = [
    { label: 'Today', value: metrics?.menuViewsDay || 0 },
    { label: 'This Week', value: metrics?.menuViewsWeek || 0 },
    { label: 'This Month', value: metrics?.menuViewsMonth || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your restaurant menu</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold" data-testid={`stat-${stat.title.toLowerCase().replace(' ', '-')}`}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent className="space-y-3">
            {salesStats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{stat.label}</span>
                <span className="font-semibold" data-testid={`sales-${stat.label.toLowerCase().replace(' ', '-')}`}>
                  ${stat.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="space-y-3">
            {customerStats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{stat.label}</span>
                <span className="font-semibold" data-testid={`customers-${stat.label.toLowerCase().replace(' ', '-')}`}>
                  {stat.value.toLocaleString()}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Menu Views</CardTitle>
            <Eye className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent className="space-y-3">
            {viewStats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">{stat.label}</span>
                <span className="font-semibold" data-testid={`views-${stat.label.toLowerCase().replace(' ', '-')}`}>
                  {stat.value.toLocaleString()}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Weekly Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics?.salesChart || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`$${value}`, 'Sales']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary) / 0.2)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Menu Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics?.viewsChart || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="views" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Best Sellers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(metrics?.bestSellers || []).map((item, index) => (
                <div key={item.itemId} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center p-0 text-xs">
                      {index + 1}
                    </Badge>
                    <span className="font-medium" data-testid={`bestseller-${index}`}>{item.name}</span>
                  </div>
                  <span className="text-muted-foreground text-sm">{item.count} orders</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm">New order received - Table T3</span>
                <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm">Menu viewed via QR scan</span>
                <span className="text-xs text-muted-foreground ml-auto">5m ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-sm">Waiter called - Table A2</span>
                <span className="text-xs text-muted-foreground ml-auto">8m ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm">New order received - Table T1</span>
                <span className="text-xs text-muted-foreground ml-auto">12m ago</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-sm">Menu item updated</span>
                <span className="text-xs text-muted-foreground ml-auto">15m ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
