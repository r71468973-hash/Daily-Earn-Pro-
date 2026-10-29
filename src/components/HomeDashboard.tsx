import React, { useState } from 'react';
import { ActiveTab, Language, SavedProject } from '../types';
import { translations } from '../translations';
import { AdMobPlaceholder } from './AdMobPlaceholder';
import { useAuth } from '../contexts/AuthContext';
import { shareApp } from '../services/shareService';
import {
  Sparkles,
  LayoutTemplate,
  Youtube,
  Type,
  TrendingUp,
  FolderHeart,
  ArrowRight,
  ShieldAlert,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Star,
  LogIn,
  ShieldCheck,
  UserCheck,
  Share2,
  CheckCircle2,
} from 'lucide-react';

interface HomeDashboardProps {
  language: Language;
  onNavigate: (tab: ActiveTab) => void;
  savedProjects: SavedProject[];
  onReopenProject: (project: SavedProject) => void;
  onOpenAuthModal?: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  language,
  onNavigate,
  savedProjects,
  onReopenProject,
  onOpenAuthModal,
  onShowToast,
}) => {
  const t = translations[language];
  const { user, isAdmin } = useAuth();
  const [sharing, setSharing] = useState(false);

  const handleShareApp = async () => {
    try {
      setSharing(true);
      const res = await shareApp(language);
      if (res.message) {
        onShowToast(res.success ? 'success' : 'error', res.message);
      }
    } catch (err: any) {
      onShowToast('error', language === 'hi' ? 'शेयर करने में त्रुटि हुई' : 'Failed to share');
    } finally {
      setSharing(false);
    }
  };

  const tools = [
    {
      id: 'poster' as ActiveTab,
      title: t.home.posterMakerTitle,
      desc: t.home.posterMakerDesc,
      icon: LayoutTemplate,
      color: 'bg-blue-600',
      badge: '1:1 Square',
      accent: 'border-blue-200 dark:border-blue-900',
    },
    {
      id: 'thumbnail' as ActiveTab,
      title: t.home.thumbnailMakerTitle,
      desc: t.home.thumbnailMakerDesc,
      icon: Youtube,
      color: 'bg-rose-600',
      badge: '16:9 CTR',
      accent: 'border-rose-200 dark:border-rose-900',
    },
    {
      id: 'caption' as ActiveTab,
      title: t.home.captionGeneratorTitle,
      desc: t.home.captionGeneratorDesc,
      icon: Type,
      color: 'bg-indigo-600',
      badge: language === 'hi' ? 'वायरल टैग्स' : 'Trending Tags',
      accent: 'border-indigo-200 dark:border-indigo-900',
    },
    {
      id: 'earning' as ActiveTab,
      title: t.home.earningGuideTitle,
      desc: t.home.earningGuideDesc,
      icon: TrendingUp,
      color: 'bg-emerald-600',
      badge: language === 'hi' ? 'कमाई सीखें' : 'Earn Money',
      accent: 'border-emerald-200 dark:border-emerald-900',
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-700 via-blue-600 to-indigo-800 text-white p-5 sm:p-7 shadow-xl shadow-blue-700/20">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold text-blue-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Daily Earn Pro • Android Edition</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight">
            {t.home.welcome}
          </h1>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-lg">
            {t.home.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('poster')}
              className="py-3 px-5 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 active:scale-95 font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>{t.home.startCreating}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('earning')}
              className="py-3 px-4 rounded-2xl bg-white/15 hover:bg-white/20 backdrop-blur-md text-white active:scale-95 font-bold text-xs sm:text-sm border border-white/25 transition-all flex items-center gap-1.5"
            >
              <span>{t.home.learnHow}</span>
            </button>

            {/* Quick Hero Share Button */}
            <button
              onClick={handleShareApp}
              disabled={sharing}
              className="py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-900 font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 disabled:opacity-75"
              title={t.home.shareApp}
            >
              <Share2 className="w-4 h-4 text-slate-900" />
              <span>{t.home.shareApp}</span>
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {t.home.statSaved}
          </p>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5 font-mono">
            {savedProjects.length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {t.home.statIncomeEst}
          </p>
          <p className="text-xs sm:text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {t.home.statIncomeVal}
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Offline Capability
            </p>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
              100% On-Device
            </p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Admin Access Quick Banner (Only for Verified Admin) */}
      {isAdmin && (
        <div className="bg-linear-to-r from-amber-500/15 via-amber-400/10 to-transparent border border-amber-300 dark:border-amber-800/80 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                {language === 'hi' ? 'एडमिन विशेषाधिकार सक्रिय (Admin Access)' : 'Verified Admin Privileges Active'}
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400">
                {language === 'hi' ? 'कुल यूजर्स और सिस्टम एनालिटिक्स देखने के लिए टैप करें' : 'Tap to inspect live user stats & system metrics'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('admin')}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 text-xs font-bold transition-all shrink-0"
          >
            {language === 'hi' ? 'डैशबोर्ड खोलें' : 'Open Admin'}
          </button>
        </div>
      )}

      {/* Login Invitation Banner (When Unauthenticated) */}
      {!user && onOpenAuthModal && (
        <div className="bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? 'क्लाउड सिंक के लिए लॉगिन करें' : 'Sign In to Daily Earn Pro'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'hi' ? 'अपने डिजाइन्स और प्रोफाइल को सुरक्षित रखें' : 'Safely backup and access your creations anywhere'}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAuthModal}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold transition-all shrink-0 shadow-xs"
          >
            {language === 'hi' ? 'लॉगिन / साइन अप' : 'Login / Sign Up'}
          </button>
        </div>
      )}

      {/* Primary Tools Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-extrabold text-slate-900 dark:text-white text-base">
            {t.home.quickStart}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onNavigate(tool.id)}
                className={`p-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-800 text-left transition-all hover:shadow-md active:scale-98 flex items-start gap-3.5 group`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl ${tool.color} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                      {tool.title}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                      {tool.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dedicated Native Share App Card */}
      <div className="bg-linear-to-r from-blue-700 via-indigo-600 to-blue-800 text-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-blue-700/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold text-amber-300">
              <Share2 className="w-3 h-3" />
              <span>{language === 'hi' ? 'दोस्तों के साथ शेयर करें' : 'Share with Creators'}</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              {t.home.shareApp}
            </h3>
            <p className="text-xs text-blue-100 max-w-md leading-relaxed">
              {t.home.shareAppDesc}
            </p>
          </div>

          <button
            onClick={handleShareApp}
            disabled={sharing}
            className="py-3 px-6 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 active:scale-95 font-extrabold text-xs sm:text-sm shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-75"
            style={{ minHeight: '48px' }}
          >
            <Share2 className="w-4 h-4 text-blue-600" />
            <span>{language === 'hi' ? 'अभी शेयर करें (Share Now)' : 'Share Now'}</span>
          </button>
        </div>

        {/* Supported Channels Preview Pills */}
        <div className="pt-2.5 border-t border-white/20 flex flex-wrap items-center gap-2 text-[11px] text-blue-100 font-medium">
          <span className="opacity-80">{language === 'hi' ? 'उपलब्ध माध्यम:' : 'Supported via:'}</span>
          <span className="px-2.5 py-0.5 rounded-md bg-white/15 backdrop-blur-xs font-semibold">WhatsApp</span>
          <span className="px-2.5 py-0.5 rounded-md bg-white/15 backdrop-blur-xs font-semibold">Telegram</span>
          <span className="px-2.5 py-0.5 rounded-md bg-white/15 backdrop-blur-xs font-semibold">Gmail</span>
          <span className="px-2.5 py-0.5 rounded-md bg-white/15 backdrop-blur-xs font-semibold">Bluetooth</span>
          <span className="px-2.5 py-0.5 rounded-md bg-white/15 backdrop-blur-xs font-semibold">{language === 'hi' ? '+ अन्य सभी Apps' : '+ All Apps'}</span>
        </div>
      </div>

      {/* Recent Saved Work Carousel / Preview */}
      {savedProjects.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-1.5">
              <FolderHeart className="w-4 h-4 text-blue-600" />
              <span>{t.home.myWorkTitle}</span>
            </h3>
            <button
              onClick={() => onNavigate('work')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              <span>{language === 'hi' ? 'सभी देखें' : 'View all'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {savedProjects.slice(0, 4).map((p) => (
              <div
                key={p.id}
                onClick={() => onReopenProject(p)}
                className="cursor-pointer bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs hover:shadow-md transition-all active:scale-95"
              >
                {p.previewUrl ? (
                  <div className="aspect-square bg-slate-950 flex items-center justify-center overflow-hidden">
                    <img
                      src={p.previewUrl}
                      alt={p.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-indigo-50 dark:bg-slate-800 p-3 flex flex-col justify-center text-xs text-slate-700 dark:text-slate-300 italic">
                    <Type className="w-5 h-5 text-indigo-500 mb-1" />
                    <p className="line-clamp-3">{(p.data as any).caption}</p>
                  </div>
                )}
                <div className="p-2">
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                    {p.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Google AdMob Placeholder */}
      <AdMobPlaceholder language={language} />

      {/* Skill-Based Transparency Note */}
      <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p>{t.home.disclaimerNotice}</p>
      </div>
    </div>
  );
};
