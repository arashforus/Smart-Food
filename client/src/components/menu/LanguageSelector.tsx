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
import { useQuery } from '@tanstack/react-query';

const FLAG_URLS: Record<string, string> = {
  en: 'https://flagcdn.com/w40/gb.png',
  fa: 'https://flagcdn.com/w40/ir.png',
  tr: 'https://flagcdn.com/w40/tr.png',
  ar: 'https://flagcdn.com/w40/sa.png',
  ru: 'https://flagcdn.com/w40/ru.png',
  es: 'https://flagcdn.com/w40/es.png',
  fr: 'https://flagcdn.com/w40/fr.png',
};

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  const t = translations[language];

  const { data: languages = [] } = useQuery<any[]>({
    queryKey: ['/api/languages'],
  });

  const activeLanguages = languages.filter(l => l.isActive);
  const currentLang = activeLanguages.find((l) => l.code === language);
  const flagUrl = FLAG_URLS[language] || currentLang?.flagImage;

  if (activeLanguages.length <= 1) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" data-testid="button-language-selector" className="gap-2">
          {flagUrl ? (
            <img src={flagUrl} alt="" className="w-5 h-4 object-contain shadow-sm rounded-sm" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">{currentLang?.code?.toUpperCase() || language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {activeLanguages.map((lang) => {
          const itemFlagUrl = FLAG_URLS[lang.code] || lang.flagImage;
          return (
            <DropdownMenuItem
              key={lang.id}
              onClick={() => onLanguageChange(lang.code as Language)}
              data-testid={`menu-item-language-${lang.code}`}
              className="flex items-center gap-2"
            >
              {itemFlagUrl ? (
                <img src={itemFlagUrl} alt="" className="w-5 h-4 object-contain shadow-sm rounded-sm" />
              ) : (
                <span className="text-xs font-medium text-muted-foreground w-5 text-center">
                  {lang.code.toUpperCase()}
                </span>
              )}
              <span>{lang.name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
