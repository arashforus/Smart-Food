import RestaurantForm from '../admin/RestaurantForm';
import { mockRestaurant } from '@/lib/mockData';

export default function RestaurantFormExample() {
  return (
    <div className="max-w-2xl">
      <RestaurantForm
        restaurant={mockRestaurant}
        onSubmit={(data) => console.log('Restaurant updated:', data)}
      />
    </div>
  );
}
