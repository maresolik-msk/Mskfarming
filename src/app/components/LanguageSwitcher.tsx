import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'te' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors border border-primary/20"
      title={i18n.language === 'en' ? 'Switch to Telugu' : 'Switch to English'}
    >
      <span className="text-sm font-medium text-primary">
        {i18n.language === 'en' ? '🇮🇳 తెలుగు' : '🇬🇧 English'}
      </span>
    </button>
  );
}
