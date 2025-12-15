import { useState } from 'react';
import LanguageSelector from '../menu/LanguageSelector';
import type { Language } from '@/lib/types';

export default function LanguageSelectorExample() {
  const [language, setLanguage] = useState<Language>('en');
  return <LanguageSelector language={language} onLanguageChange={setLanguage} />;
}
