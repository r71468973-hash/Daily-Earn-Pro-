import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, X, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface AdMobPlaceholderProps {
  language: Language;
}

export const AdMobPlaceholder: React.FC<AdMobPlaceholderProps> = ({ language }) => {
  const t = translations[language];
  const [showDocModal, setShowDocModal] = useState(false);

  return (
    <>
      <div className="w-full my-4 p-3 bg-slate-100/90 dark:bg-slate-800/80 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center transition-colors">
        <div className="flex items-center justify-between gap-2 max-w-sm mx-auto">
          <div className="flex items-center gap-2 text-left">
            <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                {t.admob.placeholderLabel}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {t.admob.notice}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDocModal(true)}
            className="px-2 py-1 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-md text-[10px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 shadow-2xs shrink-0"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Setup</span>
          </button>
        </div>
      </div>

      {showDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Google AdMob SDK Integration Guide
                </h3>
              </div>
              <button
                onClick={() => setShowDocModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl border border-blue-200 dark:border-blue-900">
                <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                  Policy-First Architecture
                </p>
                <p>
                  Daily Earn Pro follows Google AdMob placement policies: no fake ads, no incentive clicking, and ads are strictly disabled by default until you link your own AdMob ID.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1.5">
                  Step 1: Install Capacitor AdMob Plugin
                </h4>
                <div className="bg-slate-900 text-slate-200 font-mono p-2.5 rounded-lg text-[11px] overflow-x-auto">
                  npm install @capacitor-community/admob<br/>
                  npx cap sync android
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1.5">
                  Step 2: Add AdMob App ID in AndroidManifest.xml
                </h4>
                <p className="mb-1 text-[11px]">
                  Inside <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">android/app/src/main/AndroidManifest.xml</code> within <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">&lt;application&gt;</code>:
                </p>
                <div className="bg-slate-900 text-emerald-400 font-mono p-2.5 rounded-lg text-[10px] overflow-x-auto">
                  &lt;meta-data<br/>
                  &nbsp;&nbsp;android:name="com.google.android.gms.ads.APPLICATION_ID"<br/>
                  &nbsp;&nbsp;android:value="ca-app-pub-YOUR_ADMOB_APP_ID~XXXXXXXXXX"/&gt;
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1.5">
                  Step 3: User Consent & Privacy (UMP SDK)
                </h4>
                <p className="text-[11px]">
                  Ensure you initialize Google User Messaging Platform (UMP) for European Economic Area (EEA) and UK users before requesting ads to comply with GDPR.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowDocModal(false)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl active:scale-98 transition-transform"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
