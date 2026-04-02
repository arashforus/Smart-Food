import { motion } from 'framer-motion';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Star, LayoutGrid, LayoutList, Leaf, Search, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { Category, FoodType, Language, Settings } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';

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

function getDynamicIcon(name?: string | null) {
  if (!name) return Leaf;
  const Icon = (LucideIcons as any)[name];
  return Icon || Leaf;
}

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
  const { t, dir } = useLanguage();
  const isRtl = dir === 'rtl';

  const getCategoryName = (category: Category) => {
    return category.name[language as keyof typeof category.name] || category.name.en || Object.values(category.name)[0] || '';
  };

  const getTypeName = (type: FoodType) => {
    return type.name[language as keyof typeof type.name] || type.name.en || Object.values(type.name)[0] || '';
  };

  return (
    <div className="sticky top-[49px] z-40 bg-background/80 backdrop-blur-md border-b shadow-sm" >
      <ScrollArea className="w-full" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className={`flex gap-4 p-4 justify-start`}>
          <button
            onClick={() => {
              onSelectCategory(null);
              onShowSuggestedChange(false);
            }}
            className={`flex flex-col items-center flex-shrink-0 transition-all duration-300 ${
              selectedCategory === null && !showSuggested
                ? 'scale-105'
                : 'hover:opacity-100'
            }`}
            data-testid="button-category-all"
          >
            <div
              className={`w-16 h-16 rounded-2xl overflow-hidden mb-2 border-2 transition-all duration-300 ${
                selectedCategory === null && !showSuggested
                  ? 'border-primary shadow-lg ring-4 ring-primary/10'
                  : 'border-transparent bg-muted/80'
              }`}
            >
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
                <LayoutGrid className="w-7 h-7 text-primary" />
              </div>
            </div>
            <span className={`text-[10px] uppercase tracking-wider font-bold text-center max-w-16 line-clamp-2 leading-tight h-6 flex items-center justify-center break-words ${selectedCategory === null && !showSuggested ? 'text-primary' : 'text-muted-foreground'}`}>
              {t('all')}
            </span>
          </button>

          {settings?.menuShowRecommendedMenuItems && (
            <button
              onClick={() => {
                onSelectCategory(null);
                onShowSuggestedChange(true);
              }}
              className={`flex flex-col items-center flex-shrink-0 transition-all duration-300 ${
                showSuggested
                  ? 'scale-105'
                  : 'hover:opacity-100'
              }`}
              data-testid="button-category-suggested"
            >
              <div
                className={`w-16 h-16 rounded-2xl overflow-hidden mb-2 border-2 transition-all duration-300 ${
                  showSuggested
                    ? 'border-amber-500 shadow-lg ring-4 ring-amber-500/10'
                    : 'border-transparent bg-muted/80'
                }`}
              >
                <div className="w-full h-full bg-gradient-to-br from-amber-400/20 to-amber-500/40 flex items-center justify-center">
                  <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
                </div>
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-bold text-center max-w-16 line-clamp-2 leading-tight h-6 flex items-center justify-center break-words ${showSuggested ? 'text-amber-600' : 'text-muted-foreground'}`}>
                {t('suggested')}
              </span>
            </button>
          )}

          {categories
            .filter((category: any) => category.isActive)
            .map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onSelectCategory(category.id);
                  onShowSuggestedChange(false);
                }}
                className={`flex flex-col items-center flex-shrink-0 transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'scale-105'
                    : 'hover:opacity-100'
                }`}
                data-testid={`button-category-${category.id}`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl overflow-hidden mb-2 border-2 transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'border-primary shadow-lg ring-4 ring-primary/10'
                      : 'border-transparent bg-muted/80'
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
                <span className={`text-[10px] uppercase tracking-wider font-bold text-center max-w-16 line-clamp-2 leading-tight h-6 flex items-center justify-center break-words ${selectedCategory === category.id ? 'text-primary' : 'text-muted-foreground'}`}>
                  {getCategoryName(category)}
                </span>
              </button>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex items-center justify-between gap-3 px-4 pb-4">
        {settings?.menuShowFoodType && (
          <div
            className="flex-1 flex gap-2 overflow-x-auto no-scrollbar touch-pan-x"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {[...foodTypes].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((type) => {
              const IconComponent = getDynamicIcon(type.icon);
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
        )}

        {settings?.menuShowViewSwitcher && (
          <div className="relative flex items-center bg-muted/30 p-1 rounded-xl border border-border/40 ml-2">
            {/* Animated background indicator */}
            <motion.div
              className="absolute bg-primary shadow-sm rounded-lg"
              initial={false}
              animate={{
                x: viewMode === 'list' ? 0 : (isRtl ? -36 : 36),
              }}
              style={{
                width: 32,
                height: 32
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            
            <div className="flex relative z-10 gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onViewModeChange('list')}
                className={`h-8 w-8 rounded-lg transition-colors duration-200 ${
                  viewMode === 'list' ? 'text-primary-foreground' : 'text-muted-foreground/60'
                }`}
                data-testid="button-view-list"
              >
                <LayoutList className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onViewModeChange('grid')}
                className={`h-8 w-8 rounded-lg transition-colors duration-200 ${
                  viewMode === 'grid' ? 'text-primary-foreground' : 'text-muted-foreground/60'
                }`}
                data-testid="button-view-grid"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {settings?.menuShowSearchBar && (
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors ${isRtl ? 'right-3 scale-x-[-1]' : 'left-3'}`} />
            <input
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`rounded-full bg-muted/50 border-none focus-visible:ring-primary/20 transition-all text-start w-full h-10 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
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
