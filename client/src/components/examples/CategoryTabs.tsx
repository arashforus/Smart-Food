import { useState } from 'react';
import CategoryTabs from '../menu/CategoryTabs';
import { mockCategories } from '@/lib/mockData';

export default function CategoryTabsExample() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <CategoryTabs
      categories={mockCategories}
      selectedCategory={selected}
      onSelectCategory={setSelected}
      language="en"
    />
  );
}
