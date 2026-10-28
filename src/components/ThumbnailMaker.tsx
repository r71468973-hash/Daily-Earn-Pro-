import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Language, ThumbnailConfig } from '../types';
import { translations } from '../translations';
import {
  Download,
  Share2,
  BookmarkPlus,
  RotateCcw,
  Youtube,
  Type,
  Flame,
  Play,
  Star,
  AlertTriangle,
  BadgeDollarSign,
  Maximize2,
  Check,
} from 'lucide-react';

interface ThumbnailMakerProps {
  language: Language;
  onSaveProject: (type: 'thumbnail', title: string, previewUrl: string, data: ThumbnailConfig) => void;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
  initialConfig?: ThumbnailConfig | null;
}

const DEFAULT_THUMBNAIL: ThumbnailConfig = {
  title: 'MOBILE SE ₹25,000/MONTH KAISE KAMAYE',
  subtitle: 'Live Proof - Step-by-Step Hindi Guide 2026',
  badge: '🔥 100% WORKING TRICK',
  tagline: 'DAILY EARN PRO',
  bgStyle: 'fire',
  bgColor1: '#090d16',
  bgColor2: '#ea580c',
  titleColor: '#ffffff',
  subtitleColor: '#fef08a',
  badgeColor: '#e11d48',
  titleSize: 52,
  subtitleSize: 26,
  textAlign: 'left',
  hasGlow: true,
  hasOutline: true,
  sticker: 'fire',
};

const BG_PRESETS = [
  { id: 'fire', name: 'Viral Fire', c1: '#0f172a', c2: '#ea580c', badge: '#e11d48' },
  { id: 'tech', name: 'Cyber Neon', c1: '#020617', c2: '#2563eb', badge: '#06b6d4' },
  { id: 'gold', name: 'Finance Gold', c1: '#1c1917', c2: '#d97706', badge: '#eab308' },
  { id: 'navy', name: 'Royal YouTube', c1: '#450a0a', c2: '#991b1b', badge: '#ef4444' },
  { id: 'neon', name: 'Electric Green', c1: '#052e16', c2: '#16a34a', badge: '#22c55e' },
  { id: 'dark', name: 'Ultra Dark', c1: '#000000', c2: '#1e293b', badge: '#38bdf8' },
];

export const ThumbnailMaker: React.FC<ThumbnailMakerProps> = ({
  language,
  onSaveProject,
  onShowToast,
  initialConfig,
}) => {
  const t = translations[language];
  const [config, setConfig] = useState<ThumbnailConfig>(initialConfig || DEFAULT_THUMBNAIL);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  // Canvas drawing routine (1280 x 720 px, 16:9 standard YouTube dimension)
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1280;
    const height = 720;
    canvas.width = width;
    canvas.height = height;

    // 1. Dynamic Vibrant 16:9 Gradient Background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, config.bgColor1);
    grad.addColorStop(0.65, config.bgColor1);
    grad.addColorStop(1, config.bgColor2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 2. High-contrast angular visual slash / accent polygon
    ctx.save();
    ctx.fillStyle = config.bgColor2;
    ctx.globalAlpha = 0.22;
    ctx.beginPath();
    ctx.moveTo(width * 0.55, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, height);
    ctx.lineTo(width * 0.4, height);
    ctx.closePath();
    ctx.fill();

    // Subtle grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1.5;
    for (let x = 0; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    // 3. Channel/Watermark Tag (Top Right)
    if (config.tagline.trim()) {
      ctx.save();
      ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'right';
      ctx.fillText(config.tagline.toUpperCase(), width - 60, 68);
      ctx.restore();
    }

    // 4. Attention Hook Badge (Top Left)
    if (config.badge.trim()) {
      const badgeText = config.badge.toUpperCase();
      ctx.font = '900 28px "Plus Jakarta Sans", "Noto Sans Devanagari", sans-serif';
      const metrics = ctx.measureText(badgeText);
      const bPaddingX = 26;
      const bHeight = 56;
      const bWidth = metrics.width + bPaddingX * 2;
      const bX = 60;
      const bY = 50;

      // Glow under badge
      if (config.hasGlow) {
        ctx.shadowColor = config.badgeColor;
        ctx.shadowBlur = 25;
      }
      ctx.fillStyle = config.badgeColor;
      ctx.beginPath();
      ctx.roundRect(bX, bY, bWidth, bHeight, 14);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Badge text
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, bX + bWidth / 2, bY + 38);
    }

    // Helper for multiline text wrapping
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
        const lineY = y + index * lineHeight;
        if (config.hasOutline) {
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 14;
          ctx.strokeText(l, x, lineY);
        }
        ctx.fillText(l, x, lineY);
      });
      return lines.length * lineHeight;
    };

    // 5. Main Title (Huge bold YouTube style)
    const align = config.textAlign;
    let titleX = 60;
    if (align === 'center') titleX = width / 2;
    if (align === 'right') titleX = width - 60;
    ctx.textAlign = align;

    ctx.font = `900 ${config.titleSize * 1.55}px "Plus Jakarta Sans", "Noto Sans Devanagari", sans-serif`;
    ctx.fillStyle = config.titleColor;

    if (config.hasGlow) {
      ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
      ctx.shadowBlur = 20;
    }

    const titleY = 210;
    const maxTitleWidth = width - 180;
    const titleTotalHeight = wrapText(
      config.title,
      titleX,
      titleY,
      maxTitleWidth,
      config.titleSize * 1.7
    );

    ctx.shadowBlur = 0;

    // 6. Subtitle / Eyecatcher line
    if (config.subtitle.trim()) {
      const subY = titleY + titleTotalHeight + 35;
      ctx.font = `800 ${config.subtitleSize * 1.5}px "Plus Jakarta Sans", "Noto Sans Devanagari", sans-serif`;

      // Draw highlighted background pill for subtitle
      const subMetrics = ctx.measureText(config.subtitle);
      const pillWidth = Math.min(subMetrics.width + 40, width - 120);
      let pillX = titleX;
      if (align === 'center') pillX = width / 2 - pillWidth / 2;
      if (align === 'right') pillX = width - 60 - pillWidth;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.roundRect(pillX, subY - 45, pillWidth, config.subtitleSize * 1.9, 12);
      ctx.fill();

      ctx.fillStyle = config.subtitleColor;
      ctx.fillText(config.subtitle, titleX + (align === 'left' ? 20 : 0), subY);
    }

    // 7. Click Magnet Sticker Graphic (Bottom Right)
    if (config.sticker !== 'none') {
      const stickerX = width - 150;
      const stickerY = height - 150;

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 25;

      // Draw circular badge container
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(stickerX, stickerY, 70, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = config.badgeColor;
      ctx.beginPath();
      ctx.arc(stickerX, stickerY, 62, 0, Math.PI * 2);
      ctx.fill();

      // Emoji/icon inside sticker
      ctx.font = '54px "Noto Color Emoji", "Apple Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const stickerEmojis: Record<string, string> = {
        fire: '🔥',
        play: '▶️',
        star: '⭐',
        money: '💰',
        warning: '⚠️',
      };
      ctx.fillText(stickerEmojis[config.sticker] || '🔥', stickerX, stickerY);
      ctx.restore();
    }

    // 8. Bottom YouTube timestamp mock badge (e.g. 10:48)
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.roundRect(width - 125, height - 52, 95, 34, 6);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('14:20', width - 78, height - 28);
    ctx.restore();
  }, [config]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Preset loaders for instant YouTube CTR styles
  const handleSelectPreset = (bgPreset: typeof BG_PRESETS[0]) => {
    setConfig({
      ...config,
      bgStyle: bgPreset.id as any,
      bgColor1: bgPreset.c1,
      bgColor2: bgPreset.c2,
      badgeColor: bgPreset.badge,
    });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsExporting(true);
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `youtube-thumbnail-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onShowToast('success', t.thumbnail.downloadSuccess);
    } catch (err) {
      console.error(err);
      onShowToast('error', t.common.error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsExporting(true);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `youtube-thumbnail-${Date.now()}.png`, { type: 'image/png' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: config.title,
            text: config.subtitle,
            files: [file],
          });
          onShowToast('success', t.common.share);
        } else {
          handleDownload();
          onShowToast('info', t.poster.shareUnsupported);
        }
        setIsExporting(false);
      }, 'image/png');
    } catch {
      handleDownload();
      setIsExporting(false);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    onSaveProject('thumbnail', config.title || 'Untitled Thumbnail', dataUrl, config);
    onShowToast('success', t.thumbnail.savedSuccess);
  };

  const handleReset = () => {
    setConfig(DEFAULT_THUMBNAIL);
    onShowToast('info', language === 'hi' ? 'थंबनेल रीसेट हो गया' : 'Thumbnail reset');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
              <Youtube className="w-5 h-5" />
            </span>
            {t.thumbnail.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.thumbnail.desc}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">{t.common.close}</span>
        </button>
      </div>

      {/* 16:9 Canvas Preview Card */}
      <div className="bg-slate-950 rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-800 flex flex-col items-center justify-center">
        <div className="w-full flex items-center justify-between text-slate-400 text-xs mb-3 px-1">
          <span className="font-semibold flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-rose-500" />
            {t.thumbnail.preview} (1280 × 720 px)
          </span>
          <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
            16:9 HD Thumbnail
          </span>
        </div>

        {/* 16:9 Ratio Container */}
        <div className="w-full max-w-[500px] aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 relative bg-black flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain select-none"
            style={{ touchAction: 'none' }}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-[500px] mt-4">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center justify-center gap-1.5 py-3 px-2 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/30 transition-all"
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

      {/* Editing Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
          <Type className="w-4 h-4 text-rose-600" />
          <span>{language === 'hi' ? 'थंबनेल टेक्स्ट व हुक सेटिंग' : 'Thumbnail Hook & Titles'}</span>
        </h3>

        {/* Main Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            {t.thumbnail.mainTitle}
          </label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
            placeholder={t.thumbnail.mainTitlePlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            {t.thumbnail.subhead}
          </label>
          <input
            type="text"
            value={config.subtitle}
            onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
            placeholder={t.thumbnail.subtitlePlaceholder}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
          />
        </div>

        {/* Badge & Channel Watermark */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.thumbnail.badge}
            </label>
            <input
              type="text"
              value={config.badge}
              onChange={(e) => setConfig({ ...config, badge: e.target.value })}
              placeholder={t.thumbnail.badgePlaceholder}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.thumbnail.watermark}
            </label>
            <input
              type="text"
              value={config.tagline}
              onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
              placeholder={t.thumbnail.watermarkPlaceholder}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* CTR Magnet Sticker Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            {t.thumbnail.stickerOverlay}
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { id: 'none', label: t.thumbnail.stickers.none, icon: Check },
              { id: 'fire', label: t.thumbnail.stickers.fire, icon: Flame },
              { id: 'play', label: t.thumbnail.stickers.play, icon: Play },
              { id: 'star', label: t.thumbnail.stickers.star, icon: Star },
              { id: 'money', label: t.thumbnail.stickers.money, icon: BadgeDollarSign },
              { id: 'warning', label: t.thumbnail.stickers.warning, icon: AlertTriangle },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setConfig({ ...config, sticker: st.id as any })}
                className={`py-2 px-1 text-center rounded-xl text-xs font-semibold border flex flex-col items-center justify-center gap-1 transition-all ${
                  config.sticker === st.id
                    ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>{st.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Visual Styles & Outline / Glow Toggles */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            {language === 'hi' ? 'सीटीआर बूस्टर इफेक्ट्स' : 'CTR Booster Effects'}
          </p>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                checked={config.hasOutline}
                onChange={(e) => setConfig({ ...config, hasOutline: e.target.checked })}
                className="w-4 h-4 rounded-sm text-rose-600 focus:ring-rose-500"
              />
              <span>{t.thumbnail.textOutline}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                checked={config.hasGlow}
                onChange={(e) => setConfig({ ...config, hasGlow: e.target.checked })}
                className="w-4 h-4 rounded-sm text-rose-600 focus:ring-rose-500"
              />
              <span>{t.thumbnail.glowEffect}</span>
            </label>
          </div>
        </div>

        {/* Background Themes */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            {t.thumbnail.bgTheme}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BG_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  config.bgStyle === p.id
                    ? 'border-rose-600 ring-2 ring-rose-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-lg shadow-xs"
                    style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }}
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {p.name}
                  </span>
                </div>
                {config.bgStyle === p.id && <Check className="w-3.5 h-3.5 text-rose-600" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
