import MenuItemCard from './MenuItemCard';
import type { MenuItem, Category, Language } from '@/lib/types';

interface MenuListProps {
  items: MenuItem[];
  categories: Category[];
  selectedCategory: string | null;
  language: Language;
  onItemClick?: (item: MenuItem) => void;
}

export default function MenuList({
  items,
  categories,
  selectedCategory,
  language,
  onItemClick,
}: MenuListProps) {
  const filteredItems = selectedCategory
    ? items.filter((item) => item.categoryId === selectedCategory && item.available)
    : items.filter((item) => item.available);

  const getCategoryName = (category: Category) => {
    return category.name[language] || category.name.en || Object.values(category.name)[0] || '';
  };

  const isRtl = language === 'fa';

  if (selectedCategory) {
    return (
      <div className={`p-4 space-y-3 ${isRtl ? 'dir-rtl' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {filteredItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            language={language}
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`p-4 space-y-6 ${isRtl ? 'dir-rtl' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {categories.map((category) => {
        const categoryItems = items.filter(
          (item) => item.categoryId === category.id && item.available
        );
        if (categoryItems.length === 0) return null;

        return (
          <div key={category.id}>
            <h2
              className={`text-lg font-semibold mb-3 sticky top-12 bg-background py-2 z-40 ${isRtl ? 'text-right' : ''}`}
              data-testid={`text-category-heading-${category.id}`}
            >
              {getCategoryName(category)}
            </h2>
            <div className="space-y-3">
              {categoryItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  language={language}
                  onClick={() => onItemClick?.(item)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
