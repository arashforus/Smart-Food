import { useState, useEffect } from 'react';
import RestaurantHeader from '@/components/menu/RestaurantHeader';
import CategoryTabs from '@/components/menu/CategoryTabs';
import MenuList from '@/components/menu/MenuList';
import ItemDetailModal from '@/components/menu/ItemDetailModal';
import LanguageSelector from '@/components/menu/LanguageSelector';
import ThemeToggle from '@/components/ThemeToggle';
import { mockRestaurant, mockCategories, mockMenuItems } from '@/lib/mockData';
import type { MenuItem, Language } from '@/lib/types';

export default function MenuPage() {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('menuLanguage') as Language;
    return stored || 'en';
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    localStorage.setItem('menuLanguage', language);
  }, [language]);

  const restaurant = mockRestaurant;
  const categories = mockCategories;
  const menuItems = mockMenuItems;

  const isRtl = language === 'fa';

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className={`flex items-center justify-between p-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
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
      />

      <MenuList
        items={menuItems}
        categories={categories}
        selectedCategory={selectedCategory}
        language={language}
        onItemClick={setSelectedItem}
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
