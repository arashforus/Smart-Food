import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed, List, Eye, QrCode } from 'lucide-react';

interface DashboardStatsProps {
  totalItems: number;
  totalCategories: number;
  availableItems: number;
}

export default function DashboardStats({ totalItems, totalCategories, availableItems }: DashboardStatsProps) {
  const stats = [
    { title: 'Total Items', value: totalItems, icon: UtensilsCrossed },
    { title: 'Categories', value: totalCategories, icon: List },
    { title: 'Available', value: availableItems, icon: Eye },
    { title: 'QR Scans', value: '—', icon: QrCode },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid={`text-stat-${stat.title.toLowerCase().replace(' ', '-')}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
