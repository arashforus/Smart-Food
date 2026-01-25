import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = stored === 'dark' || (!stored && prefersDark);
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

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
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: newValue 
            ? '::view-transition-new(root)' 
            : '::view-transition-old(root)',
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
