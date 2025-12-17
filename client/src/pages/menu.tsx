import { useState, useEffect } from 'react';
import RestaurantHeader from '@/components/menu/RestaurantHeader';
import CategoryTabs from '@/components/menu/CategoryTabs';
import MenuList from '@/components/menu/MenuList';
import ItemDetailModal from '@/components/menu/ItemDetailModal';
import LanguageSelector from '@/components/menu/LanguageSelector';
import ThemeToggle from '@/components/ThemeToggle';
import { mockRestaurant, mockCategories, mockMenuItems, mockFoodTypes } from '@/lib/mockData';
import type { MenuItem, Language } from '@/lib/types';

export default function MenuPage() {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('menuLanguage') as Language;
    return stored || 'en';
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showSuggested, setShowSuggested] = useState(false);

  useEffect(() => {
    localStorage.setItem('menuLanguage', language);
  }, [language]);

  const restaurant = mockRestaurant;
  const categories = mockCategories;
  const menuItems = mockMenuItems;
  const foodTypes = mockFoodTypes;

  const isRtl = language === 'fa';

  const handleSelectType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className={`flex items-center justify-between gap-2 p-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <ThemeToggle />
          <LanguageSelector language={language} onLanguageChange={setLanguage} />
        </div>
      </div>

      <RestaurantHeader restaurant={restaurant} language={language} />

      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        language={language}
        foodTypes={foodTypes}
        selectedTypes={selectedTypes}
        onSelectType={handleSelectType}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showSuggested={showSuggested}
        onShowSuggestedChange={setShowSuggested}
      />

      <MenuList
        items={menuItems}
        categories={categories}
        selectedCategory={selectedCategory}
        language={language}
        onItemClick={setSelectedItem}
        selectedTypes={selectedTypes}
        viewMode={viewMode}
        showSuggested={showSuggested}
      />

      <ItemDetailModal
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        language={language}
      />
    </div>
  );
}
