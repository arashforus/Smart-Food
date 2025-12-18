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
  onAddToCart?: (item: MenuItem) => void;
  selectedTypes?: string[];
  viewMode?: 'grid' | 'list';
  showSuggested?: boolean;
  searchQuery?: string;
}

export default function MenuList({
  items,
  categories,
  selectedCategory,
  language,
  onItemClick,
  onAddToCart,
  selectedTypes = [],
  viewMode = 'list',
  showSuggested = false,
  searchQuery = '',
}: MenuListProps) {
  const filterByTypes = (itemList: MenuItem[]) => {
    if (selectedTypes.length === 0) return itemList;
    return itemList.filter((item) =>
      selectedTypes.some((typeId) => item.types.includes(typeId))
    );
  };

  const filterBySearch = (itemList: MenuItem[]) => {
    if (!searchQuery.trim()) return itemList;
    const query = searchQuery.toLowerCase().trim();
    return itemList.filter((item) => {
      const name = (item.name[language] || item.name.en || '').toLowerCase();
      const desc = (item.shortDescription[language] || item.shortDescription.en || '').toLowerCase();
      return name.includes(query) || desc.includes(query);
    });
  };

  const filteredItems = selectedCategory
    ? filterBySearch(filterByTypes(items.filter((item) => item.categoryId === selectedCategory && item.available)))
    : filterBySearch(filterByTypes(items.filter((item) => item.available)));

  const suggestedItems = filterBySearch(filterByTypes(items.filter((item) => item.suggested && item.available)));

  const getCategoryName = (category: Category) => {
    return category.name[language] || category.name.en || Object.values(category.name)[0] || '';
  };

  const t = translations[language] || translations.en;
  const isRtl = language === 'fa';

  const gridClass = viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3';

  if (showSuggested) {
    return (
      <div className={`p-4 space-y-6 ${isRtl ? 'dir-rtl' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
        <div>
          <h2
            className={`text-lg font-semibold mb-3 sticky top-[145px] bg-background py-2 z-30 flex items-center gap-2 ${isRtl ? 'text-right flex-row-reverse' : ''}`}
            data-testid="text-category-heading-suggested-only"
          >
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            {t.suggested}
          </h2>
          <div className={gridClass}>
            {suggestedItems.map((item) => (
              <MenuItemCard
                key={`suggested-${item.id}`}
                item={item}
                language={language}
                onClick={() => onItemClick?.(item)}
                onAddToCart={onAddToCart}
                isSuggested
                viewMode={viewMode}
              />
            ))}
          </div>
          {suggestedItems.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No suggested items found
            </p>
          )}
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    const categorySuggestedItems = suggestedItems.filter((item) => item.categoryId === selectedCategory);

    return (
      <div className={`p-4 space-y-6 ${isRtl ? 'dir-rtl' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
        {categorySuggestedItems.length > 0 && (
          <div>
            <h2
              className={`text-lg font-semibold mb-3 sticky top-[145px] bg-background py-2 z-30 flex items-center gap-2 ${isRtl ? 'text-right flex-row-reverse' : ''}`}
              data-testid="text-category-heading-suggested-filtered"
            >
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              {t.suggested}
            </h2>
            <div className={gridClass}>
              {categorySuggestedItems.map((item) => (
                <MenuItemCard
                  key={`suggested-${item.id}`}
                  item={item}
                  language={language}
                  onClick={() => onItemClick?.(item)}
                  isSuggested
                  viewMode={viewMode}
                />
              ))}
            </div>
          </div>
        )}
        <div className={gridClass}>
          {filteredItems.filter((item) => !item.suggested).map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              language={language}
              onClick={() => onItemClick?.(item)}
              onAddToCart={onAddToCart}
              viewMode={viewMode}
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
            className={`text-lg font-semibold mb-3 sticky top-[145px] bg-background py-2 z-30 flex items-center gap-2 ${isRtl ? 'text-right flex-row-reverse' : ''}`}
            data-testid="text-category-heading-suggested"
          >
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            {t.suggested}
          </h2>
          <div className={gridClass}>
            {suggestedItems.map((item) => (
              <MenuItemCard
                key={`suggested-${item.id}`}
                item={item}
                language={language}
                onClick={() => onItemClick?.(item)}
                onAddToCart={onAddToCart}
                isSuggested
                viewMode={viewMode}
              />
            ))}
          </div>
        </div>
      )}
      {categories.map((category) => {
        const categoryItems = filterBySearch(filterByTypes(
          items.filter(
            (item) => item.categoryId === category.id && item.available && !item.suggested
          )
        ));
        if (categoryItems.length === 0) return null;

        return (
          <div key={category.id}>
            <h2
              className={`text-lg font-semibold mb-3 sticky top-[145px] bg-background py-2 z-30 ${isRtl ? 'text-right' : ''}`}
              data-testid={`text-category-heading-${category.id}`}
            >
              {getCategoryName(category)}
            </h2>
            <div className={gridClass}>
              {categoryItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  language={language}
                  onClick={() => onItemClick?.(item)}
                  onAddToCart={onAddToCart}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
