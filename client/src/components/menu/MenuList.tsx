import { Star } from 'lucide-react';
import MenuItemCard from './MenuItemCard';
import { translations } from '@/lib/types';
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

  const suggestedItems = items.filter((item) => item.suggested && item.available);

  const getCategoryName = (category: Category) => {
    return category.name[language] || category.name.en || Object.values(category.name)[0] || '';
  };

  const t = translations[language] || translations.en;
  const isRtl = language === 'fa';

  if (selectedCategory) {
    const categorySuggestedItems = suggestedItems.filter((item) => item.categoryId === selectedCategory);
    
    return (
      <div className={`p-4 space-y-6 ${isRtl ? 'dir-rtl' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {categorySuggestedItems.length > 0 && (
          <div>
            <h2
              className={`text-lg font-semibold mb-3 sticky top-12 bg-background py-2 z-40 flex items-center gap-2 ${isRtl ? 'text-right flex-row-reverse' : ''}`}
              data-testid="text-category-heading-suggested-filtered"
            >
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              {t.suggested}
            </h2>
            <div className="space-y-3">
              {categorySuggestedItems.map((item) => (
                <MenuItemCard
                  key={`suggested-${item.id}`}
                  item={item}
                  language={language}
                  onClick={() => onItemClick?.(item)}
                  isSuggested
                />
              ))}
            </div>
          </div>
        )}
        <div className="space-y-3">
          {filteredItems.filter((item) => !item.suggested).map((item) => (
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
  }

  return (
    <div className={`p-4 space-y-6 ${isRtl ? 'dir-rtl' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {suggestedItems.length > 0 && (
        <div>
          <h2
            className={`text-lg font-semibold mb-3 sticky top-12 bg-background py-2 z-40 flex items-center gap-2 ${isRtl ? 'text-right flex-row-reverse' : ''}`}
            data-testid="text-category-heading-suggested"
          >
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            {t.suggested}
          </h2>
          <div className="space-y-3">
            {suggestedItems.map((item) => (
              <MenuItemCard
                key={`suggested-${item.id}`}
                item={item}
                language={language}
                onClick={() => onItemClick?.(item)}
                isSuggested
              />
            ))}
          </div>
        </div>
      )}
      {categories.map((category) => {
        const categoryItems = items.filter(
          (item) => item.categoryId === category.id && item.available && !item.suggested
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
