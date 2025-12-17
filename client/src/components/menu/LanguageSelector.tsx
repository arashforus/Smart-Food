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

const languageOptions: { code: Language; shortCode: string; name: string }[] = [
  { code: 'en', shortCode: 'EN', name: 'English' },
  { code: 'es', shortCode: 'ES', name: 'Español' },
  { code: 'fr', shortCode: 'FR', name: 'Français' },
  { code: 'fa', shortCode: 'FA', name: 'فارسی' },
  { code: 'tr', shortCode: 'TR', name: 'Türkçe' },
];

export default function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  const t = translations[language];
  const currentLang = languageOptions.find((l) => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" data-testid="button-language-selector">
          <Globe className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">{currentLang?.shortCode}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languageOptions.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            data-testid={`menu-item-language-${lang.code}`}
          >
            <span className="mr-2 text-xs font-medium text-muted-foreground">{lang.shortCode}</span> {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
