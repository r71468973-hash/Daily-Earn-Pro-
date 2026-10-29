import React, { useState, useEffect } from 'react';
import { ShieldCheck, HelpCircle, X, ExternalLink, Info, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import {
  admobService,
  ADMOB_TEST_CONFIG,
  ADMOB_BANNER_AD_ID,
  ADMOB_INTERSTITIAL_AD_ID,
} from '../services/admobService';

interface AdMobPlaceholderProps {
  language: Language;
}

export const AdMobPlaceholder: React.FC<AdMobPlaceholderProps> = ({ language }) => {
  const t = translations[language];
  const [showDocModal, setShowDocModal] = useState(false);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const native = admobService.isNative();
    setIsNative(native);

    // If native Android, attempt to show native banner on Home Dashboard
    if (native) {
      admobService.showBanner().catch(() => {});
    }

    return () => {
      if (native) {
        admobService.hideBanner().catch(() => {});
      }
    };
  }, []);

  const isTestBanner = ADMOB_BANNER_AD_ID === ADMOB_TEST_CONFIG.bannerId;

  return (
    <>
      {/* Banner Ad Card Container */}
      <div className="w-full my-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 shadow-xs transition-all overflow-hidden">
        {/* AdMob Attribution Bar */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-400 text-slate-900 tracking-wider">
              {t.admob.testBadge}
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Google AdMob
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[10px]">
              • Adaptive Banner
            </span>
          </div>

          <button
            onClick={() => setShowDocModal(true)}
            className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline px-2 py-0.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40"
          >
            <HelpCircle className="w-3 h-3" />
            <span>{language === 'hi' ? 'सेटिंग्स व आईडी' : 'Ad Setup'}</span>
          </button>
        </div>

        {/* Standard Banner Preview Canvas (320x50 standard responsive slot) */}
        <div className="relative w-full h-[54px] rounded-xl bg-linear-to-r from-slate-100 via-blue-50 to-indigo-50 dark:from-slate-800/60 dark:via-blue-950/30 dark:to-indigo-950/40 border border-dashed border-blue-200 dark:border-blue-900 flex items-center justify-between px-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
              Ad
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {language === 'hi' ? 'दैनिक अर्न प्रो • स्पॉन्सर विज्ञापन' : 'Daily Earn Pro • Sponsored Showcase'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {isTestBanner
                  ? (language === 'hi' ? 'गूगल ऑफिशियल टेस्ट विज्ञापन सक्रिय' : 'Google Official Test Ad Unit Active')
                  : (language === 'hi' ? 'कस्टम एडमोब यूनिट सक्रिय' : 'Custom AdMob Unit Loaded')}
              </p>
            </div>
          </div>

          <span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-md bg-blue-600 text-white shadow-2xs">
            {language === 'hi' ? 'देखें' : 'Visit'}
          </span>
        </div>
      </div>

      {/* AdMob Configuration & Policy Modal */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full max-h-[88vh] overflow-y-auto p-5 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    {t.admob.setupTitle}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Google Mobile Ads SDK v8 (Android)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDocModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {/* Active Test Status */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-800 dark:text-emerald-300">
                    {language === 'hi' ? 'ऑफिशियल गूगल टेस्ट मोड सक्रिय है' : 'Official Google Test Mode Active'}
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {language === 'hi'
                      ? 'डेवलपमेंट के दौरान किसी भी पॉलिसी उल्लंघन या खाते के निलंबन से बचने के लिए ऐप में गूगल के प्रमाणित टेस्ट यूनिट्स लगे हैं।'
                      : 'To prevent invalid traffic and account bans during testing, official Google test ad unit IDs are configured.'}
                  </p>
                </div>
              </div>

              {/* Configured IDs */}
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-xs mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>{language === 'hi' ? 'वर्तमान में कॉन्फ़िगर की गई आईडी' : 'Currently Configured IDs'}</span>
                </h4>
                <div className="space-y-1.5 font-mono text-[10px]">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <span className="text-slate-500 font-sans block mb-0.5">Android App ID:</span>
                    <span className="text-blue-600 dark:text-blue-400 select-all break-all">{ADMOB_TEST_CONFIG.appId}</span>
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <span className="text-slate-500 font-sans block mb-0.5">Banner Ad Unit ID:</span>
                    <span className="text-blue-600 dark:text-blue-400 select-all break-all">{ADMOB_BANNER_AD_ID}</span>
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <span className="text-slate-500 font-sans block mb-0.5">Interstitial Ad Unit ID:</span>
                    <span className="text-blue-600 dark:text-blue-400 select-all break-all">{ADMOB_INTERSTITIAL_AD_ID}</span>
                  </div>
                </div>
              </div>

              {/* Instructions on entering real production IDs */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <h4 className="font-bold text-slate-800 dark:text-white text-xs mb-1.5">
                  {language === 'hi' ? 'अपनी असली (Live) AdMob आईडी कैसे जोड़ें:' : 'How to Add Your Real AdMob IDs for Release:'}
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-[11px]">
                  <li>
                    <strong>AdMob App ID:</strong> Open <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-blue-600 dark:text-blue-400">android/app/src/main/AndroidManifest.xml</code> and update the <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">&lt;meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="ca-app-pub-YOUR_ID~XXXXX" /&gt;</code>.
                  </li>
                  <li>
                    <strong>Banner & Interstitial Units:</strong> In your environment or <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">.env</code>, set:
                    <div className="mt-1 bg-slate-900 text-slate-100 p-2 rounded-lg font-mono text-[10px]">
                      VITE_ADMOB_BANNER_ID="ca-app-pub-XXXX/YYYY"<br />
                      VITE_ADMOB_INTERSTITIAL_ID="ca-app-pub-XXXX/ZZZZ"<br />
                      VITE_ADMOB_IS_TESTING="false"
                    </div>
                  </li>
                  <li>
                    <strong>Build APK:</strong> Run GitHub Actions build workflow or <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">./gradlew assembleDebug</code>.
                  </li>
                </ol>
              </div>

              {/* Strict AdMob Policies reminder */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Google AdMob Policy Compliance</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[10px] text-amber-700 dark:text-amber-400">
                  <li>Never click your own live ads or ask others to click them.</li>
                  <li>Ads are strictly disabled on Login, Sign Up, Password Reset & Admin screens.</li>
                  <li>Interstitials only show upon natural action completions with cooldowns.</li>
                  <li>No promises of guaranteed income or misleading earnings claims.</li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowDocModal(false)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl active:scale-98 transition-transform"
                >
                  {language === 'hi' ? 'समझ गया (Close)' : 'Understood'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
