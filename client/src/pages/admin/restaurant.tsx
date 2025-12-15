import { useState } from 'react';
import RestaurantForm from '@/components/admin/RestaurantForm';
import { useToast } from '@/hooks/use-toast';
// todo: remove mock functionality
import { mockRestaurant } from '@/lib/mockData';
import type { Restaurant } from '@/lib/types';

export default function RestaurantPage() {
  const { toast } = useToast();
  // todo: remove mock functionality - replace with API calls
  const [restaurant, setRestaurant] = useState<Restaurant>(mockRestaurant);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (data: Omit<Restaurant, 'id'>) => {
    setIsPending(true);
    // todo: replace with API call
    setTimeout(() => {
      setRestaurant({ ...restaurant, ...data });
      setIsPending(false);
      toast({
        title: 'Restaurant Updated',
        description: 'Your restaurant information has been saved.',
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Restaurant Info</h1>
        <p className="text-muted-foreground">Manage your restaurant details</p>
      </div>

      <div className="max-w-2xl">
        <RestaurantForm
          restaurant={restaurant}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
