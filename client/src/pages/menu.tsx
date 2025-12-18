import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react';
import { SiInstagram, SiWhatsapp, SiTelegram } from 'react-icons/si';
import RestaurantHeader from '@/components/menu/RestaurantHeader';
import CategoryTabs from '@/components/menu/CategoryTabs';
import MenuList from '@/components/menu/MenuList';
import ItemDetailModal from '@/components/menu/ItemDetailModal';
import LanguageSelector from '@/components/menu/LanguageSelector';
import ThemeToggle from '@/components/ThemeToggle';
import { mockRestaurant, mockCategories, mockMenuItems, mockFoodTypes } from '@/lib/mockData';
import { translations } from '@/lib/types';
import type { MenuItem, Language, CartItem } from '@/lib/types';

export default function MenuPage() {
  const [, setLocation] = useLocation();
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('menuLanguage') as Language;
    return stored || 'en';
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showSuggested, setShowSuggested] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    localStorage.setItem('menuLanguage', language);
  }, [language]);

  const restaurant = mockRestaurant;
  const categories = mockCategories;
  const menuItems = mockMenuItems;
  const foodTypes = mockFoodTypes;
  const t = translations[language] || translations.en;

  const isRtl = language === 'fa';
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  const handleSelectType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleAddToCart = (item: MenuItem, quantity: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((ci) => ci.item.id === item.id);
      if (existingItem) {
        return prev.map((ci) =>
          ci.item.id === item.id
            ? { ...ci, quantity: ci.quantity + quantity }
            : ci
        );
      }
      return [...prev, { id: `${item.id}-${Date.now()}`, item, quantity }];
    });
  };

  const cartTotal = cartItems.reduce(
    (sum, ci) => sum + (ci.item.discountedPrice || ci.item.price) * ci.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className={`flex items-center justify-between gap-2 p-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setLocation('/')}
              data-testid="button-back"
            >
              <BackArrow className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => window.open('https://instagram.com', '_blank')}
              data-testid="button-instagram"
            >
              <SiInstagram className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => window.open('https://wa.me/', '_blank')}
              data-testid="button-whatsapp"
            >
              <SiWhatsapp className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => window.open('https://t.me/', '_blank')}
              data-testid="button-telegram"
            >
              <SiTelegram className="w-4 h-4" />
            </Button>
          </div>
          <div className={`flex items-center gap-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <LanguageSelector language={language} onLanguageChange={setLanguage} />
            <ThemeToggle />
          </div>
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
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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
        searchQuery={searchQuery}
      />

      <ItemDetailModal
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        language={language}
        onAddToCart={handleAddToCart}
      />

      {cartItems.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40" dir={isRtl ? 'rtl' : 'ltr'}>
          <Button
            size="lg"
            className="rounded-full gap-3 shadow-lg"
            onClick={() => {}}
            data-testid="button-cart"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>{cartItems.length} {t.cart}</span>
            <span className="font-semibold">${cartTotal.toFixed(2)}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
