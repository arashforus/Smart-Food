import { Heart } from 'lucide-react';

export default function AdminFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background px-4 py-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <p data-testid="text-copyright">
          © {year} Smart Food. All rights reserved.
        </p>
        <p className="flex items-center gap-1" data-testid="text-author">
          Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by{' '}
          <a href="https://arashsohrabi.com" target="_blank" rel="noopener noreferrer" className="hover:underline text-foreground">
            arashforus
          </a>
        </p>
      </div>
    </footer>
  );
}
