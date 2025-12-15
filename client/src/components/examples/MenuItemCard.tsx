import MenuItemCard from '../menu/MenuItemCard';
import { mockMenuItems } from '@/lib/mockData';

export default function MenuItemCardExample() {
  return (
    <div className="max-w-sm">
      <MenuItemCard item={mockMenuItems[0]} language="en" onClick={() => console.log('Item clicked')} />
    </div>
  );
}
