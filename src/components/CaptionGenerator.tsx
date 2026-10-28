import React, { useState } from 'react';
import { CaptionItem, Language } from '../types';
import { translations } from '../translations';
import { getLocalCaptions } from '../services/templates';
import {
  Type,
  Copy,
  Check,
  Share2,
  BookmarkPlus,
  RefreshCw,
  Sparkles,
  Bot,
  Zap,
  Info,
} from 'lucide-react';

interface CaptionGeneratorProps {
  language: Language;
  onSaveProject: (type: 'caption', title: string, previewUrl: string, data: CaptionItem) => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const CaptionGenerator: React.FC<CaptionGeneratorProps> = ({
  language,
  onSaveProject,
  onShowToast,
}) => {
  const t = translations[language];
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('motivation');
  const [captions, setCaptions] = useState<CaptionItem[]>(() =>
    getLocalCaptions('Motivation and Success', 'motivation', language)
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Generate using verified offline local templates
  const handleGenerateLocal = () => {
    const list = getLocalCaptions(topic, category, language);
    setCaptions(list);
    onShowToast('info', language === 'hi' ? 'नए लोकल टेम्पलेट्स लोड हो गए' : 'Curated templates generated');
  };

  // Generate via secure server endpoint using Gemini 3.8 Flash
  const handleGenerateAi = async () => {
    try {
      setIsAiLoading(true);
      const res = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim() || 'Online Freelancing and Graphic Design',
          language,
          category,
        }),
      });

      if (!res.ok) {
        throw new Error('Server AI call failed. Using local templates instead.');
      }

      const data = await res.json();
      if (data?.captions && Array.isArray(data.captions) && data.captions.length > 0) {
        const formatted: CaptionItem[] = data.captions.map((item: any, idx: number) => ({
          id: `ai_${Date.now()}_${idx}`,
          category,
          topic: topic || 'Custom Topic',
          title: item.title || 'AI Generated Caption',
          caption: item.caption,
          hashtags: Array.isArray(item.hashtags) ? item.hashtags : ['#DailyEarnPro', '#ContentCreator'],
          language,
          source: 'ai',
        }));
        setCaptions(formatted);
        onShowToast('success', language === 'hi' ? 'Gemini 3.8 AI द्वारा कैप्शन तैयार!' : 'Generated fresh captions with Gemini 3.8 Flash!');
      } else {
        throw new Error('Invalid format from AI response');
      }
    } catch (err: any) {
      console.warn('AI Caption fetch failed, falling back to local templates:', err);
      handleGenerateLocal();
      onShowToast(
        'info',
        language === 'hi'
          ? 'सर्वर AI अनुपलब्ध है। उच्च-गुणवत्ता वाले ऑफलाइन टेम्पलेट्स लोड किए गए हैं।'
          : 'Server AI unavailable. Loaded high-converting offline templates.'
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopy = async (item: CaptionItem) => {
    const fullText = `${item.caption}\n\n${item.hashtags.join(' ')}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
      onShowToast('success', t.caption.copied);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = fullText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
      onShowToast('success', t.caption.copied);
    }
  };

  const handleShare = async (item: CaptionItem) => {
    const fullText = `${item.caption}\n\n${item.hashtags.join(' ')}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: fullText,
        });
      } catch {
        handleCopy(item);
      }
    } else {
      handleCopy(item);
    }
  };

  const handleSave = (item: CaptionItem) => {
    onSaveProject('caption', item.title || item.topic, '', item);
    onShowToast('success', t.caption.savedSuccess);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Tool Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
            <Type className="w-5 h-5" />
          </span>
          {t.caption.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t.caption.subtitle}
        </p>

        {/* Input Form */}
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.caption.topicLabel}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t.caption.topicPlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.caption.selectCategory}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(t.caption.categories).map(([catKey, catLabel]) => (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setCategory(catKey)}
                  className={`py-2 px-2.5 text-left rounded-xl text-xs font-semibold border transition-all ${
                    category === catKey
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {catLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={handleGenerateLocal}
              className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{t.caption.generateLocal}</span>
            </button>

            <button
              onClick={handleGenerateAi}
              disabled={isAiLoading}
              className="py-3 px-4 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-98 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition-all disabled:opacity-60"
            >
              {isAiLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.caption.aiGenerating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t.caption.generateAi}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Clear Transparency Banner */}
        <div className="mt-3.5 p-2.5 bg-blue-50/70 dark:bg-slate-800/60 rounded-xl border border-blue-100 dark:border-slate-700 flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-400">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p>{t.caption.templateNotice}</p>
        </div>
      </div>

      {/* Generated Captions List */}
      <div className="space-y-4">
        {captions.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 transition-all hover:border-indigo-200 dark:hover:border-indigo-900/60"
          >
            {/* Card Header & Source Tag */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                {item.title}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                  item.source === 'ai'
                    ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                }`}
              >
                {item.source === 'ai' ? <Bot className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                {item.source === 'ai' ? t.caption.sourceAi : t.caption.sourceTemplate}
              </span>
            </div>

            {/* Caption Text Body */}
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-normal">
              {item.caption}
            </p>

            {/* Hashtag Cloud */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                {t.caption.hashtagsLabel}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.hashtags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleSave(item)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.common.save}</span>
              </button>

              <button
                onClick={() => handleShare(item)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>{t.common.share}</span>
              </button>

              <button
                onClick={() => handleCopy(item)}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-600/30 active:scale-95 transition-all"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>{t.caption.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.caption.copyButton}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
