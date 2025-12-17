import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, LayoutGrid, LayoutList, Leaf, Salad, WheatOff, Flame, Heart } from 'lucide-react';
import type { Category, FoodType, Language } from '@/lib/types';
import { translations } from '@/lib/types';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  language: Language;
  foodTypes: FoodType[];
  selectedTypes: string[];
  onSelectType: (typeId: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  showSuggested: boolean;
  onShowSuggestedChange: (show: boolean) => void;
}

const iconMap: Record<string, typeof Leaf> = {
  'leaf': Leaf,
  'salad': Salad,
  'wheat-off': WheatOff,
  'flame': Flame,
  'heart': Heart,
};

export default function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
  language,
  foodTypes,
  selectedTypes,
  onSelectType,
  viewMode,
  onViewModeChange,
  showSuggested,
  onShowSuggestedChange,
}: CategoryTabsProps) {
  const t = translations[language];

  const getCategoryName = (category: Category) => {
    return category.name[language] || category.name.en || Object.values(category.name)[0] || '';
  };

  const getTypeName = (type: FoodType) => {
    return type.name[language] || type.name.en || Object.values(type.name)[0] || '';
  };

  return (
    <div className="sticky top-[49px] z-40 bg-background border-b">
      <ScrollArea className="w-full">
        <div className="flex gap-3 p-3">
          <button
            onClick={() => {
              onSelectCategory(null);
              onShowSuggestedChange(false);
            }}
            className={`flex flex-col items-center flex-shrink-0 transition-all ${
              selectedCategory === null && !showSuggested
                ? 'opacity-100'
                : 'opacity-60 hover:opacity-80'
            }`}
            data-testid="button-category-all"
          >
            <div
              className={`w-16 h-16 rounded-xl overflow-hidden mb-1.5 border-2 transition-all ${
                selectedCategory === null && !showSuggested
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-border'
              }`}
            >
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <LayoutGrid className="w-6 h-6 text-primary" />
              </div>
            </div>
            <span className="text-xs font-medium text-center max-w-16 truncate">
              {t.all}
            </span>
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onSelectCategory(category.id);
                onShowSuggestedChange(false);
              }}
              className={`flex flex-col items-center flex-shrink-0 transition-all ${
                selectedCategory === category.id
                  ? 'opacity-100'
                  : 'opacity-60 hover:opacity-80'
              }`}
              data-testid={`button-category-${category.id}`}
            >
              <div
                className={`w-16 h-16 rounded-xl overflow-hidden mb-1.5 border-2 transition-all ${
                  selectedCategory === category.id
                    ? 'border-primary ring-2 ring-primary/30'
                    : 'border-border'
                }`}
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={getCategoryName(category)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-lg font-semibold text-muted-foreground">
                      {getCategoryName(category).charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-center max-w-16 truncate">
                {getCategoryName(category)}
              </span>
            </button>
          ))}

          <button
            onClick={() => {
              onSelectCategory(null);
              onShowSuggestedChange(true);
            }}
            className={`flex flex-col items-center flex-shrink-0 transition-all ${
              showSuggested
                ? 'opacity-100'
                : 'opacity-60 hover:opacity-80'
            }`}
            data-testid="button-category-suggested"
          >
            <div
              className={`w-16 h-16 rounded-xl overflow-hidden mb-1.5 border-2 transition-all ${
                showSuggested
                  ? 'border-amber-500 ring-2 ring-amber-500/30'
                  : 'border-border'
              }`}
            >
              <div className="w-full h-full bg-gradient-to-br from-amber-400/30 to-amber-500/50 flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              </div>
            </div>
            <span className="text-xs font-medium text-center max-w-16 truncate">
              {t.suggested}
            </span>
          </button>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex items-center justify-between gap-2 px-3 pb-3">
        <ScrollArea className="flex-1">
          <div className="flex gap-2">
            {foodTypes.map((type) => {
              const IconComponent = iconMap[type.icon || ''] || Leaf;
              const isSelected = selectedTypes.includes(type.id);
              return (
                <Badge
                  key={type.id}
                  variant={isSelected ? 'default' : 'outline'}
                  className="cursor-pointer flex-shrink-0 gap-1"
                  style={{
                    backgroundColor: isSelected ? type.color : undefined,
                    borderColor: type.color,
                    color: isSelected ? 'white' : type.color,
                  }}
                  onClick={() => onSelectType(type.id)}
                  data-testid={`badge-type-${type.id}`}
                >
                  <IconComponent className="w-3 h-3" />
                  {getTypeName(type)}
                </Badge>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="flex gap-1 flex-shrink-0 border-l pl-2 ml-2">
          <Button
            size="icon"
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            onClick={() => onViewModeChange('list')}
            data-testid="button-view-list"
          >
            <LayoutList className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            onClick={() => onViewModeChange('grid')}
            data-testid="button-view-grid"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
