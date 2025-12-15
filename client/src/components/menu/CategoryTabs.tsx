import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import type { Category, Language } from '@/lib/types';
import { translations } from '@/lib/types';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  language: Language;
}

export default function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
  language,
}: CategoryTabsProps) {
  const t = translations[language];

  const getCategoryName = (category: Category) => {
    if (language === 'es') return category.nameEs;
    if (language === 'fr') return category.nameFr;
    return category.name;
  };

  return (
    <div className="sticky top-0 z-50 bg-background border-b">
      <ScrollArea className="w-full">
        <div className="flex gap-2 p-3">
          <Button
            variant={selectedCategory === null ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onSelectCategory(null)}
            data-testid="button-category-all"
            className="flex-shrink-0"
          >
            {t.all}
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSelectCategory(category.id)}
              data-testid={`button-category-${category.id}`}
              className="flex-shrink-0"
            >
              {getCategoryName(category)}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
