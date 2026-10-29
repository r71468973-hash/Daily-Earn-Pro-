import React from 'react';
import { ActiveTab, Language } from '../types';
import { translations } from '../translations';
import {
  Home,
  LayoutTemplate,
  Youtube,
  Type,
  FolderHeart,
  TrendingUp,
  Settings,
  ShieldCheck,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  language: Language;
  isAdmin?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  language,
  isAdmin = false,
}) => {
  const t = translations[language];

  const navItems: { tab: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { tab: 'home', label: t.tabs.home, icon: Home },
    { tab: 'poster', label: t.tabs.poster, icon: LayoutTemplate },
    { tab: 'thumbnail', label: t.tabs.thumbnail, icon: Youtube },
    { tab: 'caption', label: t.tabs.caption, icon: Type },
    { tab: 'work', label: t.tabs.work, icon: FolderHeart },
    { tab: 'earning', label: t.tabs.earning, icon: TrendingUp },
    { tab: 'settings', label: t.tabs.settings, icon: Settings },
  ];

  if (isAdmin) {
    navItems.push({
      tab: 'admin',
      label: t.tabs.admin || 'Admin',
      icon: ShieldCheck,
    });
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom,0px)] shadow-lg shadow-slate-900/10"
      aria-label="Main Navigation"
    >
      <div className="max-w-4xl mx-auto px-1 flex items-center justify-around overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.tab;
          const Icon = item.icon;
          return (
            <button
              key={item.tab}
              onClick={() => onTabChange(item.tab)}
              className={`flex flex-col items-center justify-center py-2 px-1 min-w-[48px] sm:min-w-[58px] text-center transition-all relative select-none ${
                isActive
                  ? item.tab === 'admin'
                    ? 'text-amber-600 dark:text-amber-400 font-bold'
                    : 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
              style={{ minHeight: '56px' }}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive
                    ? item.tab === 'admin'
                      ? 'bg-amber-50 dark:bg-amber-950/60 scale-110 shadow-xs'
                      : 'bg-blue-50 dark:bg-blue-950/60 scale-110 shadow-xs'
                    : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] leading-tight mt-0.5 line-clamp-1 truncate max-w-[56px] sm:max-w-none">
                {item.label}
              </span>
              {isActive && (
                <span
                  className={`absolute bottom-1 w-4 h-0.5 rounded-full ${
                    item.tab === 'admin'
                      ? 'bg-amber-500 dark:bg-amber-400'
                      : 'bg-blue-600 dark:bg-blue-400'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
