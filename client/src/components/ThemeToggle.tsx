import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';

interface ThemeToggleProps {
  defaultTheme?: 'light' | 'dark';
}

export default function ThemeToggle({ defaultTheme }: ThemeToggleProps = {}) {
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let shouldBeDark: boolean;
    if (defaultTheme !== undefined) {
      shouldBeDark = defaultTheme === 'dark';
    } else {
      const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      shouldBeDark = stored === 'dark' || (!stored && prefersDark);
    }
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, [defaultTheme]);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newValue = !isDark;
    
    // Check if the browser supports the View Transition API
    if (!document.startViewTransition) {
      setIsDark(newValue);
      document.documentElement.classList.toggle('dark', newValue);
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      return;
    }

    const rect = buttonRef.current!.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setIsDark(newValue);
      document.documentElement.classList.toggle('dark', newValue);
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 300,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          // We always reveal the "new" theme (incoming) using the circle
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  return (
    <Button
      ref={buttonRef}
      size="icon"
      variant="ghost"
      onClick={toggle}
      data-testid="button-theme-toggle"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
