import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, Instagram, Send } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import RestaurantHeader from '@/components/menu/RestaurantHeader';
import CategoryTabs from '@/components/menu/CategoryTabs';
import MenuList from '@/components/menu/MenuList';
import ItemDetailModal from '@/components/menu/ItemDetailModal';
import CartView from '@/components/menu/CartView';
import LanguageSelector from '@/components/menu/LanguageSelector';
import ThemeToggle from '@/components/ThemeToggle';
import CookingLoader from '@/components/menu/CookingLoader';
import { useLanguage } from '@/hooks/use-language';
import type { MenuItem, CartItem, Category, FoodType, Settings } from '@/lib/types';

export default function MenuPage() {
  const [, setLocation] = useLocation();
  const { language, setLanguage, t, dir } = useLanguage();
  const isRtl = dir === 'rtl';
  const BackArrow = ArrowLeft;

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showSuggested, setShowSuggested] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCartView, setShowCartView] = useState(false);

  const { data: settings } = useQuery<Settings>({
    queryKey: ['/api/settings'],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: menuItems = [], isLoading: menuItemsLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/items'],
  });

  const { data: foodTypes = [], isLoading: foodTypesLoading } = useQuery<FoodType[]>({
    queryKey: ['/api/food-types'],
  });

  const { data: allLanguages = [], isLoading: languagesLoading } = useQuery<any[]>({
    queryKey: ['/api/languages'],
  });

  useEffect(() => {
    if (!menuItemsLoading && !foodTypesLoading && !languagesLoading) {
      const timer = setTimeout(() => {
        setIsPageLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [menuItemsLoading, foodTypesLoading, languagesLoading]);

  useEffect(() => {
    if (settings?.menuDefaultTheme) {
      const isDark = settings.menuDefaultTheme === 'dark';
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, [settings?.menuDefaultTheme]);

  const handleSelectType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleAddToCart = (item: MenuItem, quantity: number, notes: string = '') => {
    setCartItems((prev) => {
      const existingItem = prev.find((ci) => ci.item.id === item.id && ci.notes === notes);
      if (existingItem) {
        return prev.map((ci) =>
          ci === existingItem
            ? { ...ci, quantity: ci.quantity + quantity }
            : ci
        );
      }
      return [...prev, { id: `${item.id}-${Date.now()}`, item, quantity, notes }];
    });
  };

  const handleAddToCartFromCard = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.id !== cartItemId));
  };

  const handlePlaceOrder = () => {
    alert(`Order placed with ${cartItems.length} items for $${cartTotal.toFixed(2)}`);
    setCartItems([]);
    setShowCartView(false);
  };

  const cartTotal = cartItems.reduce(
    (sum, ci) => sum + (Number(ci.item.discountedPrice) || Number(ci.item.price)) * ci.quantity,
    0
  );

  const restaurantData = {
    name: settings?.restaurantName || '',
    description: settings?.restaurantDescription || '',
    address: settings?.restaurantAddress || '',
    phone: settings?.restaurantPhone || '',
    hours: settings?.restaurantHours || '',
  };

  const backgroundStyle = settings?.menuBackgroundType === 'color' 
    ? { backgroundColor: settings.menuBackgroundColor }
    : settings?.menuBackgroundType === 'gradient'
    ? { background: `linear-gradient(to bottom, ${settings.menuGradientStart}, ${settings.menuGradientEnd})` }
    : settings?.menuBackgroundType === 'image'
    ? { backgroundImage: `url(${settings.menuBackgroundImage})`, backgroundSize: 'cover', backgroundAttachment: 'fixed' }
    : {};

  if (isPageLoading) {
    return <CookingLoader />;
  }

  return (
    <div className="min-h-screen bg-background" style={backgroundStyle}>
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b" dir="ltr">
        <div className="flex items-center justify-between gap-2 p-2">
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setLocation('/qr')}
              data-testid="button-back"
            >
              <BackArrow className="w-5 h-5" />
            </Button>
            {settings?.showMenuInstagram && settings?.restaurantInstagram && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => window.open(settings.restaurantInstagram, '_blank')}
                data-testid="button-instagram"
              >
                <Instagram className="w-4 h-4" />
              </Button>
            )}
            {settings?.showMenuWhatsapp && settings?.restaurantWhatsapp && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => window.open(`https://wa.me/${settings.restaurantWhatsapp?.replace(/\D/g, '')}`, '_blank')}
                data-testid="button-whatsapp"
              >
                <FaWhatsapp className="w-4 h-4" />
              </Button>
            )}
            {settings?.showMenuTelegram && settings?.restaurantTelegram && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => window.open(settings.restaurantTelegram, '_blank')}
                data-testid="button-telegram"
              >
                <Send className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-1">
            {settings?.showMenuLanguageSelector && (
              <LanguageSelector language={language} onLanguageChange={setLanguage} />
            )}
            {settings?.showMenuThemeSwitcher && <ThemeToggle defaultTheme={settings?.menuDefaultTheme as 'light' | 'dark' | undefined} />}
          </div>
        </div>
      </div>

      <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'font-vazir' : ''}>
        <RestaurantHeader 
          restaurant={restaurantData as any} 
          language={language} 
          settings={settings}
        />
  
        {settings?.menuShowMenu && (
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
            settings={settings}
          />
        )}
  
        <MenuList
          items={menuItems}
          categories={categories}
          selectedCategory={selectedCategory}
          language={language}
          onItemClick={setSelectedItem}
          onAddToCart={handleAddToCartFromCard}
          selectedTypes={selectedTypes}
          viewMode={viewMode}
          showSuggested={showSuggested}
          searchQuery={searchQuery}
          settings={settings}
        />
      </div>
    
      <ItemDetailModal
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        language={language}
        onAddToCart={handleAddToCart}
        settings={settings}
      />

      <CartView
        open={showCartView}
        onClose={() => setShowCartView(false)}
        cartItems={cartItems}
        language={language}
        onRemoveItem={handleRemoveFromCart}
        onPlaceOrder={handlePlaceOrder}
      />

      <footer className="py-4 mt-auto border-t bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1.5  tracking-widest font-medium">
            <span>{t('poweredBy')}</span>
            <a 
              href="https://qrdish.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-primary hover:underline transition-all"
            >
              QRdish
            </a>
          </p>
        </div>
      </footer>

      {cartItems.length > 0 && settings?.menuShowBuyButton && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            size="lg"
            className="rounded-full gap-3 shadow-lg"
            onClick={() => setShowCartView(true)}
            data-testid="button-cart"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>{cartItems.length} {t('cart')}</span>
            <span className="font-semibold">
              {settings?.currencyPosition === 'before' ? settings?.currencySymbol : ''}
              {cartTotal.toFixed(2)}
              {settings?.currencyPosition === 'after' ? settings?.currencySymbol : ''}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
