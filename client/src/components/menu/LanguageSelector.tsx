import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Language } from '@/lib/types';
import { translations } from '@/lib/types';

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const languageFlags: Record<Language, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  fr: '🇫🇷',
};

export default function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  const t = translations[language];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" data-testid="button-language-selector">
          <Globe className="h-4 w-4 mr-2" />
          <span className="text-sm">{languageFlags[language]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onLanguageChange('en')}
          data-testid="menu-item-language-en"
        >
          <span className="mr-2">{languageFlags.en}</span> {t.english}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onLanguageChange('es')}
          data-testid="menu-item-language-es"
        >
          <span className="mr-2">{languageFlags.es}</span> {t.spanish}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onLanguageChange('fr')}
          data-testid="menu-item-language-fr"
        >
          <span className="mr-2">{languageFlags.fr}</span> {t.french}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
