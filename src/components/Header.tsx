import React from 'react';
import { ActiveTab, Language } from '../types';
import { translations } from '../translations';
import { Sparkles, Globe, FolderHeart } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageToggle: () => void;
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageToggle,
  onNavigate,
  savedCount,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-blue-100 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          aria-label={t.appName}
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-active:scale-95 transition-transform">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight leading-none">
                Daily Earn
              </span>
              <span className="bg-blue-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-sm tracking-wider uppercase">
                PRO
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
              {language === 'hi' ? 'क्रिएटर व कमाई स्टूडियो' : 'Creator & Earning Studio'}
            </p>
          </div>
        </button>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Work Vault Shortcut */}
          <button
            onClick={() => onNavigate('work')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-slate-700 text-xs font-semibold hover:bg-blue-100 active:scale-95 transition-all"
            title={t.tabs.work}
          >
            <FolderHeart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">{t.tabs.work}</span>
            {savedCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* Language Toggle Button */}
          <button
            onClick={onLanguageToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 active:scale-95 transition-all"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
