import React, { useState } from 'react';
import { ActiveTab, Language } from '../types';
import { translations } from '../translations';
import { useAuth } from '../contexts/AuthContext';
import {
  Sparkles,
  Globe,
  FolderHeart,
  LogIn,
  LogOut,
  ShieldCheck,
  User as UserIcon,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageToggle: () => void;
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  savedCount: number;
  onOpenAuthModal: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageToggle,
  activeTab,
  onNavigate,
  savedCount,
  onOpenAuthModal,
  onShowToast,
}) => {
  const t = translations[language];
  const { user, profile, isAdmin, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserDropdown(false);
      onShowToast('info', language === 'hi' ? 'सफलतापूर्वक लॉगआउट हो गया।' : 'Logged out successfully.');
      onNavigate('home');
    } catch {
      onShowToast('error', t.common.error);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-blue-100 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-hidden shrink-0"
          aria-label={t.appName}
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-active:scale-95 transition-transform">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight leading-none">
                Daily Earn
              </span>
              <span className="bg-blue-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-sm tracking-wider uppercase">
                PRO
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
              {language === 'hi' ? 'क्रिएटर व कमाई स्टूडियो' : 'Creator & Earning Studio'}
            </p>
          </div>
        </button>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Admin Dashboard Badge Button (Visible ONLY to verified Admin) */}
          {isAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-slate-900 border-amber-600 shadow-sm'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800 hover:bg-amber-200'
              }`}
              title="Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* User Auth: Login or Account Pill */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-slate-700 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-slate-700 transition-all max-w-[130px] sm:max-w-[160px]"
              >
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  {(profile?.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
                <span className="truncate text-[11px]">
                  {profile?.displayName || user.email?.split('@')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              {/* Account Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <p className="text-[11px] font-medium text-slate-400">
                      {t.auth.loggedInAs}
                    </p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user.email}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {isAdmin ? t.auth.adminBadge : t.auth.userBadge}
                    </span>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onNavigate('admin');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-500" />
                      <span>{language === 'hi' ? 'एडमिन डैशबोर्ड' : 'Admin Dashboard'}</span>
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.auth.logout}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t.auth.login}</span>
            </button>
          )}

          {/* Quick Work Vault Shortcut */}
          <button
            onClick={() => onNavigate('work')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-200 active:scale-95 transition-all"
            title={t.tabs.work}
          >
            <FolderHeart className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            {savedCount > 0 && (
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* Language Toggle Button */}
          <button
            onClick={onLanguageToggle}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 active:scale-95 transition-all shrink-0"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{language === 'hi' ? 'EN' : 'हिं'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
