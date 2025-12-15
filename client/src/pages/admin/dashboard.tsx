import DashboardStats from '@/components/admin/DashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// todo: remove mock functionality
import { mockMenuItems, mockCategories } from '@/lib/mockData';

export default function DashboardPage() {
  // todo: remove mock functionality - replace with API calls
  const items = mockMenuItems;
  const categories = mockCategories;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your restaurant menu</p>
      </div>

      <DashboardStats
        totalItems={items.length}
        totalCategories={categories.length}
        availableItems={items.filter((i) => i.available).length}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {items.slice(0, 5).map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="text-muted-foreground">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map((category) => {
                const count = items.filter((i) => i.categoryId === category.id).length;
                return (
                  <div key={category.id} className="flex justify-between text-sm">
                    <span>{category.name}</span>
                    <span className="text-muted-foreground">{count} items</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
