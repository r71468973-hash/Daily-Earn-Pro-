import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import {
  TrendingUp,
  ShieldAlert,
  Store,
  Youtube,
  Type,
  Briefcase,
  Copy,
  Check,
  Calculator,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface EarningTipsProps {
  language: Language;
  onShowToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const EarningTips: React.FC<EarningTipsProps> = ({ language, onShowToast }) => {
  const t = translations[language];
  const [copiedPitchIndex, setCopiedPitchIndex] = useState<number | null>(null);

  // Calculator states
  const [clientsCount, setClientsCount] = useState<number>(5);
  const [feePerClient, setFeePerClient] = useState<number>(2000);

  const estimatedMonthly = clientsCount * feePerClient;

  const pitchTemplates = [
    {
      title: language === 'hi' ? 'दुकानदारों के लिए व्हाट्सएप संदेश' : 'WhatsApp Outreach for Local Shopkeepers',
      tag: language === 'hi' ? 'स्थानीय व्यापार' : 'Local Business',
      body:
        language === 'hi'
          ? `नमस्ते सर/मैडम,🙏\n\nमैंने आपकी दुकान के लिए सोशल मीडिया पर देखा कि आपके पास बहुत अच्छा सामान है। अगर आप अपने व्हाट्सएप स्टेटस और इंस्टाग्राम पर हर हफ्ते त्योहारों और नए ऑफर्स के आकर्षक पोस्टर डालें, तो आपके पास 20% से 30% ज्यादा ग्राहक आएंगे।\n\nमैं सिर्फ आपके लिए 1 पोस्टर बिल्कुल फ्री में बनाकर दे रहा हूँ ताकि आप काम की क्वालिटी देख सकें। अगर काम पसंद आए तो हम महीने का पैकेज ले सकते हैं।\n\nक्या मैं आपको 1 फ्री सैंपल बनाकर भेजूँ?`
          : `Hello Sir/Madam,🙏\n\nI noticed your business page and love your collection! To help you attract more daily walk-in customers and WhatsApp inquiries, I can design modern festival offer posters and discount creatives for your store.\n\nI would love to create 1 FREE sample poster for your business so you can judge the quality yourself. If you like it, we can partner on an affordable monthly package.\n\nMay I share a quick sample with your store name?`,
    },
    {
      title: language === 'hi' ? 'यूट्यूबर्स के लिए डायरेक्ट मैसेज (DM)' : 'Direct Pitch for YouTube Creators',
      tag: language === 'hi' ? 'यूट्यूबर्स' : 'YouTubers',
      body:
        language === 'hi'
          ? `नमस्ते भाई!🙌\n\nमैंने आपका यूट्यूब वीडियो देखा, आपका कंटेंट बहुत ज्ञानवर्धक और जबरदस्त है। लेकिन आपका थंबनेल थोड़ा सा साधारण था जिसकी वजह से शायद क्लिक्स और व्यूज कम आ रहे हैं।\n\nमैंने आपके पिछले वीडियो के लिए एक 16:9 हाई-सीटीआर थंबनेल डिजाइन किया है। आप इसे लगाकर खुद चेक कर सकते हैं कि व्यूज कैसे बढ़ते हैं।\n\nअगर आपको पसंद आए, तो मैं आपके हर वीडियो के लिए बहुत ही किफायती दामों में थंबनेल बना सकता हूँ। धन्यवाद!`
          : `Hey there!🙌\n\nI recently watched your latest YouTube video—your explanation and content are solid! However, your thumbnail could have a much higher Click-Through Rate (CTR) with high-contrast text and attention-grabbing hooks.\n\nI’ve designed 1 FREE revamped 16:9 thumbnail for your recent topic so you can test the CTR boost for yourself.\n\nWould you like me to send it over? Cheers to your channel's growth!`,
    },
  ];

  const handleCopyPitch = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPitchIndex(index);
    setTimeout(() => setCopiedPitchIndex(null), 2500);
    onShowToast('success', t.caption.copied);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Title Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </span>
          {t.earning.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t.earning.subtitle}
        </p>
      </div>

      {/* Honest Transparency Disclaimer Card (Crucial for compliance & user trust) */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800/80 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-amber-900 dark:text-amber-200 text-sm sm:text-base">
              {t.earning.disclaimerTitle}
            </h3>
            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300/90 leading-relaxed font-medium">
              {t.earning.disclaimerText}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Proven Earning Blueprints */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base px-1">
          {t.earning.methodsTitle}
        </h3>

        {/* Blueprint 1: Local Posters */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              {t.earning.method1Title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.earning.method1Desc}
            </p>
          </div>
        </div>

        {/* Blueprint 2: YouTube Thumbnails */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 shrink-0">
            <Youtube className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              {t.earning.method2Title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.earning.method2Desc}
            </p>
          </div>
        </div>

        {/* Blueprint 3: Captions & Management */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Type className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              {t.earning.method3Title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.earning.method3Desc}
            </p>
          </div>
        </div>

        {/* Blueprint 4: Freelance Platforms */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              {t.earning.method4Title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.earning.method4Desc}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Monthly Freelance Income Calculator */}
      <div className="bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900 text-white rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
            <Calculator className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white">
              {t.earning.calculatorTitle}
            </h3>
            <p className="text-[11px] text-blue-200">
              {language === 'hi' ? 'स्लाइडर हिलाकर संभावित कमाई देखें' : 'Move sliders to calculate projected income'}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {/* Slider 1: Number of clients */}
          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <div className="flex justify-between items-center text-xs font-semibold mb-1">
              <span>{t.earning.calcClients}</span>
              <span className="text-amber-300 font-bold font-mono text-sm">{clientsCount}</span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              value={clientsCount}
              onChange={(e) => setClientsCount(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>

          {/* Slider 2: Fee per client */}
          <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs">
            <div className="flex justify-between items-center text-xs font-semibold mb-1">
              <span>{t.earning.calcPerClient}</span>
              <span className="text-amber-300 font-bold font-mono text-sm">₹{feePerClient}</span>
            </div>
            <input
              type="range"
              min={500}
              max={8000}
              step={250}
              value={feePerClient}
              onChange={(e) => setFeePerClient(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>

          {/* Result Box */}
          <div className="bg-white/20 p-4 rounded-xl border border-white/20 text-center">
            <p className="text-xs text-blue-100 font-medium uppercase tracking-wider mb-1">
              {t.earning.calcEstMonthly}
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono tracking-tight">
              ₹{estimatedMonthly.toLocaleString('en-IN')}
              <span className="text-xs text-white/80 font-normal ml-1">/ month</span>
            </p>
            <p className="text-[10px] text-blue-200 mt-1">
              {language === 'hi'
                ? '*नोट: यह आय आपकी मेहनत और क्लाइंट्स से मिलने वाले ऑर्डर्स पर निर्भर करती है।'
                : '*Note: Real earnings depend on your client acquisition and service quality.'}
            </p>
          </div>
        </div>
      </div>

      {/* Copy-Ready Client Pitch Templates */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2 px-1">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <span>{t.earning.pitchTemplatesTitle}</span>
        </h3>

        {pitchTemplates.map((p, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {p.title}
              </span>
              <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                {p.tag}
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-mono bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              {p.body}
            </p>

            <button
              onClick={() => handleCopyPitch(p.body, idx)}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs shadow-blue-600/30 transition-all"
            >
              {copiedPitchIndex === idx ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>{t.caption.copied}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{t.earning.copyPitch}</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
