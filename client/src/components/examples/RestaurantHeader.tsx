import RestaurantHeader from '../menu/RestaurantHeader';
import { mockRestaurant } from '@/lib/mockData';

export default function RestaurantHeaderExample() {
  return <RestaurantHeader restaurant={mockRestaurant} language="en" />;
}
