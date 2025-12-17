import { Globe, User, LogOut, Settings, Key, ChevronDown, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import ThemeToggle from '@/components/ThemeToggle';
import type { User as UserType, Branch, Language } from '@/lib/types';
import { translations, roleLabels } from '@/lib/types';

interface AdminHeaderProps {
  user: UserType;
  branches: Branch[];
  selectedBranch: string;
  onBranchChange: (branchId: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onProfileClick: () => void;
  onPasswordClick: () => void;
  onSignOut: () => void;
}

const languageOptions: { code: Language; shortCode: string; name: string }[] = [
  { code: 'en', shortCode: 'EN', name: 'English' },
  { code: 'es', shortCode: 'ES', name: 'Español' },
  { code: 'fr', shortCode: 'FR', name: 'Français' },
  { code: 'fa', shortCode: 'FA', name: 'فارسی' },
  { code: 'tr', shortCode: 'TR', name: 'Türkçe' },
];

export default function AdminHeader({
  user,
  branches,
  selectedBranch,
  onBranchChange,
  language,
  onLanguageChange,
  onProfileClick,
  onPasswordClick,
  onSignOut,
}: AdminHeaderProps) {
  const t = translations[language];
  const initials = user.name.split(' ').map((n) => n[0]).join('').toUpperCase();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-2 border-b bg-background px-3 py-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger data-testid="button-admin-sidebar-toggle" />
      </div>

      <div className="flex-1 flex justify-center px-2">
        <Select value={selectedBranch} onValueChange={onBranchChange}>
          <SelectTrigger className="w-auto max-w-[200px] gap-2" data-testid="select-branch">
            <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <SelectValue placeholder="Select Branch" />
          </SelectTrigger>
          <SelectContent>
            {branches.filter(b => b.isActive).map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" data-testid="button-language-admin">
              <Globe className="h-4 w-4" />
              <span className="ml-1 text-xs hidden sm:inline">
                {languageOptions.find((l) => l.code === language)?.shortCode}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languageOptions.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                data-testid={`menu-item-lang-${lang.code}`}
              >
                <span className="mr-2 text-xs font-medium text-muted-foreground">{lang.shortCode}</span> {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 pr-1" data-testid="button-profile-dropdown">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm">{t.hello}, {user.name.split(' ')[0]}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <Badge variant="secondary" className="w-fit mt-1 no-default-active-elevate">
                  {roleLabels[user.role]}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onProfileClick} data-testid="menu-item-profile">
              <User className="mr-2 h-4 w-4" />
              {t.profile}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onPasswordClick} data-testid="menu-item-password">
              <Key className="mr-2 h-4 w-4" />
              {t.changePassword}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut} className="text-destructive" data-testid="menu-item-signout">
              <LogOut className="mr-2 h-4 w-4" />
              {t.signOut}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
