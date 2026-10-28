import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Language, PosterConfig } from '../types';
import { translations } from '../translations';
import {
  Download,
  Share2,
  BookmarkPlus,
  RotateCcw,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Type,
  Maximize2,
  Check,
} from 'lucide-react';

interface PosterMakerProps {
  language: Language;
  onSaveProject: (type: 'poster', title: string, previewUrl: string, data: PosterConfig) => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  initialConfig?: PosterConfig | null;
}

const DEFAULT_POSTER: PosterConfig = {
  headline: 'SUPER FESTIVAL SALE 50% OFF',
  subtitle: 'Exclusive discounts on all premium collections. Valid this weekend only!',
  badge: '🔥 SPECIAL LIMITED OFFER',
  footer: '📞 Call/WhatsApp: +91 98765 43210 | 📍 Visit Main Branch',
  bgType: 'gradient',
  bgColor1: '#1e3a8a', // Deep Blue
  bgColor2: '#3b82f6', // Bright Blue
  gradientAngle: 135,
  textColor: '#ffffff',
  subtitleColor: '#e0f2fe',
  badgeBgColor: '#f59e0b',
  badgeTextColor: '#000000',
  textAlign: 'center',
  headlineSize: 46,
  subtitleSize: 22,
  frameStyle: 'border',
  fontFamily: 'sans',
};

const GRADIENT_PRESETS = [
  { name: 'Royal Blue', c1: '#1e3a8a', c2: '#3b82f6', angle: 135 },
  { name: 'Vibrant Sunset', c1: '#b91c1c', c2: '#f97316', angle: 135 },
  { name: 'Emerald Growth', c1: '#064e3b', c2: '#10b981', angle: 135 },
  { name: 'Midnight Purple', c1: '#4c1d95', c2: '#8b5cf6', angle: 135 },
  { name: 'Golden Glow', c1: '#78350f', c2: '#d97706', angle: 135 },
  { name: 'Dark Slate', c1: '#0f172a', c2: '#334155', angle: 135 },
];

export const PosterMaker: React.FC<PosterMakerProps> = ({
  language,
  onSaveProject,
  onShowToast,
  initialConfig,
}) => {
  const t = translations[language];
  const [config, setConfig] = useState<PosterConfig>(initialConfig || DEFAULT_POSTER);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // If initialConfig changes (e.g. user reopens from My Work)
  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  // Canvas drawing routine
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1080 x 1080 square canvas for crisp exports
    const size = 1080;
    canvas.width = size;
    canvas.height = size;

    // Background
    if (config.bgType === 'gradient') {
      const rad = (config.gradientAngle * Math.PI) / 180;
      const x1 = size / 2 - (Math.cos(rad) * size) / 2;
      const y1 = size / 2 - (Math.sin(rad) * size) / 2;
      const x2 = size / 2 + (Math.cos(rad) * size) / 2;
      const y2 = size / 2 + (Math.sin(rad) * size) / 2;

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, config.bgColor1);
      grad.addColorStop(1, config.bgColor2);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = config.bgColor1;
    }
    ctx.fillRect(0, 0, size, size);

    // Decorative background pattern
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    for (let i = 0; i < size; i += 80) {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, i, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // Frame styling
    if (config.frameStyle === 'border') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 14;
      ctx.strokeRect(40, 40, size - 80, size - 80);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 4;
      ctx.strokeRect(58, 58, size - 116, size - 116);
    } else if (config.frameStyle === 'card') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.roundRect(60, 60, size - 120, size - 120, 36);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 4;
      ctx.stroke();
    } else if (config.frameStyle === 'glow') {
      ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
      ctx.shadowBlur = 40;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 8;
      ctx.strokeRect(50, 50, size - 100, size - 100);
      ctx.shadowBlur = 0;
    }

    // Helper for wrapping text
    const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const words = text.split(' ');
      let line = '';
      const lines = [];

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          lines.push(line.trim());
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line.trim());

      lines.forEach((l, index) => {
        ctx.fillText(l, x, y + index * lineHeight);
      });
      return lines.length * lineHeight;
    };

    const align = config.textAlign;
    ctx.textAlign = align;

    let contentX = size / 2;
    if (align === 'left') contentX = 110;
    if (align === 'right') contentX = size - 110;

    // Top Badge (Offer / Tag)
    if (config.badge.trim()) {
      const badgeText = config.badge.toUpperCase();
      ctx.font = 'bold 30px "Plus Jakarta Sans", "Noto Sans Devanagari", sans-serif';
      const badgeMetrics = ctx.measureText(badgeText);
      const bPaddingX = 28;
      const bHeight = 52;
      const bWidth = badgeMetrics.width + bPaddingX * 2;
      let badgeX = contentX - bWidth / 2;
      if (align === 'left') badgeX = 110;
      if (align === 'right') badgeX = size - 110 - bWidth;

      // Draw Badge background pill
      ctx.fillStyle = config.badgeBgColor;
      ctx.beginPath();
      ctx.roundRect(badgeX, 130, bWidth, bHeight, 26);
      ctx.fill();

      // Badge text
      ctx.fillStyle = config.badgeTextColor;
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, badgeX + bWidth / 2, 166);
      ctx.textAlign = align;
    }

    // Headline (Main Title)
    ctx.fillStyle = config.textColor;
    ctx.font = `800 ${config.headlineSize * 1.5}px "Plus Jakarta Sans", "Noto Sans Devanagari", sans-serif`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;

    const headlineY = 280;
    const maxHeadlineWidth = size - 220;
    const headlineHeight = wrapText(
      config.headline,
      contentX,
      headlineY,
      maxHeadlineWidth,
      config.headlineSize * 1.7
    );

    // Reset shadow
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Subtitle
    ctx.fillStyle = config.subtitleColor;
    ctx.font = `500 ${config.subtitleSize * 1.5}px "Plus Jakarta Sans", "Noto Sans Devanagari", sans-serif`;
    const subtitleY = headlineY + headlineHeight + 40;
    wrapText(
      config.subtitle,
      contentX,
      subtitleY,
      maxHeadlineWidth,
      config.subtitleSize * 2.1
    );

    // Footer / Contact / Tagline bar
    if (config.footer.trim()) {
      const footerY = size - 140;
      // Draw subtle footer pill container
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.roundRect(90, footerY - 45, size - 180, 75, 20);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 28px "Plus Jakarta Sans", "Noto Sans Devanagari", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(config.footer, size / 2, footerY + 3);
    }
  }, [config]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Preset loaders
  const loadPreset = (presetKey: string) => {
    if (presetKey === 'businessSale') {
      setConfig({
        ...config,
        headline: language === 'hi' ? 'महा सेल धमाका 50% छूट!' : 'BIG SUMMER FESTIVAL 50% OFF',
        subtitle: language === 'hi' ? 'सभी बेहतरीन कपड़ों व सामानों पर भारी छूट। ऑफर केवल रविवार तक सीमित!' : 'Massive discount on all new season collections. Hurry, offer valid till Sunday only!',
        badge: language === 'hi' ? '🔥 सीमित समय का बंपर ऑफर' : '🔥 LIMITED TIME MEGA OFFER',
        footer: language === 'hi' ? '📞 9876543210 | दुकान नं. 12, मेन मार्केट' : '📞 Call/WhatsApp: +91 98765 43210 | Main Market Branch',
        bgType: 'gradient',
        bgColor1: '#b91c1c',
        bgColor2: '#f97316',
        badgeBgColor: '#fbbf24',
        badgeTextColor: '#000000',
        textColor: '#ffffff',
        subtitleColor: '#fef08a',
        textAlign: 'center',
        frameStyle: 'border',
      });
    } else if (presetKey === 'motivational') {
      setConfig({
        ...config,
        headline: language === 'hi' ? 'मेहनत इतनी खामोशी से करो कि सफलता शोर मचा दे!' : 'HARD WORK BEATS TALENT WHEN TALENT FAILS TO WORK HARD',
        subtitle: language === 'hi' ? 'आज का दिन आपके सपनों को सच करने का सबसे अच्छा मौका है। कभी रुकना नहीं है।' : 'Every morning is a new canvas. Take consistent action and watch your life transform.',
        badge: language === 'hi' ? '⭐ आज का सुविचार' : '⭐ DAILY INSPIRATION',
        footer: language === 'hi' ? 'Daily Earn Pro | @DailyMotivation' : 'Daily Earn Pro | Inspire Daily',
        bgType: 'gradient',
        bgColor1: '#0f172a',
        bgColor2: '#1e293b',
        badgeBgColor: '#38bdf8',
        badgeTextColor: '#0f172a',
        textColor: '#ffffff',
        subtitleColor: '#cbd5e1',
        textAlign: 'center',
        frameStyle: 'card',
      });
    } else if (presetKey === 'festival') {
      setConfig({
        ...config,
        headline: language === 'hi' ? 'पावन पर्व की आप सभी को हार्दिक शुभकामनाएं!' : 'WISHING YOU A JOYOUS & PROSPEROUS CELEBRATION',
        subtitle: language === 'hi' ? 'यह त्योहार आपके घर-परिवार में सुख, शांति, समृद्धि और खुशियां लेकर आए।' : 'May this festive season illuminate your life with good health, happiness, and success.',
        badge: language === 'hi' ? '🌸 शुभ पर्व मंगलकामनाएं' : '✨ FESTIVE BLESSINGS',
        footer: language === 'hi' ? 'शुभकामनाओं सहित: आपका शुभचिंतक परिवार' : 'Warm Wishes From Our Family & Team',
        bgType: 'gradient',
        bgColor1: '#78350f',
        bgColor2: '#d97706',
        badgeBgColor: '#ffffff',
        badgeTextColor: '#78350f',
        textColor: '#ffffff',
        subtitleColor: '#fef3c7',
        textAlign: 'center',
        frameStyle: 'border',
      });
    } else if (presetKey === 'hiring') {
      setConfig({
        ...config,
        headline: language === 'hi' ? 'कर्मचारियों की तत्काल आवश्यकता है!' : 'WE ARE HIRING! JOIN OUR GROWING TEAM',
        subtitle: language === 'hi' ? 'सेल्स व डिलीवरी बॉयज की जरूरत। अच्छा वेतन + इंसेंटिव। योग्यता: 10वीं पास।' : 'Open roles for Graphic Designers, Sales Associates, and Managers. Attractive salary & perks.',
        badge: language === 'hi' ? '💼 अर्जेंट भर्ती' : '💼 URGENT REQUIREMENT',
        footer: language === 'hi' ? '📞 तुरंत संपर्क करें: +91 98765 00000 | बायोडाटा भेजें' : '📞 Contact HR: +91 98765 00000 | Send CV to info@brand.com',
        bgType: 'gradient',
        bgColor1: '#1e3a8a',
        bgColor2: '#0284c7',
        badgeBgColor: '#facc15',
        badgeTextColor: '#000000',
        textColor: '#ffffff',
        subtitleColor: '#e0f2fe',
        textAlign: 'center',
        frameStyle: 'border',
      });
    } else if (presetKey === 'foodMenu') {
      setConfig({
        ...config,
        headline: language === 'hi' ? 'स्वाद ऐसा जो दिल जीत ले! नया मेनू' : 'DELICIOUS BITES & FRESH COFFEE TODAY',
        subtitle: language === 'hi' ? 'पिज्जा, बर्गर और स्पेशल कॉम्बो पर 20% तक की छूट। होम डिलीवरी उपलब्ध।' : 'Try our chef’s special recipes with 20% combo discount. Dine in or order online.',
        badge: language === 'hi' ? '🍔 खास फूड कॉम्बो' : '🍔 SPECIAL TASTE DEAL',
        footer: language === 'hi' ? '📍 रॉयल कैफे, एमजी रोड | फ्री होम डिलीवरी' : '📍 The Royal Cafe | Call: 9876543210 for free delivery',
        bgType: 'gradient',
        bgColor1: '#831843',
        bgColor2: '#db2777',
        badgeBgColor: '#fde047',
        badgeTextColor: '#831843',
        textColor: '#ffffff',
        subtitleColor: '#fce7f3',
        textAlign: 'center',
        frameStyle: 'glow',
      });
    } else if (presetKey === 'fitness') {
      setConfig({
        ...config,
        headline: language === 'hi' ? 'नया साल, नया शरीर! जिम ज्वाइन करें' : 'TRANSFORM YOUR BODY & BOOST YOUR ENERGY',
        subtitle: language === 'hi' ? '3 महीने की फीस पर 1 महीना बिल्कुल फ्री! पर्सनल ट्रेनर व डाइट प्लान।' : 'Get 1 month free on 3-month membership! Certified trainers & customized diet plans.',
        badge: language === 'hi' ? '💪 फिटनेस ऑफर' : '💪 GYM MEMBERSHIP SALE',
        footer: language === 'hi' ? '📞 9876543210 | पावर जिम, मेन रोड' : '📞 Call 9876543210 | Power Fitness Club',
        bgType: 'gradient',
        bgColor1: '#064e3b',
        bgColor2: '#059669',
        badgeBgColor: '#34d399',
        badgeTextColor: '#064e3b',
        textColor: '#ffffff',
        subtitleColor: '#d1fae5',
        textAlign: 'center',
        frameStyle: 'card',
      });
    }
    onShowToast('info', language === 'hi' ? 'प्रीसेट लोड हो गया!' : 'Preset applied!');
  };

  // Download high-resolution PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsExporting(true);
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      const filename = `daily-earn-poster-${Date.now()}.png`;
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onShowToast('success', t.poster.downloadSuccess);
    } catch (err) {
      console.error('Download error:', err);
      onShowToast('error', t.common.error);
    } finally {
      setIsExporting(false);
    }
  };

  // Web Share or fallback
  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsExporting(true);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `daily-earn-poster-${Date.now()}.png`, { type: 'image/png' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: config.headline,
            text: config.subtitle,
            files: [file],
          });
          onShowToast('success', t.poster.share);
        } else {
          // Fallback download if share API not supported
          handleDownload();
          onShowToast('info', t.poster.shareUnsupported);
        }
        setIsExporting(false);
      }, 'image/png');
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        console.error('Share failed:', error);
        handleDownload();
      }
      setIsExporting(false);
    }
  };

  // Save to My Work
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.82); // compressed for localStorage
    onSaveProject('poster', config.headline || 'Untitled Poster', dataUrl, config);
    onShowToast('success', t.poster.savedSuccess);
  };

  const handleReset = () => {
    setConfig(DEFAULT_POSTER);
    onShowToast('info', language === 'hi' ? 'कैनवास रीसेट कर दिया गया' : 'Canvas reset to default');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Title & Description */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                <Sparkles className="w-5 h-5" />
              </span>
              {t.poster.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t.poster.subtitle}
            </p>
          </div>
          <button
            onClick={handleReset}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all"
            title={t.poster.reset}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">{t.poster.reset}</span>
          </button>
        </div>

        {/* Quick Presets Carousel */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            {t.poster.presetLabel}
          </p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {Object.entries(t.poster.presets).map(([key, label]) => (
              <button
                key={key}
                onClick={() => loadPreset(key)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 text-xs font-semibold whitespace-nowrap border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview Canvas Container (1:1 Square) */}
      <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-800 flex flex-col items-center justify-center relative">
        <div className="w-full flex items-center justify-between text-slate-400 text-xs mb-3 px-1">
          <span className="font-semibold flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
            {t.poster.preview} (1080 × 1080 px)
          </span>
          <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[10px] font-mono">
            1:1 Square Post
          </span>
        </div>

        {/* Scaled Canvas Container */}
        <div className="w-full max-w-[380px] aspect-square rounded-xl overflow-hidden shadow-2xl border border-white/10 relative bg-black flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain select-none"
            style={{ touchAction: 'none' }}
          />
        </div>

        {/* Primary Action Buttons (Touch Friendly) */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-[380px] mt-4">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center justify-center gap-1.5 py-3 px-2 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{t.common.download}</span>
          </button>

          <button
            onClick={handleShare}
            disabled={isExporting}
            className="flex items-center justify-center gap-1.5 py-3 px-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>{t.common.share}</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-1.5 py-3 px-2 bg-slate-800 hover:bg-slate-700 active:scale-98 text-white rounded-xl font-bold text-xs sm:text-sm border border-slate-700 transition-all"
          >
            <BookmarkPlus className="w-4 h-4 text-emerald-400" />
            <span>{t.common.save}</span>
          </button>
        </div>
      </div>

      {/* Editing Controls & Form Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
          <Type className="w-4 h-4 text-blue-600" />
          <span>{language === 'hi' ? 'पोस्टर टेक्स्ट व कस्टमाइजेशन' : 'Customize Poster Content & Styles'}</span>
        </h3>

        {/* Headline */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            {t.poster.headline}
          </label>
          <input
            type="text"
            value={config.headline}
            onChange={(e) => setConfig({ ...config, headline: e.target.value })}
            placeholder={t.poster.headlinePlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            {t.poster.subhead}
          </label>
          <textarea
            rows={2}
            value={config.subtitle}
            onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
            placeholder={t.poster.subheadPlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        {/* Badge & Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.poster.badgeText}
            </label>
            <input
              type="text"
              value={config.badge}
              onChange={(e) => setConfig({ ...config, badge: e.target.value })}
              placeholder={t.poster.badgePlaceholder}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.poster.footerText}
            </label>
            <input
              type="text"
              value={config.footer}
              onChange={(e) => setConfig({ ...config, footer: e.target.value })}
              placeholder={t.poster.footerPlaceholder}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Formatting & Alignment Toolbar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            {t.poster.textAlign} & {t.poster.fontSize}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setConfig({ ...config, textAlign: 'left' })}
                className={`p-2 rounded-lg text-xs font-bold transition-all ${
                  config.textAlign === 'left'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-2xs'
                    : 'text-slate-500'
                }`}
                title={t.poster.left}
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setConfig({ ...config, textAlign: 'center' })}
                className={`p-2 rounded-lg text-xs font-bold transition-all ${
                  config.textAlign === 'center'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-2xs'
                    : 'text-slate-500'
                }`}
                title={t.poster.center}
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setConfig({ ...config, textAlign: 'right' })}
                className={`p-2 rounded-lg text-xs font-bold transition-all ${
                  config.textAlign === 'right'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-2xs'
                    : 'text-slate-500'
                }`}
                title={t.poster.right}
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>

            {/* Headline Size Slider */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex-1 min-w-[170px]">
              <span className="text-[11px] font-bold text-slate-500">Size:</span>
              <input
                type="range"
                min={28}
                max={68}
                value={config.headlineSize}
                onChange={(e) => setConfig({ ...config, headlineSize: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300">
                {config.headlineSize}
              </span>
            </div>
          </div>
        </div>

        {/* Frame Style */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            {t.poster.frameStyle}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'none', label: t.poster.none },
              { id: 'border', label: t.poster.border },
              { id: 'card', label: t.poster.card },
              { id: 'glow', label: t.poster.glow },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setConfig({ ...config, frameStyle: f.id as any })}
                className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border transition-all ${
                  config.frameStyle === f.id
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gradient Presets & Colors */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.poster.gradient}</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {GRADIENT_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  setConfig({
                    ...config,
                    bgType: 'gradient',
                    bgColor1: p.c1,
                    bgColor2: p.c2,
                    gradientAngle: p.angle,
                  })
                }
                className="h-10 rounded-xl shadow-xs border border-white/20 relative flex items-center justify-center transition-transform active:scale-95"
                style={{
                  background: `linear-gradient(${p.angle}deg, ${p.c1}, ${p.c2})`,
                }}
                title={p.name}
              >
                {config.bgColor1 === p.c1 && config.bgColor2 === p.c2 && (
                  <Check className="w-4 h-4 text-white drop-shadow-md" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
