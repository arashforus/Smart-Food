import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Star, LayoutGrid, LayoutList, Leaf, Salad, WheatOff, Flame, Heart, Search, X } from 'lucide-react';
import type { Category, FoodType, Language, Settings } from '@/lib/types';
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
  searchQuery: string;
  onSearchChange: (query: string) => void;
  settings?: Settings;
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
  searchQuery,
  onSearchChange,
  settings,
}: CategoryTabsProps) {
  const t = translations[language] || translations.en;
  const isRtl = language === 'fa' || language === 'ar';

  const getCategoryName = (category: Category) => {
    return category.name[language as keyof typeof category.name] || category.name.en || Object.values(category.name)[0] || '';
  };

  const getTypeName = (type: FoodType) => {
    return type.name[language as keyof typeof type.name] || type.name.en || Object.values(type.name)[0] || '';
  };

  return (
    <div className="sticky top-[49px] z-40 bg-background/80 backdrop-blur-md border-b shadow-sm">
      <ScrollArea className="w-full">
        <div className="flex gap-4 p-4">
          <button
            onClick={() => {
              onSelectCategory(null);
              onShowSuggestedChange(false);
            }}
            className={`flex flex-col items-center flex-shrink-0 transition-all duration-300 ${
              selectedCategory === null && !showSuggested
                ? 'scale-105'
                : 'opacity-60 hover:opacity-100'
            }`}
            data-testid="button-category-all"
          >
            <div
              className={`w-16 h-16 rounded-2xl overflow-hidden mb-2 border-2 transition-all duration-300 ${
                selectedCategory === null && !showSuggested
                  ? 'border-primary shadow-lg ring-4 ring-primary/10'
                  : 'border-transparent bg-muted/50'
              }`}
            >
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
                <LayoutGrid className="w-7 h-7 text-primary" />
              </div>
            </div>
            <span className={`text-[10px] uppercase tracking-wider font-bold text-center max-w-16 truncate ${selectedCategory === null && !showSuggested ? 'text-primary' : 'text-muted-foreground'}`}>
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
              className={`flex flex-col items-center flex-shrink-0 transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'scale-105'
                  : 'opacity-60 hover:opacity-100'
              }`}
              data-testid={`button-category-${category.id}`}
            >
              <div
                className={`w-16 h-16 rounded-2xl overflow-hidden mb-2 border-2 transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'border-primary shadow-lg ring-4 ring-primary/10'
                    : 'border-transparent bg-muted/50'
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
                    <span className="text-xl font-bold text-muted-foreground/50">
                      {getCategoryName(category).charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold text-center max-w-16 truncate ${selectedCategory === category.id ? 'text-primary' : 'text-muted-foreground'}`}>
                {getCategoryName(category)}
              </span>
            </button>
          ))}

          {settings?.menuShowRecommendedMenuItems && (
            <button
              onClick={() => {
                onSelectCategory(null);
                onShowSuggestedChange(true);
              }}
              className={`flex flex-col items-center flex-shrink-0 transition-all duration-300 ${
                showSuggested
                  ? 'scale-105'
                  : 'opacity-60 hover:opacity-100'
              }`}
              data-testid="button-category-suggested"
            >
              <div
                className={`w-16 h-16 rounded-2xl overflow-hidden mb-2 border-2 transition-all duration-300 ${
                  showSuggested
                    ? 'border-amber-500 shadow-lg ring-4 ring-amber-500/10'
                    : 'border-transparent bg-muted/50'
                }`}
              >
                <div className="w-full h-full bg-gradient-to-br from-amber-400/20 to-amber-500/40 flex items-center justify-center">
                  <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
                </div>
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold text-center max-w-16 truncate ${showSuggested ? 'text-amber-600' : 'text-muted-foreground'}`}>
                {t.suggested}
              </span>
            </button>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex items-center justify-between gap-3 px-4 pb-4">
        {settings?.menuShowFoodType && (
          <ScrollArea className="flex-1">
            <div className="flex gap-2">
              {foodTypes.map((type) => {
                const IconComponent = iconMap[type.icon || ''] || Leaf;
                const isSelected = selectedTypes.includes(type.id);
                return (
                  <Badge
                    key={type.id}
                    variant={isSelected ? 'default' : 'outline'}
                    className="cursor-pointer flex-shrink-0 gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all"
                    style={{
                      backgroundColor: isSelected ? type.color : undefined,
                      borderColor: type.color,
                      color: isSelected ? 'white' : type.color,
                    }}
                    onClick={() => onSelectType(type.id)}
                    data-testid={`badge-type-${type.id}`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    {getTypeName(type)}
                  </Badge>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}

        {settings?.menuShowViewSwitcher && (
          <div className={`flex gap-1.5 flex-shrink-0 bg-muted/30 p-1 rounded-lg ${isRtl ? 'border-r pr-2 mr-2 border-l-0 pl-0 ml-0' : 'border-l pl-2 ml-2'}`}>
            <Button
              size="icon"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => onViewModeChange('list')}
              className="h-8 w-8 rounded-md"
              data-testid="button-view-list"
            >
              <LayoutList className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => onViewModeChange('grid')}
              className="h-8 w-8 rounded-md"
              data-testid="button-view-grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {settings?.menuShowSearchBar && (
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors ${isRtl ? 'right-3' : 'left-3'}`} />
            <Input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`rounded-full bg-muted/50 border-none focus-visible:ring-primary/20 transition-all ${isRtl ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10'}`}
              data-testid="input-search"
            />
            {searchQuery && (
              <Button
                size="icon"
                variant="ghost"
                className={`absolute top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-transparent ${isRtl ? 'left-1' : 'right-1'}`}
                onClick={() => onSearchChange('')}
                data-testid="button-clear-search"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
