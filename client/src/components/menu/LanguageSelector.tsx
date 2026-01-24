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
  en: 'https://flagcdn.com/w80/gb.png',
  fa: 'https://flagcdn.com/w80/ir.png',
  tr: 'https://flagcdn.com/w80/tr.png',
  ar: 'https://flagcdn.com/w80/sa.png',
  ru: 'https://flagcdn.com/w80/ru.png',
  es: 'https://flagcdn.com/w80/es.png',
  fr: 'https://flagcdn.com/w80/fr.png',
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
  const flagUrl = currentLang?.flagImage || FLAG_URLS[language];

  if (activeLanguages.length <= 1) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" data-testid="button-language-selector" className="gap-2 flex items-center">
          {flagUrl ? (
            <div className="w-5 h-5 flex items-center justify-center overflow-hidden rounded-sm shadow-sm border border-border/50 shrink-0">
              <img src={flagUrl} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <Globe className="h-4 w-4 shrink-0" />
          )}
          <span className="text-sm font-medium leading-none ">{currentLang?.code?.toUpperCase() || language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {activeLanguages.map((lang) => {
          const itemFlagUrl = lang.flagImage || FLAG_URLS[lang.code];
          return (
            <DropdownMenuItem
              key={lang.id}
              onClick={() => onLanguageChange(lang.code as Language)}
              data-testid={`menu-item-language-${lang.code}`}
              className="flex items-center gap-3 py-2 cursor-pointer"
            >
              <div className="w-6 h-6 flex items-center justify-center overflow-hidden rounded-sm shadow-sm border border-border/50 bg-muted shrink-0">
                {itemFlagUrl ? (
                  <img src={itemFlagUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {lang.code.toUpperCase()}
                  </span>
                )}
              </div>
              <span className="font-medium leading-none">{lang.name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
