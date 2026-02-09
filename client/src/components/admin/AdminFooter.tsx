import { Heart } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export default function AdminFooter() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background px-4 py-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <p data-testid="text-copyright">
          © {year} Smart Food. {t('footer_copyright')}
        </p>
        <p className="flex items-center gap-1" data-testid="text-author">
          {t('footer_made_with')} <Heart className="h-4 w-4 text-red-500 fill-red-500" /> {t('footer_by')}{' '}
          <a href="https://arashsohrabi.com" target="_blank" rel="noopener noreferrer" className="hover:underline text-foreground">
            arashforus
          </a>
        </p>
      </div>
    </footer>
  );
}
