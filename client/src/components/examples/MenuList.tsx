import MenuList from '../menu/MenuList';
import { mockMenuItems, mockCategories } from '@/lib/mockData';

export default function MenuListExample() {
  return (
    <div className="max-w-md">
      <MenuList
        items={mockMenuItems}
        categories={mockCategories}
        selectedCategory={null}
        language="en"
        onItemClick={(item) => console.log('Clicked:', item.name)}
      />
    </div>
  );
}
