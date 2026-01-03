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

  if (activeLanguages.length <= 1) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" data-testid="button-language-selector">
          <Globe className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">{currentLang?.code?.toUpperCase() || language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {activeLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.id}
            onClick={() => onLanguageChange(lang.code as Language)}
            data-testid={`menu-item-language-${lang.code}`}
          >
            <span className="mr-2 text-xs font-medium text-muted-foreground">{lang.code.toUpperCase()}</span> {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
