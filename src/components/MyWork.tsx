import React, { useState } from 'react';
import { SavedProject, Language, ActiveTab, PosterConfig, ThumbnailConfig, CaptionItem } from '../types';
import { translations } from '../translations';
import { getStorageUsageKB } from '../services/storage';
import {
  FolderHeart,
  LayoutTemplate,
  Youtube,
  Type,
  Trash2,
  ExternalLink,
  Download,
  Copy,
  PlusCircle,
  HardDrive,
  AlertTriangle,
  X,
} from 'lucide-react';

interface MyWorkProps {
  language: Language;
  projects: SavedProject[];
  onDeleteProject: (id: string) => void;
  onClearAll: () => void;
  onReopenProject: (project: SavedProject) => void;
  onNavigate: (tab: ActiveTab) => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const MyWork: React.FC<MyWorkProps> = ({
  language,
  projects,
  onDeleteProject,
  onClearAll,
  onReopenProject,
  onNavigate,
  onShowToast,
}) => {
  const t = translations[language];
  const [filter, setFilter] = useState<'all' | 'poster' | 'thumbnail' | 'caption'>('all');
  const [projectToDelete, setProjectToDelete] = useState<SavedProject | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filtered = projects.filter((p) => {
    if (filter === 'all') return true;
    return p.type === filter;
  });

  const storageKB = getStorageUsageKB();

  const handleDownloadImage = (p: SavedProject) => {
    if (!p.previewUrl) return;
    const link = document.createElement('a');
    link.href = p.previewUrl;
    link.download = `${p.type}-${p.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('success', t.poster.downloadSuccess);
  };

  const handleCopyCaption = (p: SavedProject) => {
    const data = p.data as CaptionItem;
    const text = `${data.caption}\n\n${(data.hashtags || []).join(' ')}`;
    navigator.clipboard.writeText(text);
    onShowToast('success', t.caption.copied);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                <FolderHeart className="w-5 h-5" />
              </span>
              {t.work.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t.work.subtitle}
            </p>
          </div>

          {projects.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2.5 py-1.5 rounded-lg transition-all"
            >
              {t.work.clearAll}
            </button>
          )}
        </div>

        {/* Storage Bar Indicator */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <HardDrive className="w-4 h-4 text-blue-500" />
            <span>{t.work.storageUsage}:</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {storageKB} KB
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {projects.length} {language === 'hi' ? 'आइटम सेव हैं' : 'items saved'}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: t.work.all, count: projects.length },
            { id: 'poster', label: t.work.posters, count: projects.filter((p) => p.type === 'poster').length },
            { id: 'thumbnail', label: t.work.thumbnails, count: projects.filter((p) => p.type === 'thumbnail').length },
            { id: 'caption', label: t.work.captions, count: projects.filter((p) => p.type === 'caption').length },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              className={`py-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                filter === item.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{item.label}</span>
              <span className="ml-1.5 text-[10px] opacity-80 font-mono">({item.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Projects List or Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 mb-3">
            <FolderHeart className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            {t.work.noItems}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-5">
            {t.work.noItemsSub}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => onNavigate('poster')}
              className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
            >
              <LayoutTemplate className="w-4 h-4" />
              <span>{t.tabs.poster}</span>
            </button>
            <button
              onClick={() => onNavigate('thumbnail')}
              className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5"
            >
              <Youtube className="w-4 h-4" />
              <span>{t.tabs.thumbnail}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              {/* Media Preview or Caption Icon */}
              {item.previewUrl ? (
                <div
                  className={`relative w-full bg-slate-950 flex items-center justify-center overflow-hidden ${
                    item.type === 'poster' ? 'aspect-square' : 'aspect-video'
                  }`}
                >
                  <img
                    src={item.previewUrl}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {item.type}
                  </span>
                </div>
              ) : (
                <div className="p-4 bg-linear-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800/80 border-b border-slate-100 dark:border-slate-800">
                  <span className="inline-flex items-center gap-1 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">
                    <Type className="w-3 h-3" />
                    Caption
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-3 italic">
                    {(item.data as CaptionItem).caption}
                  </p>
                </div>
              )}

              {/* Card Meta & Controls */}
              <div className="p-3.5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(item.createdAt).toLocaleDateString(
                        language === 'hi' ? 'hi-IN' : 'en-US',
                        { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
                      )}
                    </p>
                  </div>
                </div>

                {/* Card Action Row */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => onReopenProject(item)}
                    className="flex-1 py-2 px-2 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{t.work.reopenEdit}</span>
                  </button>

                  {item.previewUrl ? (
                    <button
                      onClick={() => handleDownloadImage(item)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 active:scale-95 transition-all"
                      title={t.common.download}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCopyCaption(item)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 active:scale-95 transition-all"
                      title={t.common.copy}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => setProjectToDelete(item)}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 active:scale-95 transition-all"
                    title={t.common.delete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {t.work.deleteConfirmTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {t.work.deleteConfirmMsg}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setProjectToDelete(null)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
              >
                {t.work.cancel}
              </button>
              <button
                onClick={() => {
                  onDeleteProject(projectToDelete.id);
                  setProjectToDelete(null);
                  onShowToast('success', t.work.deletedSuccess);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                {t.work.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {t.work.clearAll}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {t.work.clearAllConfirm}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
              >
                {t.work.cancel}
              </button>
              <button
                onClick={() => {
                  onClearAll();
                  setShowClearConfirm(false);
                  onShowToast('success', language === 'hi' ? 'सारा डाटा साफ़ कर दिया गया' : 'All saved data cleared');
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                {t.work.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
